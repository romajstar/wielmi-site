## ADDED Requirements

### Requirement: EU Browser Telemetry Activation
The site SHALL use PostHog Cloud EU for browser telemetry only when a production build has explicit PostHog enablement and a valid project token and EU ingestion host. Local development, GitHub Pages previews, and builds without this configuration SHALL emit no telemetry. Telemetry failures SHALL NOT prevent normal page rendering or the existing error UI.

#### Scenario: Configured production site
- **WHEN** the Hostido production build is explicitly enabled and configured
- **THEN** browser telemetry is sent to `https://eu.i.posthog.com`
- **AND** no request-time server integration is required for the static export

#### Scenario: Disabled or incomplete configuration
- **WHEN** the site runs locally, in a preview, without explicit enablement, or without valid EU configuration
- **THEN** no telemetry is initialized or sent
- **AND** the site builds and renders successfully

#### Scenario: Telemetry delivery fails
- **WHEN** ingestion is blocked or unavailable
- **THEN** normal navigation and the existing error UI remain functional

### Requirement: Browser Error Capture
The site SHALL capture uncaught browser errors, unhandled promise rejections, and errors handled by the global error boundary as sanitized PostHog `$exception` events. It SHALL prevent duplicate capture of the same error across reporting paths and SHALL NOT collect console logs, session replay, or performance traces.

#### Scenario: Uncaught browser error or rejection
- **WHEN** an uncaught error or unhandled rejected promise occurs on an enabled page
- **THEN** a sanitized exception event is reported without duplicate reporting

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

### Requirement: Initial Rollout Without Source-Map Uploads
The initial rollout SHALL capture browser errors and pageviews without uploading source maps or requiring private PostHog credentials, numeric project IDs, or release configuration. Production browser source maps SHALL be disabled and public artifacts SHALL contain no source-map files. Error stack frames MAY refer to bundled JavaScript until uploads are introduced in a future change.

#### Scenario: Production build with public configuration only
- **WHEN** a production build has valid public PostHog configuration
- **THEN** browser exceptions and pageviews can be collected without a source-map upload step
- **AND** no private PostHog credentials or numeric project ID are required
- **AND** public artifacts contain no source-map files

### Requirement: Sentry Retirement
The project SHALL remove active Sentry dependencies, initialization, error capture, build wrappers, and deployment configuration while preserving static export and existing image optimization and bundle analysis behavior.

#### Scenario: Build after migration
- **WHEN** dependencies are installed and the site is built after migration
- **THEN** no Sentry SDK or build plugin is required
- **AND** static export, image optimization, and bundle analysis remain supported

#### Scenario: Browser after migration
- **WHEN** a visitor loads the migrated site
- **THEN** no Sentry runtime is initialized and no Sentry requests are sent
