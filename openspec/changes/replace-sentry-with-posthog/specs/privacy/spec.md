## ADDED Requirements

### Requirement: Always-Cookieless Telemetry
The site SHALL configure PostHog with always-cookieless collection and no person profiles, with project-side cookieless server hashing enabled before rollout. Telemetry SHALL NOT write cookies, localStorage, or sessionStorage, identify visitors through persistent IDs, record sessions, or collect form/interaction events. These restrictions SHALL remain effective after SDK initialization and remote configuration responses.

#### Scenario: Visitor loads and navigates the site
- **WHEN** a visitor loads a configured production page, navigates, reloads, or triggers an error
- **THEN** telemetry creates no cookies or local/session storage entries
- **AND** no persistent visitor identification or session replay occurs

#### Scenario: Remote settings enable extra features
- **WHEN** PostHog returns project settings that would enable additional collection
- **THEN** the site's privacy restrictions continue to prevent persistence, replay, and events outside pageviews, pageleaves, and exceptions

### Requirement: Sanitized Telemetry Payloads
The site SHALL allow only `$pageview`, `$pageleave`, and `$exception` application events and sanitize their final outgoing payloads. It SHALL exclude contact-form values, DOM content, request bodies/headers, person properties, sensitive exception fields, and query-derived attribution. It SHALL remove query strings and fragments from URL fields and stack-frame URLs, minimize referrer data, and redact email addresses and recognizable credentials or tokens in exception messages while preserving safe error types and stack context. It SHALL allowlist the known exception and stack-frame fields rather than recursively processing arbitrary nested data.

#### Scenario: Page URL contains sensitive parameters
- **WHEN** a visitor opens a URL containing an email, token, or other query/fragment value
- **THEN** emitted pageviews and exceptions contain no query/fragment values or derived attribution properties
- **AND** referrer data is restricted to origin when included

#### Scenario: Exception contains identifying content
- **WHEN** an exception includes synthetic email, credential, or token values
- **THEN** outgoing exception data redacts those values and omits unapproved nested fields
- **AND** safe error type and stack context remain available

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
