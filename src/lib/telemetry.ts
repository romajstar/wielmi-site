import posthog from "posthog-js";
import type { PostHogConfig } from "posthog-js";
import { sanitizeEvent } from "./telemetry-privacy";

let initialized = false;
const capturedErrors = new WeakSet<object>();

function telemetryEnabled(): boolean {
  return process.env.NODE_ENV === "production"
    && process.env.NEXT_PUBLIC_POSTHOG_ENABLED === "true"
    && !!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim()
    && process.env.NEXT_PUBLIC_POSTHOG_HOST === "https://eu.i.posthog.com";
}

export function initializeTelemetry(): void {
  if (initialized || typeof window === "undefined" || !telemetryEnabled()) return;

  const config: Partial<PostHogConfig> = {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    ui_host: "https://eu.posthog.com",
    defaults: "2026-08-30",
    cookieless_mode: "always",
    person_profiles: "never",
    disable_persistence: true,
    // Keep compression enabled: uncompressed unload beacons are rejected by /i/v0/e/.
    disable_compression: false,
    autocapture: false,
    capture_pageview: "history_change",
    capture_pageleave: true,
    disable_scroll_properties: false,
    capture_dead_clicks: false,
    rageclick: false,
    capture_heatmaps: false,
    capture_performance: { web_vitals: true, web_vitals_attribution: false },
    disable_session_recording: true,
    disable_surveys: true,
    disable_conversations: true,
    disable_product_tours: true,
    disable_web_experiments: true,
    opt_in_site_apps: false,
    enable_recording_console_log: false,
    strict_script_versioning: true,
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    before_send: sanitizeEvent,
  };
  try {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, config);
    initialized = true;
  } catch {
    // Monitoring is best-effort and must never prevent the site from rendering.
  }
}

export function captureError(error: unknown): void {
  if (!initialized) return;
  if (typeof error === "object" && error !== null) {
    if (capturedErrors.has(error)) return;
    capturedErrors.add(error);
  }
  try {
    posthog.captureException(error);
  } catch {
    // Preserve the existing error boundary even if telemetry is unavailable.
  }
}
