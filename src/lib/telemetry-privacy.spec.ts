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

test("only pageviews/pageleaves/exceptions/web vitals survive and person/form/attribution data is removed", () => {
  for (const name of ["$autocapture", "$identify", "$snapshot", "form_submitted"]) {
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

test("cookieless hash inputs survive for pageviews and exceptions", () => {
  for (const name of ["$pageview", "$pageleave", "$exception"]) {
    const result = sanitizeEvent(event(name, {
      $host: "romajstar.github.io", $raw_user_agent: "Mozilla/5.0 Chrome/130.0.0.0",
      $current_url: "https://romajstar.github.io/wielmi-site/?token=private",
      email: "private@example.com",
    }));
    assert.equal(result?.properties.$host, "romajstar.github.io");
    assert.equal(result?.properties.$raw_user_agent, "Mozilla/5.0 Chrome/130.0.0.0");
    assert.equal(result?.properties.$current_url, "https://romajstar.github.io/wielmi-site/");
    assert.equal(result?.properties.email, undefined);
  }
});

test("pageleaves retain timing and view linkage without exception deduplication", () => {
  const filter = createEventFilter();
  const leave = event("$pageleave", {
    $current_url: "https://wielmi.pl/kontakt/?token=hidden#secret",
    $prev_pageview_pathname: "/kontakt/?token=hidden#secret",
    $pageview_id: "view-id", $prev_pageview_id: "view-id", $prev_pageview_duration: 12.5,
    email: "private@example.com", $prev_pageview_max_scroll: 123,
  });
  for (let i = 0; i < 2; i++) {
    const result = filter(leave);
    assert.equal(result?.properties.$prev_pageview_duration, 12.5);
    assert.equal(result?.properties.$prev_pageview_id, "view-id");
    assert.equal(result?.properties.$current_url, "https://wielmi.pl/kontakt/");
    assert.equal(result?.properties.$prev_pageview_pathname, "/kontakt/");
    assert.equal(result?.properties.email, undefined);
    assert.equal(result?.properties.$prev_pageview_max_scroll, undefined);
  }
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

test("web vitals retain metrics without DOM entries, attribution, or sensitive URLs", () => {
  const result = sanitizeEvent(event("$web_vitals", {
    $current_url: "https://wielmi.pl/?token=private", $web_vitals_LCP_value: 1200,
    $web_vitals_LCP_event: { name: "LCP", value: 1200, rating: "good", id: "metric-id",
      entries: [{ element: "private DOM" }], attribution: { url: "https://private.example" } },
    $web_vitals_unknown_value: 123, email: "private@example.com",
  }));
  assert.equal(result?.properties.$web_vitals_LCP_value, 1200);
  assert.deepEqual(result?.properties.$web_vitals_LCP_event, { name: "LCP", value: 1200, rating: "good", id: "metric-id" });
  assert.equal(result?.properties.$current_url, "https://wielmi.pl/");
  assert.ok(!JSON.stringify(result).includes("private"));
});
