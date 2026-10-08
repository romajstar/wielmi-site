import type { CaptureResult } from "posthog-js";

export const EU_INGESTION_HOST = "https://eu.i.posthog.com";

export function telemetryEnabled(environment: string | undefined, enabled: string | undefined,
  token: string | undefined, host: string | undefined): boolean {
  return environment === "production" && enabled === "true" && !!token?.trim() && host === EU_INGESTION_HOST;
}

function safeUrl(value: string, originOnly = false): string | undefined {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return undefined;
    return originOnly ? url.origin : `${url.origin}${url.pathname}`;
  } catch {
    return originOnly ? undefined : value.split(/[?#]/)[0];
  }
}

export function redactText(value: string): string {
  return value
    .replace(/https?:\/\/[^\s"'<>]+/gi, (url) => safeUrl(url) ?? "[redacted]")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted]")
    .replace(/\bBearer\s+[^\s,;]+/gi, "Bearer [redacted]")
    .replace(/\b(?:phc_|phx_|sk_)[\w-]+/g, "[redacted]")
    .replace(/\beyJ[\w-]+\.[\w-]+\.[\w-]+/g, "[redacted]")
    .replace(/\b(password|secret|token|api[_-]?key|authorization)\s*[:=]\s*(?:"[^"]*"|'[^']*'|[^\s,;]+)/gi, "$1=[redacted]");
}

const contextKeys = new Set([
  "token", "$config_defaults", "$lib", "$lib_version", "$browser", "$browser_version", "$os", "$os_version",
  "$device_type", "$viewport_height", "$viewport_width", "$screen_height", "$screen_width",
  "$exception_level", "$exception_is_synthetic", "$release_id",
]);
type ExceptionRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ExceptionRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pickFields(source: ExceptionRecord, fields: readonly string[]): ExceptionRecord {
  return Object.fromEntries(fields.filter((key) => source[key] !== undefined).map((key) => [key, source[key]]));
}

function sanitizeFrame(value: unknown): ExceptionRecord | undefined {
  if (!isRecord(value)) return undefined;
  const frame = pickFields(value, ["filename", "abs_path", "function", "module", "lineno", "colno", "in_app",
    "platform", "source", "id", "chunk_id", "debug_id"]);
  for (const key of ["filename", "abs_path"] as const) {
    if (typeof frame[key] === "string") frame[key] = redactText(safeUrl(frame[key] as string) ?? "[redacted]");
  }
  return frame;
}

function sanitizeException(value: unknown): ExceptionRecord | undefined {
  if (!isRecord(value)) return undefined;
  const exception = pickFields(value, ["type", "platform", "handled", "synthetic", "exception_id", "parent_id"]);
  if (typeof value.value === "string") exception.value = redactText(value.value);

  if (isRecord(value.mechanism)) {
    exception.mechanism = pickFields(value.mechanism, ["type", "handled"]);
  }

  if (isRecord(value.stacktrace) && Array.isArray(value.stacktrace.frames)) {
    exception.stacktrace = {
      frames: value.stacktrace.frames.slice(0, 100).flatMap((frame) => {
        const sanitized = sanitizeFrame(frame);
        return sanitized ? [sanitized] : [];
      }),
    };
  }
  return exception;
}

function sanitizeExceptionList(value: unknown): ExceptionRecord[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.slice(0, 100).flatMap((item) => {
    const sanitized = sanitizeException(item);
    return sanitized ? [sanitized] : [];
  });
}

/** Sanitize the final enriched SDK payload, including top-level person updates. */
export function sanitizeEvent(event: CaptureResult | null): CaptureResult | null {
  if (!event) return null;
  if (event.event !== "$pageview" && event.event !== "$exception") return null;
  const properties: CaptureResult["properties"] = {
    $process_person_profile: false, $cookieless_mode: true, distinct_id: "$posthog_cookieless",
  };
  for (const [key, value] of Object.entries(event.properties)) {
    if (key === "$current_url" || key === "$referrer") {
      if (typeof value === "string") properties[key] = safeUrl(value, key === "$referrer");
    } else if (key === "$pathname" && typeof value === "string") {
      properties[key] = redactText(value.split(/[?#]/)[0]);
    } else if (key === "$exception_list" && event.event === "$exception") {
      properties[key] = sanitizeExceptionList(value);
    } else if (contextKeys.has(key) && (typeof value === "string" || typeof value === "number" || typeof value === "boolean")) {
      properties[key] = key === "token" || key === "$release_id" ? value
        : typeof value === "string" ? redactText(value) : value;
    }
  }
  return { event: event.event, properties, timestamp: event.timestamp, uuid: event.uuid };
}

/** Stateful only in memory; adjacent identical views and duplicate error paths are discarded. */
export function createEventFilter(now: () => number = Date.now) {
  let lastPath: string | undefined;
  const recentErrors = new Map<string, number>();
  return (event: CaptureResult | null): CaptureResult | null => {
    const sanitized = sanitizeEvent(event);
    if (!sanitized) return null;
    if (sanitized.event === "$pageview") {
      const path = sanitized.properties.$current_url;
      if (typeof path !== "string" || path === lastPath) return null;
      lastPath = path;
    } else {
      const list = sanitized.properties.$exception_list;
      const fingerprint = JSON.stringify(Array.isArray(list) ? list.map(({ type, value, stacktrace }) => ({ type, value, stacktrace })) : list);
      const timestamp = now();
      for (const [key, time] of recentErrors) if (timestamp - time > 1000) recentErrors.delete(key);
      if (recentErrors.has(fingerprint)) return null;
      recentErrors.set(fingerprint, timestamp);
    }
    return sanitized;
  };
}
