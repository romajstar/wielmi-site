## Why
Replace Sentry with PostHog Cloud EU to monitor browser errors and measure pageviews in one service. Use always-cookieless collection without browser persistence or session replay.

## What Changes
- Remove the Sentry dependency, Next.js build wrapper, client/server/edge instrumentation, and CI configuration.
- Add browser-only PostHog error tracking and pageview collection for the production site, compatible with static export.
- Configure always-cookieless mode, no person profiles, no session replay, and no automatic interaction capture. Limit application events to `$exception`, `$pageview`, `$pageleave`, and `$web_vitals`.
- Capture initial loads and client-side page navigation once; capture unhandled browser errors, rejected promises, and errors handled by the existing global error boundary.
- Sanitize telemetry before transmission, excluding contact-form data, sensitive URL parameters, and identifying exception content.
- Upload source maps from Hostido production builds using build-only credentials; delete maps after upload and reject public artifacts containing maps. Leave uploads disabled for ordinary and GitHub Pages builds.
- Document creation of a new PostHog Cloud EU project, required project settings, public build variables, and verification steps.
- Update the Polish privacy policy to disclose cookieless pageview measurement and error monitoring; retain the existing absence of an analytics consent banner.

## Impact
- Affected specs: new `observability` and `privacy` capabilities. Only `platform` currently exists in canonical specs; the archived `replace-ga-with-privacy-analytics` change contains privacy requirements that were never incorporated into `openspec/specs`. This proposal supersedes its prohibition on third-party analytics while retaining its no-banner behavior.
- Affected code: `package.json`, `pnpm-lock.yaml`, `next.config.mjs`, `src/instrumentation-client.ts`, `src/instrumentation.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `src/app/global-error.tsx`, optional shared telemetry/pageview helpers, `src/app/polityka-prywatnosci/page.tsx`, both deployment workflows, `.gitignore`, setup documentation, and `openspec/project.md`.
- External setup: PostHog Cloud EU project settings, configured retention, public project token, and build-only upload credentials must be confirmed for rollout.
- Sentry replay, tracing, and log collection will be retired. Existing Sentry history remains in Sentry; no historical event migration is included.
- Browser telemetry is enabled in both deployment workflows when the public project token is supplied; live rollout verification remains pending.
