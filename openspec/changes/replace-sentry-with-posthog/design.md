## Context
The site runs Next.js 15.5.27 with `output: "export"` and deploys static assets to Hostido from `main`; `develop` deploys to GitHub Pages. Before migration, Sentry supplied browser error capture, replay, tracing, source-map uploads, and server/edge hooks. Static hosting has no request-time Next.js server to instrument.

The user selected errors plus pageviews, PostHog Cloud EU, and cookieless operation. The repository does not establish the current external PostHog project settings. An earlier archived change removed Google Analytics and its banner, but its privacy delta is absent from canonical specs. The implemented privacy policy discloses PostHog telemetry; configured retention periods remain to be confirmed. The separate `add-portfolio-page` change does not overlap this proposal.

## Goals / Non-Goals
- Goals: browser error diagnostics with uploaded source maps; pageview counts on loads and route changes; EU ingestion; no telemetry cookies or browser storage; explicit privacy disclosures; reliable static builds.
- Non-goals: session replay, click/form autocapture, conversion events, user identification, cross-day visitor tracking, feature flags, surveys, console-log collection, performance tracing, server/edge monitoring, historical Sentry data migration, or changes to hosting.

## Decisions
### Browser integration and event scope
Use `posthog-js` in `src/instrumentation-client.ts`, with a shared guarded capture helper accessible to `src/app/global-error.tsx`. Do not install a server SDK or add API routes, middleware, or a Next.js reverse proxy. Retain the existing error UI and prevent telemetry failures from disrupting rendering.

The official Next.js guide recommends this entry point for Next.js 15.3+, which includes this project's version. Import the initialized SDK directly in client helpers; a React provider is unnecessary for this scope. Install through pnpm and commit the resolved versions in the lockfile. Review the SDK defaults date explicitly during implementation; the current configuration reference lists `2026-08-30` as its latest date, while the Next.js walkthrough still shows `2026-05-30`. Do not copy placeholders or assume walkthrough defaults enforce this proposal's privacy requirements. Prefer manual integration over running the wizard because the required event scope and existing build wrappers are already specified.

Enable browser exception capture for uncaught errors and unhandled promise rejections; explicitly report errors handled by the global boundary. Do not capture console messages. Verify that the same error is not reported twice through boundary and automatic capture paths.

Set `capture_exceptions` explicitly using the selected SDK's typed configuration, rather than leaving it undefined and dependent on project settings. Enable unhandled errors/rejections and disable console-error capture. Mirror exception autocapture in the EU project's Error Tracking settings for setup clarity. Use `captureException(error)` for boundary reporting rather than manually constructing `$exception` events.

Use one pageview mechanism. Disable SDK automatic pageviews if using an explicit route observer. Record the initial page and changes to the pathname, including back/forward navigation, exactly once. Query-only and hash-only changes do not add pageviews. React rerenders and effect replay must not add duplicates. Select the mechanism supported by the installed SDK after verifying App Router behavior rather than combining automatic and manual pageviews.

The documented SPA mechanism is `capture_pageview: "history_change"`; it is independent of interaction `autocapture`. The implementation selects this SDK mechanism without a custom route observer or deduplication layer; browser verification of the pathname-only contract remains pending. Enable `capture_pageleave: true` to measure time spent on the final page. Preserve `$pageview_id`, `$prev_pageview_id`, `$prev_pageview_duration`, and sanitized `$prev_pageview_pathname` for page timing and linkage.

### Cookieless configuration
Set `cookieless_mode: "always"` and `person_profiles: "never"`. Never call `identify`, `alias`, or provide persistent user identifiers. Enable the project-side Cookieless server hash mode before rollout. Explicitly disable replay, interaction autocapture, heatmaps, surveys, other collection outside pageviews, pageleaves, Web Vitals, and exceptions using the selected SDK's supported options. Pin privacy-sensitive options instead of relying on SDK defaults or remote project toggles.

Concrete configuration includes `advanced_disable_flags: true`, `autocapture: false`, `capture_dead_clicks: false`, `rageclick: false`, `capture_heatmaps: false`, `capture_performance: { web_vitals: true, web_vitals_attribution: false }`, `disable_session_recording: true`, `disable_surveys: true`, and `enable_recording_console_log: false`. This site uses no feature flags. Disabling `/flags` also prevents the SDK from sending unsanitized `$initial_current_url` person properties outside the event filter. Do not configure browser Logs collection. Use `disable_persistence: true` as an additional storage safeguard, without substituting it for cookieless server hashing. Check these options against the installed package's types. The configuration reference states that cookieless events are ignored unless the project setting is enabled.

### EU routing and activation
Use `https://eu.i.posthog.com` for browser ingestion and `https://eu.posthog.com` for the dashboard. Document `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`, and `NEXT_PUBLIC_POSTHOG_ENABLED`. Initialize only when the build is production, the explicit enable flag is true, and a project token and valid EU host are configured. Otherwise send no telemetry and keep builds and the site functional.

Set enablement and credentials in the Hostido production workflow. Keep local development and ordinary builds without configuration disabled. Both Hostido and GitHub Pages workflows enable browser telemetry when a token is supplied, and both remove Sentry settings. Static export embeds public configuration at build time; changing these variables requires rebuilding. The project ingestion token is public; browser telemetry requires no private PostHog credentials; Hostido source-map uploads additionally require a build-only personal API key and numeric project ID.

