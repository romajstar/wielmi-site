## Context
The site runs Next.js 15.5.9 with `output: "export"` and deploys static assets to Hostido from `main`; `develop` deploys to GitHub Pages. Sentry currently supplies browser error capture, replay, tracing, source-map uploads, and server/edge hooks. Static hosting has no request-time Next.js server to instrument.

The user selected errors plus pageviews, PostHog Cloud EU, and cookieless operation. There is no PostHog project yet. An earlier archived change removed Google Analytics and its banner, but its privacy delta is absent from canonical specs. The live privacy policy still states that no third-party analytics are used. The separate `add-portfolio-page` change does not overlap this proposal.

## Goals / Non-Goals
- Goals: browser error diagnostics with bundled JavaScript stacks; pageview counts on loads and route changes; EU ingestion; no telemetry cookies or browser storage; explicit privacy disclosures; reliable static builds.
- Non-goals: session replay, click/form autocapture, conversion events, user identification, cross-day visitor tracking, feature flags, surveys, console-log collection, performance tracing, server/edge monitoring, historical Sentry data migration, or changes to hosting.

## Decisions
### Browser integration and event scope
Use `posthog-js` in `src/instrumentation-client.ts`, with a shared guarded capture helper accessible to `src/app/global-error.tsx`. Do not install a server SDK or add API routes, middleware, or a Next.js reverse proxy. Retain the existing error UI and prevent telemetry failures from disrupting rendering.

The official Next.js guide recommends this entry point for Next.js 15.3+, which includes this project's version. Import the initialized SDK directly in client helpers; a React provider is unnecessary for this scope. Install through pnpm and commit the resolved versions in the lockfile. Review the SDK defaults date explicitly during implementation; the current configuration reference lists `2026-08-30` as its latest date, while the Next.js walkthrough still shows `2026-05-30`. Do not copy placeholders or assume walkthrough defaults enforce this proposal's privacy requirements. Prefer manual integration over running the wizard because the required event scope and existing build wrappers are already specified.

Enable browser exception capture for uncaught errors and unhandled promise rejections; explicitly report errors handled by the global boundary. Do not capture console messages. Verify that the same error is not reported twice through boundary and automatic capture paths.

Set `capture_exceptions` explicitly using the selected SDK's typed configuration, rather than leaving it undefined and dependent on project settings. Enable unhandled errors/rejections and disable console-error capture. Mirror exception autocapture in the EU project's Error Tracking settings for setup clarity. Use `captureException(error)` for boundary reporting rather than manually constructing `$exception` events.

Use one pageview mechanism. Disable SDK automatic pageviews if using an explicit route observer. Record the initial page and changes to the pathname, including back/forward navigation, exactly once. Query-only and hash-only changes do not add pageviews. React rerenders and effect replay must not add duplicates. Select the mechanism supported by the installed SDK after verifying App Router behavior rather than combining automatic and manual pageviews.

The documented SPA mechanism is `capture_pageview: "history_change"`; it is independent of interaction `autocapture`. Prefer this mechanism if verification confirms the pathname-only contract, with event filtering/deduplication where necessary. Otherwise use `capture_pageview: false` and one explicit pathname observer. Enable `capture_pageleave: true` to measure time spent on the final page. Preserve `$pageview_id`, `$prev_pageview_id`, `$prev_pageview_duration`, and sanitized `$prev_pageview_pathname` for page timing and linkage.

### Cookieless configuration
Set `cookieless_mode: "always"` and `person_profiles: "never"`. Never call `identify`, `alias`, or provide persistent user identifiers. Enable the project-side Cookieless server hash mode before rollout. Explicitly disable replay, interaction autocapture, heatmaps, surveys, web-vital events, and other collection outside pageviews, pageleaves, and exceptions using the selected SDK's supported options. Pin privacy-sensitive options instead of relying on SDK defaults or remote project toggles.

Concrete configuration includes `autocapture: false`, `capture_dead_clicks: false`, `rageclick: false`, `capture_heatmaps: false`, `capture_performance: { web_vitals: true, web_vitals_attribution: false }`, `disable_session_recording: true`, `disable_surveys: true`, and `enable_recording_console_log: false`. Do not configure browser Logs collection. Use `disable_persistence: true` as an additional storage safeguard, without substituting it for cookieless server hashing. Check these options against the installed package's types. The configuration reference states that cookieless events are ignored unless the project setting is enabled. Avoid disabling `/flags` merely as an optimization until error capture and remote-configuration dependencies are verified.

### EU routing and activation
Use `https://eu.i.posthog.com` for browser ingestion and `https://eu.posthog.com` for the dashboard. Document `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`, and `NEXT_PUBLIC_POSTHOG_ENABLED`. Initialize only when the build is production, the explicit enable flag is true, and a project token and valid EU host are configured. Otherwise send no telemetry and keep builds and the site functional.

Set enablement and credentials in the Hostido production workflow. Keep local development, ordinary builds without configuration, and the GitHub Pages preview disabled. Both workflows lose Sentry settings. Static export embeds public configuration at build time; changing these variables requires rebuilding. The project ingestion token is public; no private PostHog API key or numeric project ID is required for the initial rollout.

Set `ui_host: "https://eu.posthog.com"` explicitly. If hosting applies a Content Security Policy, inspect actual ingestion and SDK asset requests and permit the required EU hosts; the SDK can load feature scripts even when installed via npm. Do not add replay-specific worker permissions for disabled replay. Use `strict_script_versioning: true` where the selected asset path supports versioned scripts, as recommended by the configuration reference.

