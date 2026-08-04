## ADDED Requirements
### Requirement: Portfolio Page
The system SHALL provide a public portfolio page that lists finished projects.

#### Scenario: Portfolio page renders
- **WHEN** a user visits the portfolio route
- **THEN** the page displays a list of portfolio items

### Requirement: Portfolio Item Content
Each portfolio item SHALL include a title, description, and a media gallery. The gallery SHALL support photos and MAY include videos.

#### Scenario: Portfolio item content displays
- **WHEN** a portfolio item is rendered
- **THEN** its title, description, and media gallery are visible

#### Scenario: Portfolio item includes video
- **GIVEN** a portfolio item contains a video entry
- **WHEN** the portfolio item is rendered
- **THEN** the gallery displays the video's poster image with a visible play affordance

### Requirement: Portfolio Video Playback
The system SHALL open portfolio videos in the full-screen media viewer with native playback controls and SHALL NOT start playback automatically.

#### Scenario: Visitor opens a video
- **GIVEN** a portfolio video thumbnail is visible
- **WHEN** the visitor selects the thumbnail
- **THEN** the media viewer displays the video with playback controls
- **AND** the visitor initiates playback explicitly

#### Scenario: Video cannot be played
- **WHEN** the visitor's browser cannot play the supplied video format
- **THEN** the viewer displays fallback text describing that the video cannot be played

### Requirement: Portfolio Data Source
Portfolio items SHALL be defined in code and reference photo, video, and video poster files stored in the public folder.

#### Scenario: Static data sourcing
- **WHEN** the portfolio page is built
- **THEN** it uses the in-code portfolio data and public media paths

### Requirement: Portfolio Video Authoring Instructions
The project SHALL provide maintainer instructions for adding portfolio videos. The instructions SHALL cover supported formats, local compression, poster creation, file naming and placement, portfolio data fields, base-path-safe URLs, playback verification, and criteria for choosing external video hosting instead of Git-managed files.

#### Scenario: Maintainer adds a local portfolio video
- **WHEN** a maintainer follows the video authoring instructions
- **THEN** they can prepare a web-compatible video and poster image
- **AND** place and reference both files correctly in the portfolio data
- **AND** verify playback in the development and static-export builds

#### Scenario: Video is unsuitable for repository storage
- **GIVEN** a portfolio video is too large or costly to deliver with the static site
- **WHEN** a maintainer reviews the video authoring instructions
- **THEN** the instructions recommend external object storage or video hosting and explain how to reference the hosted media
