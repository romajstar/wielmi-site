import assert from "node:assert/strict";
import { test } from "node:test";
import type { CaptureResult } from "posthog-js";
import { createEventFilter, EU_INGESTION_HOST, redactText, sanitizeEvent, telemetryEnabled } from "./telemetry-privacy";

const event = (name: string, properties: Record<string, unknown>): CaptureResult => ({
  event: name, properties, uuid: "test-event", timestamp: new Date(),
});

test("telemetry requires production, explicit enablement, a token, and the EU host", () => {
  assert.equal(telemetryEnabled("production", "true", "test-token", EU_INGESTION_HOST), true);
  for (const args of [
    ["development", "true", "test-token", EU_INGESTION_HOST],
    ["production", "false", "test-token", EU_INGESTION_HOST],
    ["production", "true", " ", EU_INGESTION_HOST],
    ["production", "true", "test-token", "https://us.i.posthog.com"],
    ["production", "true", "test-token", undefined],
  ]) assert.equal(telemetryEnabled(...args as [string, string, string, string | undefined]), false);
});

test("only pageviews/exceptions survive and person/form/attribution data is removed", () => {
  for (const name of ["$autocapture", "$pageleave", "$identify", "$snapshot", "$web_vitals", "form_submitted"]) {
    assert.equal(sanitizeEvent(event(name, {})), null);
  }
  assert.equal(sanitizeEvent(null), null);
  const result = sanitizeEvent({ ...event("$pageview", {
    $current_url: "https://wielmi.pl/kontakt/?email=test@example.com#secret",
    $referrer: "https://example.com/private?token=hidden",
    $pathname: "/kontakt/?token=hidden#secret",
    distinct_id: "$posthog_cookieless", $browser: "Chrome",
    email: "test@example.com", $set: { name: "Private Person" },
    utm_source: "test@example.com", $initial_current_url: "https://wielmi.pl/?secret=hidden",
    $exception_personURL: "https://eu.posthog.com/person/private",
  }), $set: { phone: "123456789" }, $set_once: { name: "Private Person" } });
  assert.deepEqual(result?.properties, {
    $process_person_profile: false, $cookieless_mode: true, $current_url: "https://wielmi.pl/kontakt/",
    $referrer: "https://example.com", $pathname: "/kontakt/",
    distinct_id: "$posthog_cookieless", $browser: "Chrome",
  });
  assert.equal(result?.$set, undefined);
  assert.equal(result?.$set_once, undefined);
});

test("exception messages are scrubbed and only known stack fields survive", () => {
  const chunk = "https://wielmi.pl/_next/static/chunks/123456789-ab12.js";
  const result = sanitizeEvent(event("$exception", {
    $exception_list: [{ type: "TypeError", value: "test@example.com token=secret Bearer hidden phc_hidden",
      mechanism: { handled: false, type: "onerror", data: { body: "Private Person" } },
      stacktrace: { frames: [{ filename: `${chunk}?secret=hidden#hash`, function: "render",
        lineno: 12, colno: 34, chunk_id: "0197e6db-9a73-7b91-9e80-4e1b7158db5c",
        vars: { password: "hidden" }, context_line: "Private Person" }] },
    }],
  }));
  const json = JSON.stringify(result);
  for (const sensitive of ["test@example.com", "secret", "hidden", "Private Person", "context_line", "data"]) {
    assert.ok(!json.includes(sensitive), sensitive);
  }
  assert.ok(json.includes(chunk));
  assert.ok(json.includes('"lineno":12'));
  assert.ok(json.includes("0197e6db-9a73-7b91-9e80-4e1b7158db5c"));
  assert.equal(redactText("reference 1234567890"), "reference 1234567890");
});

test("URL credentials and invalid referrers are omitted", () => {
  const result = sanitizeEvent(event("$pageview", {
    $current_url: "https://user:password@wielmi.pl/", $referrer: "javascript:secret",
  }));
  assert.equal(result?.properties.$current_url, undefined);
  assert.equal(result?.properties.$referrer, undefined);
  assert.ok(!redactText("https://wielmi.pl/path?token=secret#hidden").includes("secret"));
});

test("route views deduplicate query/hash changes but count navigation and return visits", () => {
  const filter = createEventFilter();
  const view = (path: string) => filter(event("$pageview", { $current_url: `https://wielmi.pl${path}` }));
  assert.ok(view("/"));
  assert.equal(view("/?email=test@example.com"), null);
  assert.equal(view("/#section"), null);
  assert.ok(view("/kontakt/"));
  assert.equal(view("/kontakt/"), null);
  assert.ok(view("/"));
  assert.ok(view("/kontakt/"));
});

test("duplicate automatic/boundary exceptions are suppressed without silencing later errors", () => {
  let clock = 0;
  const filter = createEventFilter(() => clock);
  const exception = (handled: boolean) => event("$exception", {
    $exception_list: [{ type: "Error", value: "Failed to render", mechanism: { handled },
      stacktrace: { frames: [{ filename: "https://wielmi.pl/app.js", lineno: 5 }] } }],
  });
  assert.ok(filter(exception(false)));
  assert.equal(filter(exception(true)), null);
  clock = 1001;
  assert.ok(filter(exception(true)));
});
