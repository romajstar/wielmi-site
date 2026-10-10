## ADDED Requirements

### Requirement: EU Browser Telemetry Activation
The site SHALL use PostHog Cloud EU for browser telemetry only when a production build has explicit PostHog enablement and a valid project token and EU ingestion host. Local development and builds without this configuration SHALL emit no telemetry. Both Hostido and GitHub Pages deployment workflows SHALL enable browser telemetry when a project token is supplied. Telemetry failures SHALL NOT prevent normal page rendering or the existing error UI.

#### Scenario: Configured production site
- **WHEN** a Hostido or GitHub Pages production-mode build is explicitly enabled and configured
- **THEN** browser telemetry is sent to `https://eu.i.posthog.com`
- **AND** no request-time server integration is required for the static export

#### Scenario: Disabled or incomplete configuration
- **WHEN** the site runs in development mode, without explicit enablement, or without valid EU configuration
- **THEN** no telemetry is initialized or sent
- **AND** the site builds and renders successfully

#### Scenario: Telemetry delivery fails
- **WHEN** ingestion is blocked or unavailable
- **THEN** normal navigation and the existing error UI remain functional

### Requirement: Browser Error Capture
The site SHALL capture uncaught browser errors, unhandled promise rejections, and errors handled by the global error boundary as sanitized PostHog `$exception` events. It SHALL prevent repeated explicit boundary capture of the same error object and SHALL NOT collect console logs, session replay, or performance traces.

#### Scenario: Uncaught browser error or rejection
- **WHEN** an uncaught error or unhandled rejected promise occurs on an enabled page
- **THEN** a sanitized exception event is reported

#### Scenario: Error handled by the global boundary
- **WHEN** the global boundary receives an error on an enabled page
- **THEN** the error is reported once through a guarded capture helper
- **AND** the existing error UI is displayed

### Requirement: Pageview Collection
The site SHALL report exactly one `$pageview` event on an initial page load and each client-side pathname change, including back/forward navigation. It SHALL NOT report additional pageviews for rerenders, query-only changes, or hash-only changes, or collect interaction/conversion events. It SHALL capture `$pageleave` when leaving the site and retain pageview linkage and duration metadata without browser persistence.

#### Scenario: Initial load and route navigation
- **WHEN** a visitor loads a configured page and navigates to another pathname or uses browser back/forward to change pathname
- **THEN** exactly one pageview is reported for each displayed page

#### Scenario: Same pathname remains visible
- **WHEN** a component rerenders or only the query string or fragment changes
- **THEN** no additional pageview is reported

### Requirement: Build-Time Source-Map Uploads
The Hostido production workflow SHALL enable source-map uploads through `@posthog/nextjs-config` to `https://eu.posthog.com`. Uploads SHALL require build-only `POSTHOG_API_KEY` and `POSTHOG_PROJECT_ID`, use release name `wielmi-site` and `GITHUB_SHA` as the release version, and delete maps after upload. The workflow SHALL reject deployment artifacts containing `.map` files. Ordinary builds and GitHub Pages SHALL leave uploads disabled unless `POSTHOG_SOURCEMAPS_ENABLED` is explicitly `true`; the base Next.js configuration SHALL disable production browser source maps.

#### Scenario: Hostido build with uploads enabled
- **WHEN** Hostido builds with source-map uploads enabled and valid build credentials
- **THEN** source maps are uploaded to the EU project and deleted after upload
- **AND** deployment proceeds only if the static export contains no `.map` files

#### Scenario: Upload credentials are missing
- **WHEN** source-map uploads are enabled without a personal API key or numeric project ID
- **THEN** the build fails with a configuration error

#### Scenario: Build without uploads
- **WHEN** source-map uploads are not explicitly enabled
- **THEN** the build requires no private PostHog credentials or numeric project ID
- **AND** browser telemetry can use public project configuration alone

### Requirement: Sentry Retirement
The project SHALL remove active Sentry dependencies, initialization, error capture, build wrappers, and deployment configuration while preserving static export and existing image optimization and bundle analysis behavior.

#### Scenario: Build after migration
- **WHEN** dependencies are installed and the site is built after migration
- **THEN** no Sentry SDK or build plugin is required
- **AND** static export, image optimization, and bundle analysis remain supported

#### Scenario: Browser after migration
- **WHEN** a visitor loads the migrated site
- **THEN** no Sentry runtime is initialized and no Sentry requests are sent

### Requirement: Web Vitals collection
The site SHALL capture sanitized `$web_vitals` metrics (LCP, INP, CLS, and FCP) without DOM attribution or browser persistence.

#### Scenario: Production performance measurement
- **WHEN** the browser reports a supported performance metric with telemetry enabled
- **THEN** PostHog receives the numeric measurement with a sanitized page URL and scalar metric metadata