### Connection alternatives
PostHog recommends a reverse proxy before production to reduce blocked event delivery, but documents that it is not required. Keep direct EU ingestion for this change to avoid adding DNS/infrastructure scope. This is a conscious trade-off: blocked requests can reduce pageview/error counts.

A future managed proxy would work with static hosting by adding a DNS CNAME to the target generated for the EU organization, waiting for a live certificate, and using that subdomain as `api_host` with EU `ui_host`. It must not use Next.js rewrites on this static export. The managed proxy uses Cloudflare and does not guarantee EU-only edge termination, although events are ingested in the selected PostHog region. Revisit this choice only if more complete collection is needed; no DNS or account changes are authorized by this documentation review.

### Data minimization
Use a final outgoing-event filter, such as the SDK's `before_send`, to allow only `$pageview`, `$pageleave`, and `$exception` and sanitize their payloads. Keep SDK-required event structure and error grouping fields intact. Strip query strings and fragments from URL-bearing properties and stack-frame URLs; omit query-derived attribution properties. Retain only referrer origin when needed. Exclude form values, DOM contents, request bodies/headers, user/person properties, and exception-local variables. Allowlist the known exception and stack-frame structure, redact email addresses and recognizable credentials/tokens in exception messages, and discard unapproved nested fields. Avoid broad phone-number matching: it risks corrupting numeric identifiers and filenames, while still missing many real-world formats. Verify the final transmitted payload, including SDK-enriched properties.

Update the Polish privacy policy to describe the purposes, provider, EU hosting, collected technical data, lack of browser persistence and identification, and actual retention settings. Do not describe cookieless telemetry as collecting no personal data: PostHog receives network metadata to derive its server-side daily hash. Keeping the banner absent is the chosen product behavior, not a claim that SDK configuration alone establishes legal compliance.

### Source maps and Sentry removal
Preserve image-export and bundle-analyzer wrappers when removing `withSentryConfig`. Remove unused server/edge hooks and configuration; update the global boundary to the guarded PostHog helper. Remove Sentry CI token references and obsolete ignored build-plugin configuration. Leave archive history intact.

Defer source-map uploads for the initial rollout at the user's request. Keep `productionBrowserSourceMaps: false` and omit the PostHog build wrapper, CLI, custom upload/cleanup scripts, private API keys, project IDs, and release configuration. Browser exceptions still carry sanitized stack frames, but these refer to bundled JavaScript. Inspect the static export to confirm no `.map` files are deployed. Revisit uploads if debugging captured errors becomes difficult.

## Risks / Trade-offs
- Cookieless hashes change daily and can merge visitors sharing network/browser characteristics; treat pageviews as the core metric, not long-term unique-user counts.
- Pageviews plus pageleaves improve session duration and bounce measurement. Interaction- and performance-based metrics remain limited because interaction autocapture and performance collection are disabled.
- Removing replay and tracing reduces debugging context; sanitized bundled stack traces and page context remain available, but original TypeScript file/line resolution is deferred.
- SDK defaults or project settings can enable unwanted collection; explicit settings, an event allowlist, and browser network/storage inspection guard the intended scope.
- Aggressive redaction can remove useful error details; retain exception types and safe stack frames and verify issue grouping.
- Ad blockers or service outages can prevent delivery; keep collection best-effort and the site functional.

## Migration Plan
1. Review and approve this proposal.
2. Create/configure a PostHog Cloud EU project; enable cookieless server hashing and configure retention. Obtain its public project token.
3. Replace Sentry integration, update deployment configuration and privacy content, and document setup.
4. Verify sanitized payloads, error capture, route pageviews, browser storage, static export, and absence of public source maps locally with a controlled configured production build.
5. Deploy production and confirm pageview and exception events in the EU project; verify preview remains disabled.
6. After successful rollout, retire unused Sentry CI credentials and local build-plugin configuration. Preserve existing Sentry history.

Rollback: disable PostHog and rebuild/redeploy to stop collection. Revert the integration commit and restore Sentry configuration if Sentry monitoring must be restored.

## Open Questions
No scope decisions remain. Public project token and configured retention will be supplied during setup; do not fabricate values in the implementation or privacy policy.

## References
- Documentation reviewed on 2026-10-08. Implementation uses `posthog-js` 1.438.2. Source-map uploads are deferred for the initial rollout. The SDK filter preserves required public project-token and cookieless transport metadata while discarding person updates and unrelated properties. Account creation and live-project verification remain rollout prerequisites.
- [PostHog cookieless tracking](https://posthog.com/tutorials/cookieless-tracking): SDK mode, project setting, storage behavior, and daily-hash limitations.
- [PostHog Next.js integration](https://posthog.com/docs/libraries/next-js): browser initialization through `instrumentation-client.ts`.
- [PostHog error tracking](https://posthog.com/docs/error-tracking/start-here): automatic/manual exception capture and source maps.
- [JavaScript configuration](https://posthog.com/docs/libraries/js/config): explicit collection controls, dated defaults, pageviews, and script versioning.
- [Next.js Error Tracking installation](https://posthog.com/docs/error-tracking/installation/nextjs): automatic errors and manual boundary capture.
- [Reverse-proxy guidance](https://posthog.com/docs/advanced/proxy): recommended but optional proxy and managed-proxy processing trade-offs.