Set `ui_host: "https://eu.posthog.com"` explicitly. If hosting applies a Content Security Policy, inspect actual ingestion and SDK asset requests and permit the required EU hosts; the SDK can load feature scripts even when installed via npm. Do not add replay-specific worker permissions for disabled replay. Use `strict_script_versioning: true` where the selected asset path supports versioned scripts, as recommended by the configuration reference.

### Connection alternatives
PostHog recommends a reverse proxy before production to reduce blocked event delivery, but documents that it is not required. Keep direct EU ingestion for this change to avoid adding DNS/infrastructure scope. This is a conscious trade-off: blocked requests can reduce pageview/error counts.

A future managed proxy would work with static hosting by adding a DNS CNAME to the target generated for the EU organization, waiting for a live certificate, and using that subdomain as `api_host` with EU `ui_host`. It must not use Next.js rewrites on this static export. The managed proxy uses Cloudflare and does not guarantee EU-only edge termination, although events are ingested in the selected PostHog region. Revisit this choice only if more complete collection is needed; no DNS or account changes are authorized by this documentation review.

### Data minimization
Use a small `before_send` filter for the four enabled event types. Preserve SDK properties, campaign attribution, session linkage, scroll depth, and metric metadata. Remove known sensitive URL parameters and fragments, and redact email addresses and recognizable credentials in exception strings. Use SDK configuration to disable interaction capture, replay, person profiles, persistence, and DOM attribution. Do not maintain custom property allowlists or cross-event deduplication.

Update the Polish privacy policy to describe the purposes, provider, EU hosting, collected technical data, lack of browser persistence and identification, and actual retention settings. Do not describe cookieless telemetry as collecting no personal data: PostHog receives network metadata to derive its server-side daily hash. Keeping the banner absent is the chosen product behavior, not a claim that SDK configuration alone establishes legal compliance.

### Source maps and Sentry removal
Preserve image-export and bundle-analyzer wrappers when removing `withSentryConfig`. Remove unused server/edge hooks and configuration; update the global boundary to the guarded PostHog helper. Remove Sentry CI token references and obsolete ignored build-plugin configuration. Leave archive history intact.

Enable source-map uploads in Hostido through `@posthog/nextjs-config`, using `POSTHOG_API_KEY`, `POSTHOG_PROJECT_ID`, and the EU dashboard host. Use release name `wielmi-site` and `GITHUB_SHA` as the version. Delete maps after upload and fail the deployment artifact check if any `.map` files remain. Keep `productionBrowserSourceMaps: false` in the base config and uploads disabled unless explicitly enabled; GitHub Pages does not enable uploads. Missing upload credentials fail an enabled build.

## Risks / Trade-offs
- Cookieless hashes change daily and can merge visitors sharing network/browser characteristics; treat pageviews as the core metric, not long-term unique-user counts.
- Pageviews plus pageleaves improve session duration and bounce measurement. Interaction-based metrics remain limited because interaction autocapture is disabled; Web Vitals collection is enabled without DOM attribution.
- Removing replay and tracing reduces debugging context; sanitized stack traces and page context remain available, with original source resolution dependent on successful source-map uploads.
- SDK defaults or project settings can enable unwanted collection; explicit settings, an event allowlist, and browser network/storage inspection guard the intended scope.
- Aggressive redaction can remove useful error details; retain exception types and safe stack frames and verify issue grouping.
- Ad blockers or service outages can prevent delivery; keep collection best-effort and the site functional.

## Migration Plan
1. Review and approve this proposal.
2. Create/configure a PostHog Cloud EU project; enable cookieless server hashing and configure retention. Obtain its public project token.
3. Replace Sentry integration, update deployment configuration and privacy content, and document setup.
4. Verify sanitized payloads, error capture, route pageviews, browser storage, static export, and absence of public source maps locally with a controlled configured production build.
5. Deploy production and confirm pageview and exception events in the EU project; verify GitHub Pages telemetry follows its configured enablement and source-map uploads remain disabled there.
6. After successful rollout, retire unused Sentry CI credentials and local build-plugin configuration. Preserve existing Sentry history.

Rollback: disable PostHog and rebuild/redeploy to stop collection. Revert the integration commit and restore Sentry configuration if Sentry monitoring must be restored.

## Open Questions
No scope decisions remain. Public project token and configured retention will be supplied during setup; do not fabricate values in the implementation or privacy policy.

## References
- Documentation reviewed on 2026-10-08. Implementation uses `posthog-js` 1.438.2. Hostido source-map uploads are enabled in the current implementation. The SDK filter preserves required public project-token and cookieless transport metadata while preserving standard SDK properties and recursively redacting exception strings. Live-project settings and event/source-map delivery remain to be verified.
- [PostHog cookieless tracking](https://posthog.com/tutorials/cookieless-tracking): SDK mode, project setting, storage behavior, and daily-hash limitations.
- [PostHog Next.js integration](https://posthog.com/docs/libraries/next-js): browser initialization through `instrumentation-client.ts`.
- [PostHog error tracking](https://posthog.com/docs/error-tracking/start-here): automatic/manual exception capture and source maps.
- [JavaScript configuration](https://posthog.com/docs/libraries/js/config): explicit collection controls, dated defaults, pageviews, and script versioning.
- [Next.js Error Tracking installation](https://posthog.com/docs/error-tracking/installation/nextjs): automatic errors and manual boundary capture.
- [Reverse-proxy guidance](https://posthog.com/docs/advanced/proxy): recommended but optional proxy and managed-proxy processing trade-offs.
