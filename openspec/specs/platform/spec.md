# platform Specification

## Purpose
Define the framework, Node.js runtime, and automated test runner used to develop, build, and export the site consistently across local development and CI.
## Requirements
### Requirement: Framework Version
The project SHALL use the latest stable Next.js 15.x as the primary framework for build and runtime.

#### Scenario: Build uses Next.js 15
- **WHEN** dependencies are installed
- **THEN** `next` resolves to a 15.x version during build and export

### Requirement: Node.js Runtime Version
The project SHALL use Node.js 24.x for development, builds, and CI automation.

#### Scenario: Runtime version enforced
- **WHEN** dependencies are installed or CI runs the build
- **THEN** the required Node.js version resolves to 24.x

### Requirement: Node Native Test Runner
The project SHALL use the Node.js native test runner for automated tests.

#### Scenario: Tests run without Jest
- **WHEN** automated tests are executed
- **THEN** the Node.js native test runner is used and Jest is not required

