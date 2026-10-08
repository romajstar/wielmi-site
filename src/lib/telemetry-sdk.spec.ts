import assert from "node:assert/strict";
import { mock, test } from "node:test";
import type { CaptureResult } from "posthog-js";

test("real SDK captures sanitized views and browser errors without persistence", async () => {
  const userAgentDescriptor = Object.getOwnPropertyDescriptor(window.navigator, "userAgent");
  const globalUserAgentDescriptor = Object.getOwnPropertyDescriptor(navigator, "userAgent");
  Object.defineProperty(window.navigator, "userAgent", {
    configurable: true,
    value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  });
  Object.defineProperty(navigator, "userAgent", { configurable: true, value: window.navigator.userAgent });
  const visibilityDescriptor = Object.getOwnPropertyDescriptor(document, "visibilityState");
  Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
  const { default: sdk } = await import("posthog-js");
  // Preload the same SDK error wrapper that production loads from its versioned CDN asset.
  await import("posthog-js/lib/src/entrypoints/exception-autocapture.js");
  const original = { ...process.env };
  const events: CaptureResult[] = [];
  const requests: string[] = [];
  const originalCookie = document.cookie;
  const originalLocal = { ...window.localStorage };
  const originalSession = { ...window.sessionStorage };
  let removeListener = () => {};
  mock.method(Object.getPrototypeOf(sdk), "_send_request", (options: { url: string; callback?: (response: unknown) => void }) => {
    requests.push(options.url);
    // Simulate a successful endpoint; this test must never send telemetry to a real project.
    options.callback?.({ statusCode: 200, json: {} });
  });
  try {
    Object.assign(process.env, {
      NODE_ENV: "production", NEXT_PUBLIC_POSTHOG_ENABLED: "true",
      NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: "phc_synthetic_test",
      NEXT_PUBLIC_POSTHOG_HOST: "https://eu.i.posthog.com",
    });
    const { initializeTelemetry, captureError } = await import("./telemetry");
    initializeTelemetry();
    removeListener = sdk.on("eventCaptured", (event) => events.push(event));
    await new Promise((resolve) => setTimeout(resolve, 10));
    assert.equal(sdk.config.cookieless_mode, "always", "test observes the initialized SDK singleton");
    assert.equal(events.filter((item) => item.event === "$pageview").length, 1);

    const navigate = async (path: string) => {
      window.history.pushState({}, "", path);
      await new Promise((resolve) => setTimeout(resolve, 10));
    };
    await navigate("/?email=test@example.com#private");
    await navigate("/kontakt/?token=hidden");
    await navigate("/kontakt/#section");
    await navigate("/");
    assert.equal(events.filter((item) => item.event === "$pageview").length, 3);

    const error = new Error("Failed for test@example.com token=hidden");
    error.stack = "Error: Failed\n    at render (https://wielmi.pl/_next/static/chunks/123456789-app.js?token=hidden:10:15)";
    window.dispatchEvent(new window.ErrorEvent("error", { error, message: error.message }));
    captureError(error);
    const rejected = new Error("Rejected for test@example.com");
    const rejection = new window.Event("unhandledrejection");
    Object.defineProperty(rejection, "reason", { value: rejected });
    window.dispatchEvent(rejection);
    captureError(new Error("Handled by global boundary"));
    assert.equal(events.filter((item) => item.event === "$exception").length, 3);

    sdk.capture("$autocapture", { email: "test@example.com" });
    sdk.capture("$pageleave");
    assert.ok(events.every((item) => item.event === "$pageview" || item.event === "$exception"));
    assert.ok(events.every((item) => item.properties.token === "phc_synthetic_test"
      && item.properties.$cookieless_mode === true && item.properties.distinct_id === "$posthog_cookieless"));
    const serialized = JSON.stringify(events);
    assert.ok(!serialized.includes("test@example.com"));
    assert.ok(!serialized.includes("hidden"));
    assert.ok(serialized.includes("123456789-app.js"));
    assert.equal(document.cookie, originalCookie);
    assert.deepEqual({ ...window.localStorage }, originalLocal);
    assert.deepEqual({ ...window.sessionStorage }, originalSession);
    await sdk.shutdown();
    assert.ok(requests.every((url) => url.startsWith("https://eu.i.posthog.com")));
  } finally {
    sdk.set_config({ capture_exceptions: false, capture_pageview: false });
    await sdk.shutdown();
    removeListener();
    mock.restoreAll();
    process.env = original;
    if (userAgentDescriptor) Object.defineProperty(window.navigator, "userAgent", userAgentDescriptor);
    else Reflect.deleteProperty(window.navigator, "userAgent");
    if (globalUserAgentDescriptor) Object.defineProperty(navigator, "userAgent", globalUserAgentDescriptor);
    else Reflect.deleteProperty(navigator, "userAgent");
    if (visibilityDescriptor) Object.defineProperty(document, "visibilityState", visibilityDescriptor);
    else Reflect.deleteProperty(document, "visibilityState");
  }
});
