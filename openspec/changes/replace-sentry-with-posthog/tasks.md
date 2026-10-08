## 1. Project and configuration
- [x] 1.1 Create a PostHog Cloud EU project, enable Cookieless server hash mode and browser exception autocapture, and record configured retention for the privacy disclosure.
- [x] 1.2 Document public build variables, explicit production enablement, EU hosts, and the public project token; add placeholder configuration without real secrets.
- [x] 1.3 Create `docs/posthog-cloud-setup.md` with step-by-step instructions for registering a PostHog Cloud EU account, creating the organization/project, enabling cookieless server hashing and browser exception autocapture, disabling out-of-scope collection, configuring retention, locating the public project token, setting GitHub Actions variables, and verifying pageviews and exceptions. Link the guide from `README.md` and use placeholders instead of real credentials.

## 2. Integration
- [x] 2.1 Replace `@sentry/nextjs` with a compatible `posthog-js` version; defer source-map upload tooling, choose a supported SDK defaults date, and update the lockfile.
- [x] 2.2 Replace browser initialization with guarded EU PostHog setup; enforce always-cookieless mode, no profiles or persistence, and disable features outside exceptions/pageviews.
- [x] 2.3 Add outgoing-event filtering and sanitization for event properties, URLs, attribution, and explicitly allowlisted exception/stack-frame fields; redact emails and recognizable credentials/tokens in exception messages.
- [x] 2.4 Implement one pageview mechanism for initial loads and pathname navigation; suppress rerender, query-only, hash-only, and automatic/manual duplicates.
- [x] 2.5 Capture uncaught errors, unhandled rejections, and global-boundary errors without console collection or duplicate reporting; retain the error UI and tolerate telemetry failures.
- [x] 2.6 Remove Sentry build wrappers, server/edge hooks/configuration, and obsolete ignored configuration while preserving static export, image optimization, and bundle analysis.

## 3. Build and privacy documentation
- [x] 3.1 Update both workflows to remove Sentry variables; enable PostHog only for Hostido production, leaving GitHub Pages previews disabled.
- [x] 3.2 Defer source-map uploads; remove the PostHog build wrapper, CLI dependencies, upload/cleanup scripts, and private credential/project ID configuration; disable production browser source maps.
- [ ] 3.3 Update the Polish privacy policy to disclose pageview/error collection, PostHog Cloud EU, technical metadata, cookieless operation, and configured retention without asserting that no third-party analytics are used.
- [x] 3.4 Update setup documentation and `openspec/project.md` for the actual framework, PostHog monitoring, and removal of stale Google Analytics/consent assumptions.

## 4. Verification and rollout
- [x] 4.1 Add focused tests for activation guards, event allowlisting/redaction, pageview deduplication, and guarded error capture.
- [x] 4.2 Run existing tests, lint, TypeScript checks, and static builds both with and without PostHog configuration; record any unrelated baseline failures.
- [ ] 4.3 Inspect a configured production build in a browser: one initial pageview, one per pathname change/back/forward, none for query/hash-only changes, and no duplicate error events.
- [ ] 4.4 Verify synthetic uncaught, rejected-promise, and global-boundary errors; inspect transmitted payloads with synthetic sensitive values to confirm sanitization and event scope.
- [ ] 4.5 Inspect cookies/localStorage/sessionStorage before and after navigation, reload, error capture, and SDK/project configuration responses; verify no telemetry persistence or replay requests and no analytics banner.
- [ ] 4.6 Verify missing configuration, blocked ingestion, and service failures leave pages/error UI functional and emit no fallback tracking.
- [ ] 4.7 Verify production artifacts contain no public maps and preview emits no telemetry; verify a controlled exception appears in the EU project with bundled JavaScript stack frames.
- [ ] 4.8 After production verification, retire unused Sentry credentials/configuration and archive the approved change into canonical specs.
- [ ] 4.9 Inspect deployed CSP/SDK asset loading if applicable, verify versioned feature scripts, and confirm successful network responses correspond to visible `$pageview`/`$exception` events in the EU project.

## Implementation verification notes
- The user will create the EU account/project using `docs/posthog-cloud-setup.md`; task 1.1 remains pending.
- Task 3.3: the Polish policy now discloses PostHog, pageviews/errors, EU storage, metadata, and cookieless restrictions. Confirm actual project retention and add the periods before enabling collection; no retention period has been fabricated.
- Unit and real-SDK tests cover activation, event filtering, sensitive payloads, navigation deduplication, browser errors/rejections, boundary capture, and no cookies/local/session storage. They use synthetic data and mocked delivery, not a live project.
- Initial checks covered disabled telemetry and synthetic configured telemetry. Source-map uploads were subsequently deferred at the user's request. The simplified configured production build passed with only a synthetic public token; its static export contains zero `.map` files. Lint, TypeScript, and strict OpenSpec validation also passed after removing upload tooling.
- Browser checks (4.3–4.7 and 4.9) remain pending: the browser runtime reports no available browser. Live EU delivery, remote-project settings, require the user's new project.
- No production deployment, external credential deletion, or archive has been performed; task 4.8 remains a post-rollout step.

- Completed checks: `pnpm test` (13 passing tests), `pnpm lint`, `pnpm exec tsc --noEmit`, static production builds with and without telemetry configuration, public-artifact inspection, `git diff --check`, and strict OpenSpec validation. Source-map uploads are outside the initial rollout.
