## 1. Project and configuration
- [x] 1.1 Create a PostHog Cloud EU project, enable Cookieless server hash mode and browser exception autocapture, and record configured retention for the privacy disclosure.
- [x] 1.2 Document public build variables, explicit production enablement, EU hosts, and the public project token; add placeholder configuration without real secrets.
- [x] 1.3 Create `docs/posthog-cloud-setup.md` with step-by-step instructions for registering a PostHog Cloud EU account, creating the organization/project, enabling cookieless server hashing and browser exception autocapture, disabling out-of-scope collection, configuring retention, locating the public project token, setting GitHub Actions variables, and verifying pageviews and exceptions. Link the guide from `README.md` and use placeholders instead of real credentials.

## 2. Integration
- [x] 2.1 Replace `@sentry/nextjs` with a compatible `posthog-js` version; include build-time source-map upload tooling, choose a supported SDK defaults date, and update the lockfile.
- [x] 2.2 Replace browser initialization with guarded EU PostHog setup; enforce always-cookieless mode, no profiles or persistence, and disable features outside exceptions/pageviews.
- [x] 2.3 Add outgoing-event filtering and sanitization for event properties, URLs, attribution, and preserved SDK exception/stack-frame fields; redact emails and recognizable credentials/tokens in exception messages.
- [x] 2.4 Implement one pageview mechanism for initial loads and pathname navigation; suppress rerender, query-only, hash-only, and automatic/manual duplicates.
- [x] 2.5 Capture uncaught errors, unhandled rejections, and global-boundary errors without console collection or duplicate reporting; retain the error UI and tolerate telemetry failures.
- [x] 2.6 Remove Sentry build wrappers, server/edge hooks/configuration, and obsolete ignored configuration while preserving static export, image optimization, and bundle analysis.

## 3. Build and privacy documentation
- [x] 3.1 Update both workflows to remove Sentry variables; enable browser PostHog telemetry in Hostido and GitHub Pages production-mode builds when a public project token is supplied.
- [x] 3.2 Configure Hostido source-map uploads with the PostHog build wrapper, build-only credentials, release metadata, deletion after upload, and an artifact check; leave ordinary/GitHub Pages uploads disabled.
- [x] 3.3 Update the Polish privacy policy to disclose pageview/error collection, PostHog Cloud EU, technical metadata, cookieless operation, and provider retention without asserting that no third-party analytics are used.
- [x] 3.4 Update setup documentation and `openspec/project.md` for the actual framework, PostHog monitoring, and removal of stale Google Analytics/consent assumptions.

## 4. Verification and rollout
- [x] 4.1 Add focused tests for activation guards, event allowlisting/redaction, pageview deduplication, and guarded error capture.
- [x] 4.2 Run existing tests, lint, TypeScript checks, and static builds both with and without PostHog configuration; record any unrelated baseline failures.
- [x] 4.3 Inspect the deployed develop production-mode build in a browser: one initial pageview, one per pathname change/back/forward, none for query/hash-only changes, and no duplicate error events.
- [x] 4.4 Verify synthetic uncaught, rejected-promise, route/global-boundary errors; decode actual transmitted payloads with synthetic sensitive values to confirm redaction and event scope.
- [x] 4.5 On deployed develop, inspect cookies/localStorage/sessionStorage before and after navigation, reload, error capture, and SDK/project configuration responses; verify no telemetry persistence or replay requests and no analytics banner.
- [x] 4.6 Verify missing configuration, blocked ingestion, and service failures leave pages/error UI functional and emit no fallback tracking.
- [ ] 4.7 Verify production artifacts contain no public maps and GitHub Pages telemetry follows configured enablement without source-map uploads; verify a controlled Hostido exception appears in the EU project with original-source resolution.
- [ ] 4.8 After production verification, retire unused Sentry credentials/configuration and archive the approved change into canonical specs.
- [x] 4.9 On deployed develop, inspect CSP/SDK asset loading if applicable, verify versioned feature scripts, and confirm successful network responses correspond to visible `$pageview`/`$exception` events in the EU project.

- [ ] 4.10 After Hostido deployment, smoke-check pageview/exception delivery, navigation, browser storage, and hosting-specific CSP/SDK loading.

## Implementation verification notes
- Task 1.1 is marked complete; external project settings and retention are not independently verified by repository evidence.
- Task 3.3: the Polish policy discloses PostHog, pageviews/errors, EU storage, metadata, cookieless restrictions, and provider retention. The user-approved wording states a guarantee of at least one year and possible deletion after the applicable retention period, without tying the disclosure to a plan name. Source: https://posthog.com/pricing.
- Unit and real-SDK tests cover activation, event filtering, sensitive payloads, navigation deduplication, browser errors/rejections, boundary capture, and no cookies/local/session storage. They use synthetic data and mocked delivery, not a live project.
- Initial checks covered disabled telemetry and synthetic configured telemetry. Those checks predate the current Hostido source-map upload configuration. The simplified configured production build passed with only a synthetic public token; its static export contains zero `.map` files. These historical results do not verify the current upload path.
- Browser verification on 2026-10-10 completed develop checks 4.3, 4.5, and 4.9; see `verification.md`. Local production-build verification completed 4.4, including all four error paths and decoded wire payloads; see `verification-4.4.json`. Payload checks found and fixed nested Web Vitals URLs and the SDK `/flags` request's unsanitized initial person properties. Tasks 4.6–4.8 and Hostido smoke check 4.10 remain open.
- Task 4.6: locally verified both a production export with telemetry disabled/missing token and an enabled export with a synthetic token whose PostHog API host was redirected to a local server returning HTTP 501. Navigation, route error recovery, uncaught errors, and unhandled rejections remained functional; no alternate tracking host was contacted. The SDK retried failed ingestion through `retry_count=3` during observation. See `verification.md` for the exact test scope and limitation.
- No production deployment, external credential deletion, or archive has been performed; task 4.8 remains a post-rollout step.

- Completed checks: `pnpm test` (13 passing tests), `pnpm lint`, `pnpm exec tsc --noEmit`, static production builds with and without telemetry configuration, public-artifact inspection, `git diff --check`, and strict OpenSpec validation. Current source-map upload delivery and original-source resolution require live verification.
