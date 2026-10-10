# Set up PostHog Cloud EU for Wielmi

This site sends only pageviews, pageleaves, Web Vitals, and browser exceptions. It uses always-cookieless collection, no person profiles, no session replay, and no interaction capture. Collection remains disabled until production configuration is supplied. Documentation reviewed on 2026-10-08; dashboard labels can change.

## 1. Register an EU account

1. Open [PostHog Cloud EU](https://eu.posthog.com/) and choose the sign-up option.
2. Register with your work email or a supported sign-in provider and complete any verification shown.
3. Create an organization for Wielmi. Confirm that onboarding selected **EU Cloud** before creating the project; the dashboard should be on `eu.posthog.com`.
4. Rename the initial project to **Wielmi website**, or create a dedicated project through the project switcher. Use this project for both pageviews and Error Tracking.
5. Select Web Analytics/Product Analytics and Error Tracking if onboarding asks which products to use. The integration is already in this repository: skip automatic installation and do not paste a second SDK snippet or run the wizard.

## 2. Configure the project

1. Open **Project settings → Web analytics** and enable **Cookieless server hash mode**. This is required: cookieless events are ignored if it is disabled.
2. Open **Project settings → Error tracking** and enable exception autocapture. Capture unhandled browser errors and unhandled promise rejections; leave console-error capture disabled. The code also enforces these choices.
3. Keep session recording, heatmaps, surveys, product tours, web experiments, and browser Logs collection disabled. Do not add identification rules, person properties, or automatic click/form collection. The code enforces additional restrictions and filters outgoing event types.
4. Review event/error data retention controls available to your account/plan. Record the actual periods and deletion procedure. Retention insights measure returning users; they are not data deletion settings. If your plan does not expose retention controls, confirm the applicable retention with PostHog rather than assuming a period.
5. Update the website privacy policy with the confirmed periods **before enabling production collection**. Account creation and retention confirmation are rollout steps that cannot be completed from repository configuration alone.

Cookieless visitor hashes rotate daily. Treat pageview counts as the main measurement; long-term unique visitor counts, attribution, location, bounce metrics, and engagement metrics will be limited or unavailable with this configuration.

## 3. Find the public project configuration

In **Project settings**, copy the **project token** (often beginning `phc_`).

| Setting | Value | Visibility |
| --- | --- | --- |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | Your project's token | Public; included in browser JavaScript |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://eu.i.posthog.com` | Public ingestion endpoint |
| `NEXT_PUBLIC_POSTHOG_ENABLED` | `true` only when ready for production | Public build flag |

Use the public project token, not a personal API key. The browser uses `eu.i.posthog.com`; the dashboard uses `eu.posthog.com`.

The Hostido production build uploads source maps using `@posthog/nextjs-config`, following the [PostHog Next.js guide](https://posthog.com/docs/error-tracking/upload-source-maps/nextjs). Uploads use `https://eu.posthog.com`, while browser ingestion continues to use `https://eu.i.posthog.com`. Maps are deleted after upload and excluded from the deployed static export. Releases use `wielmi-site` and the GitHub commit SHA.

Create a personal API key with **write access to Error Tracking** and find the numeric project ID in project settings. These are build-only values; never put the personal API key in a `NEXT_PUBLIC_` variable.

## 4. Configure GitHub Actions

Open this repository's **Settings → Secrets and variables → Actions**. The Hostido build runs before the deployment environment is selected, so use **repository-level** variables and secrets for its build configuration. The project and both workflows use pnpm **12.9.1**. `pnpm-workspace.yaml` permits the PostHog CLI, esbuild, and sharp installation scripts; core-js scripts are disabled.

Add these repository **variables**:

```text
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=<public-project-token>
POSTHOG_PROJECT_ID=<numeric-project-id>
```

Add the repository **secret** `POSTHOG_API_KEY=<personal-api-key>`. The Hostido workflow enables source map uploads with `POSTHOG_SOURCEMAPS_ENABLED=true` and fails if either upload credential is missing. The GitHub Pages workflow does not enable source map uploads.

Both workflows currently enable browser telemetry and supply the EU ingestion host. Public variables are baked into the static export: changing a variable does not affect already deployed files.

After successful production verification, remove the unused `SENTRY_AUTH_TOKEN` GitHub secret and any local `.env.sentry-build-plugin` file. Keep the existing Sentry account/history if you need past issues.

## 5. Verify the connection

1. Start with a controlled production build, since `pnpm dev` deliberately sends no telemetry. Copy the public values from `.env.example` into ignored `.env.local`, set enablement to `true` for this test, then run `pnpm build` and serve `out/` using a static file server. Do not use `next start` for a static export.
2. Open browser developer tools and inspect requests to `eu.i.posthog.com`. The event payloads must contain only `$pageview`, `$pageleave`, `$web_vitals`, or `$exception`, with sensitive URL parameters and fragments removed; campaign parameters and standard SDK metadata are retained. Remote configuration and SDK asset requests are normal; they are not additional tracked event types.
3. Load a page, navigate to another page, and use back/forward. Expect one pageview per displayed pathname. Rerenders and query/hash-only changes must not add pageviews.
4. In the EU project's activity feed, filter for `$pageview`. Confirm the sanitized page URL is present. Leave the site and confirm `$pageleave` with pageview linkage, duration, and numeric scroll depth metadata. Bounce rate remains limited without interaction autocapture.
5. Trigger a synthetic uncaught exception using the browser console, for example `setTimeout(() => { throw new Error("Wielmi setup test"); }, 0)`. Also test a synthetic unhandled rejection. Verify `$exception` in the activity feed and an issue in Error Tracking. Console logging alone is intentionally not captured.
6. To test the application error boundary, build locally with `NEXT_PUBLIC_ENABLE_TEST_ERROR_PAGE=true`, then run `pnpm dlx serve out -l 3000` and open `http://localhost:3000/test-error/`. Serve the `out` directory explicitly and omit `-s`/`--single`: the export contains a separate HTML file for each route, so a homepage fallback can hide routing problems. Click **Trigger test error** and expect **Test error caught**, then verify `$exception` reaches the project. The route is hidden by default and the production workflow does not enable it. Changing the flag requires rebuilding; restarting the static server does not change the exported page. Its error UI must remain usable even if telemetry is blocked.
7. Inspect cookies, localStorage, and sessionStorage before/after loading, navigating, and triggering errors. PostHog must create no persistent entries. Confirm no replay or automatic click/form events appear.
8. Confirm production assets contain no `.map` files, served JavaScript contains `//# chunkId=` comments, and a new exception resolves to original source in PostHog Error Tracking. Check the build logs for successful uploads. For a local upload test, set `POSTHOG_SOURCEMAPS_ENABLED=true`, `POSTHOG_API_KEY`, and `POSTHOG_PROJECT_ID` in ignored `.env.local` before building. Ordinary local builds leave uploads disabled and require no private credentials.
9. Rebuild without enablement/token and verify pages still work and send no telemetry. Source map uploads remain disabled in GitHub Pages builds.

If events are missing, check the EU host and project token, the cookieless project setting, build-time enablement, blockers, and network response codes. A successful response should also correspond to an event in the selected EU project's feed. If hosting supplies a CSP, allow the actual EU ingestion/asset hosts required by the SDK. Avoid forwarding test payloads to third-party debugging services.

HTTP `200` acknowledges the request, but cookieless processing can still discard an event afterward. Check ingestion warnings for `cookieless_missing_host` or `cookieless_missing_user_agent`. The final event filter must preserve `$host` and `$raw_user_agent` for server-side hashing; PostHog removes the raw user agent after hashing. The IP comes from the request and does not need to be added by the browser.

A reverse proxy is optional and outside this migration. Direct EU ingestion can be blocked by privacy tools. PostHog's managed proxy requires DNS setup and adds Cloudflare processing; it does not guarantee EU-only edge termination.

## 6. Disable or roll back

Set the production enable variable to `false`, then rebuild and deploy to stop collection. Restore the previous integration commit/configuration if Sentry monitoring must be restored.

## Official references

- [Next.js installation](https://posthog.com/docs/libraries/next-js)
- [Cookieless tracking](https://posthog.com/tutorials/cookieless-tracking)
- [JavaScript configuration](https://posthog.com/docs/libraries/js/config)
- [Next.js error tracking](https://posthog.com/docs/error-tracking/installation/nextjs)
- [Connection troubleshooting](https://posthog.com/docs/product-analytics/troubleshooting)
