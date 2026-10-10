# Develop browser verification — 2026-10-10

Target: https://romajstar.github.io/wielmi-site/
Browser: Chrome 154, deployed SDK 1.438.2.
PostHog evidence: https://eu.posthog.com/project/298546/activity/events

## Completed checks

- **4.3:** Initial homepage load, client navigation to `/o-nas/`, back to homepage, forward to `/o-nas/`, navigation to `/kontakt/`, back and forward produced seven pageviews in the EU activity feed: homepage ×2, about ×3, contact ×2. Combined query/hash changes and subsequent separate query-only/hash-only `history.pushState` changes produced no additional pageviews. Opening/closing the menu did not add pageviews. Two synthetic uncaught errors and two asynchronous rejected promises produced four exception events, matching the four actual triggers. A console-evaluated rejected promise was not treated as evidence; asynchronous rejections were used for verification.
- **4.5:** `document.cookie` was empty and localStorage/sessionStorage had no keys on initial inspection, after navigation/error capture, and after reload with remote project configuration loaded. Observed PostHog assets included only versioned Web Vitals and exception autocapture scripts plus project config and EU ingestion requests; no replay asset/request was observed. No analytics banner was present. The activity feed contained only pageviews, Web Vitals, and the synthetic exceptions during the observed run. PostHog's project dashboard also reported recordings disabled.
- **4.9 (develop):** Web Vitals and exception scripts loaded from `eu-assets.i.posthog.com/static/1.438.2/` with HTTP 200, as did remote configuration and ingestion requests. The EU activity feed showed matching develop pageviews and exceptions, establishing stored event delivery rather than relying on HTTP 200 alone. No blocking CSP behavior was observed on GitHub Pages.

## Partial and pending checks

- **4.4 (local production build):** Completed separately against the latest instrumented static build. See [`verification-4.4.json`](verification-4.4.json) for captured/decoded request assertions. It verified uncaught errors, unhandled rejections, route boundary and global boundary captures, exception redaction and stack frames, URL redaction including nested Web Vitals fields, no contact form values, and no SDK `/flags` request or `person_properties`. It exposed two leaks during testing, both fixed before final verification.
- **4.6 (local production export):** Built once with telemetry disabled and an empty token, then with telemetry enabled, a synthetic token, and the test-error route enabled. In the disabled build, the homepage and `/test-error/` loaded, the route error boundary rendered its recovery UI after a synthetic exception, and no PostHog global initialized. In the enabled build, the compiled EU API host was rewritten only in a temporary copy of the static artifact to point at the local static server; this kept all telemetry on localhost and made SDK requests fail with HTTP 501. The browser still navigated between routes, rendered the route error recovery UI, and remained usable after synthetic uncaught errors and an unhandled rejection. Server logs showed ingestion retries through `retry_count=3`; no alternate tracking host was contacted. Existing `src/lib/telemetry.spec.ts` also exercises thrown SDK initialization and capture calls. This verifies the app's best-effort behavior locally; it does not independently test the production network path or all possible remote configuration failures.
- **4.7:** Public build-artifact enumeration and Hostido source-map upload/original-source resolution were not verified here. Develop's source-map uploads are disabled by workflow configuration.
- **4.8:** No Sentry credential deletion or archive was performed.
- **4.10:** Hostido delivery/storage/navigation/CSP smoke checks remain required after production deployment.

Only synthetic exception messages and URL values were used; no contact forms were submitted. Local browser diagnostic wrappers were discarded by the final reload. The run created four synthetic exception events in the connected EU project; they were not deleted.
