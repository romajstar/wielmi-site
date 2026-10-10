## ADDED Requirements

### Requirement: Always-Cookieless Telemetry
The site SHALL configure PostHog with always-cookieless collection and no person profiles, with project-side cookieless server hashing enabled before rollout. Telemetry SHALL NOT write cookies, localStorage, or sessionStorage, identify visitors through persistent IDs, record sessions, or collect form/interaction events. These restrictions SHALL remain effective after SDK initialization and remote configuration responses.

#### Scenario: Visitor loads and navigates the site
- **WHEN** a visitor loads a configured production page, navigates, reloads, or triggers an error
- **THEN** telemetry creates no cookies or local/session storage entries
- **AND** no persistent visitor identification or session replay occurs

#### Scenario: Remote settings enable extra features
- **WHEN** PostHog returns project settings that would enable additional collection
- **THEN** the site's privacy restrictions continue to prevent persistence, replay, and events outside pageviews, pageleaves, Web Vitals, and exceptions

### Requirement: Sanitized Telemetry Payloads
The site SHALL allow only `$pageview`, `$pageleave`, `$web_vitals`, and `$exception` application events. It SHALL preserve standard SDK properties, campaign attribution, session linkage, scroll measurements, and diagnostic metadata, including `$host` and `$raw_user_agent` needed for cookieless server hashing. A small outgoing filter SHALL remove known sensitive URL parameters and fragments and redact email addresses and recognizable credentials in exception strings. Collection restrictions SHALL primarily use SDK configuration rather than property allowlists.

#### Scenario: Page URL contains sensitive parameters
- **WHEN** a visitor opens a URL containing an email, token, or other query/fragment value
- **THEN** emitted pageviews and exceptions omit known sensitive parameters and fragments while preserving campaign attribution
- **AND** referrer URLs have credentials, known sensitive parameters, and fragments removed while retaining safe path and query data

#### Scenario: Exception contains identifying content
- **WHEN** an exception includes synthetic email, credential, or token values
- **THEN** outgoing exception data redacts matching strings recursively within `$exception_list` while preserving SDK fields
- **AND** safe error type and stack context remain available

#### Scenario: Web Vitals contains nested navigation URLs
- **WHEN** SDK Web Vitals metric metadata includes `navigationURL` or `$current_url`
- **THEN** those nested URLs omit credentials, known sensitive query parameters, and fragments
- **AND** campaign parameters and numeric metric metadata remain available

#### Scenario: SDK feature flag requests
- **WHEN** the initialized SDK would otherwise send person properties to the feature flag endpoint
- **THEN** the SDK sends no `/flags` request because this site does not use feature flags

#### Scenario: Out-of-scope event is generated
- **WHEN** the SDK attempts to send an interaction, conversion, or other application event outside the allowed types
- **THEN** the outgoing event filter discards it

### Requirement: Accurate Privacy Disclosure
The Polish privacy policy SHALL disclose PostHog Cloud EU pageview measurement and browser error monitoring, the technical data involved, the lack of browser persistence and visitor identification, and the configured retention. It SHALL no longer claim that the site uses no third-party analytics or that cookieless operation eliminates all personal-data processing.

#### Scenario: Visitor reads the privacy policy
- **WHEN** a visitor opens the privacy policy after rollout
- **THEN** it describes PostHog, EU hosting, pageview/error purposes, technical metadata, cookieless operation, and configured retention accurately

### Requirement: No Analytics Consent Banner
The site SHALL retain the absence of an analytics consent banner with the configured always-cookieless telemetry.

#### Scenario: Visitor opens the site
- **WHEN** a visitor loads a public page
- **THEN** no analytics consent banner is shown
