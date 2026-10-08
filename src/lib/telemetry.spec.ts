import assert from "node:assert/strict";
import { mock, test } from "node:test";
import type { PostHogConfig } from "posthog-js";

let failInit = false;
const initialize = mock.fn((_token: string, _config: Partial<PostHogConfig>) => {
  if (failInit) throw new Error("SDK unavailable");
});
const capture = mock.fn((_error: unknown) => { throw new Error("Ingestion blocked"); });
mock.module("posthog-js", { defaultExport: { init: initialize, captureException: capture } });

test("guarded initialization and error capture preserve the site when telemetry fails", async () => {
  const original = { ...process.env };
  try {
    const { initializeTelemetry, captureError } = await import("./telemetry");
    Object.assign(process.env, { NODE_ENV: "development" });
    process.env.NEXT_PUBLIC_POSTHOG_ENABLED = "true";
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN = "synthetic-token";
    process.env.NEXT_PUBLIC_POSTHOG_HOST = "https://eu.i.posthog.com";
    initializeTelemetry();
    captureError(new Error("Disabled"));
    assert.equal(initialize.mock.calls.length, 0);
    assert.equal(capture.mock.calls.length, 0);

    Object.assign(process.env, { NODE_ENV: "production" });
    failInit = true;
    assert.doesNotThrow(initializeTelemetry);
    failInit = false;
    initializeTelemetry();
    initializeTelemetry();
    assert.equal(initialize.mock.calls.length, 2);
    const config = initialize.mock.calls[1].arguments[1];
    assert.equal(config.cookieless_mode, "always");
    assert.equal(config.person_profiles, "never");
    assert.equal(config.disable_persistence, true);
    assert.equal(config.autocapture, false);
    assert.equal(config.capture_pageleave, false);
    assert.equal(config.disable_session_recording, true);
    assert.deepEqual(config.capture_exceptions, {
      capture_unhandled_errors: true, capture_unhandled_rejections: true, capture_console_errors: false,
    });
    const error = new Error("Boundary failure");
    assert.doesNotThrow(() => captureError(error));
    captureError(error);
    assert.equal(capture.mock.calls.length, 1);
  } finally {
    process.env = original;
  }
});
