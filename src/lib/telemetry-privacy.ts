import type { CaptureResult } from "posthog-js";

const sensitiveParameter = /^(email|phone|name|message|password|secret|token|access_token|api[_-]?key|authorization)$/i;

function safeUrl(value: string): string {
  try {
    const url = new URL(value, "https://placeholder.invalid");
    url.username = "";
    url.password = "";
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (sensitiveParameter.test(key)) url.searchParams.delete(key);
    }
    return value.startsWith("/") ? `${url.pathname}${url.search}` : url.toString();
  } catch {
    return value;
  }
}

export function redactText(value: string): string {
  return value
    .replace(/https?:\/\/[^\s"'<>]+/gi, (url) => safeUrl(url))
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted]")
    .replace(/\bBearer\s+[^\s,;]+/gi, "Bearer [redacted]")
    .replace(/\b(?:phc_|phx_|sk_)[\w-]+/g, "[redacted]")
    .replace(/\beyJ[\w-]+\.[\w-]+\.[\w-]+/g, "[redacted]")
    .replace(/\b(password|secret|token|api[_-]?key|authorization)\s*[:=]\s*(?:"[^"]*"|'[^']*'|[^\s,;]+)/gi, "$1=[redacted]");
}

const allowedEvents = new Set(["$pageview", "$pageleave", "$exception", "$web_vitals"]);

/** Preserve SDK metadata; scrub URL parameters and exception text only. */
export function sanitizeEvent(event: CaptureResult | null): CaptureResult | null {
  if (!event || !allowedEvents.has(event.event)) return null;
  const properties = { ...event.properties };
  for (const key of ["$current_url", "$initial_current_url", "$referrer", "$initial_referrer", "$pathname", "$prev_pageview_pathname"]) {
    if (typeof properties[key] === "string") properties[key] = safeUrl(properties[key]);
  }
  if (event.event === "$exception" && Array.isArray(properties.$exception_list)) {
    // Error payloads are plain JSON; preserve SDK fields while redacting strings.
    properties.$exception_list = JSON.parse(JSON.stringify(properties.$exception_list,
      (_key, value) => typeof value === "string" ? redactText(value) : value));
  }
  return { ...event, properties };
}
