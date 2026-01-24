## ADDED Requirements
### Requirement: Portfolio Page
The system SHALL provide a public portfolio page that lists finished projects.

#### Scenario: Portfolio page renders
- **WHEN** a user visits the portfolio route
- **THEN** the page displays a list of portfolio items

### Requirement: Portfolio Item Content
Each portfolio item SHALL include a title, description, and a photo gallery.

#### Scenario: Portfolio item content displays
- **WHEN** a portfolio item is rendered
- **THEN** its title, description, and photo gallery are visible

### Requirement: Portfolio Data Source
Portfolio items SHALL be defined in code and reference photos stored in the public folder.

#### Scenario: Static data sourcing
- **WHEN** the portfolio page is built
- **THEN** it uses the in-code portfolio data and public image paths
