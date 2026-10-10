import assert from "node:assert/strict";
import { test } from "node:test";
import type { CaptureResult } from "posthog-js";
import { sanitizeEvent } from "./telemetry-privacy";

const event = (name: string, properties: Record<string, unknown>): CaptureResult => ({
  event: name, properties, uuid: "test", timestamp: new Date(),
});

test("standard analytics fields and campaign parameters survive", () => {
  const properties = { $current_url: "https://wielmi.pl/?utm_source=google&email=private@example.com#section",
    $session_id: "session", $prev_pageview_max_scroll_percentage: 0.8,
    $web_vitals_LCP_value: 1200, $web_vitals_LCP_event: { name: "LCP", value: 1200 },
    utm_source: "google", new_sdk_field: "preserved" };
  const result = sanitizeEvent(event("$web_vitals", properties));
  assert.deepEqual(result?.properties, { ...properties, $current_url: "https://wielmi.pl/?utm_source=google" });
  assert.equal(properties.$current_url.includes("email="), true);
  assert.equal(sanitizeEvent(event("$autocapture", {})), null);
});

test("exception strings are redacted without discarding SDK diagnostic fields", () => {
  const result = sanitizeEvent(event("$exception", { $exception_list: [{
    value: "Failed for private@example.com token=hidden", custom_diagnostic: 42,
    stacktrace: { frames: [{ filename: "https://wielmi.pl/app.js?token=hidden", lineno: 10 }] },
  }] }));
  const serialized = JSON.stringify(result);
  assert.ok(!serialized.includes("private@example.com"));
  assert.ok(!serialized.includes("hidden"));
  assert.ok(serialized.includes("custom_diagnostic"));
  assert.ok(serialized.includes("app.js"));
});

test("real SDK Web Vitals URL copies cannot leak sensitive navigation parameters", () => {
  const url = "https://wielmi.pl/kontakt/?email=synthetic@example.invalid&token=synthetic-secret&utm_source=wire-check#private";
  const metrics = Object.fromEntries(["FCP", "LCP", "CLS", "INP"].map((name) => [
    `$web_vitals_${name}_event`, {
      name, value: 236, rating: "good", delta: 236, navigationId: 9038,
      navigationType: "navigate", navigationURL: url, $current_url: url,
      navigationStartTime: 0, timestamp: 1791664404681,
    },
  ]));
  const input = event("$web_vitals", { $current_url: url, ...metrics });
  const result = sanitizeEvent(input)!;
  const payload = JSON.stringify(result);
  assert.ok(!payload.includes("synthetic@example.invalid"));
  assert.ok(!payload.includes("synthetic-secret"));
  assert.ok(!payload.includes("#private"));
  for (const name of ["FCP", "LCP", "CLS", "INP"]) {
    const key = `$web_vitals_${name}_event`;
    assert.deepEqual(result.properties[key], {
      ...metrics[key], navigationURL: "https://wielmi.pl/kontakt/?utm_source=wire-check",
      $current_url: "https://wielmi.pl/kontakt/?utm_source=wire-check",
    });
    assert.equal(input.properties[key].navigationURL, url, "original SDK payload must not be mutated");
  }
});
