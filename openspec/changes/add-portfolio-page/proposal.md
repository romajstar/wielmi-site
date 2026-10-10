## Why
The site needs a dedicated portfolio page to showcase completed projects with visuals and clear context for potential customers.

## What Changes
- Add a new portfolio page with a list of completed projects; each item includes a title, description, and media gallery supporting photos and optional videos.
- Use the `/realizacje` route for the portfolio page.
- Store portfolio items as static in-code data, referencing photos, video files, and video poster images in the public folder.
- Add a responsive mixed-media gallery UI on the portfolio page. Video entries use poster thumbnails in the grid and open with native playback controls in the full-screen viewer.
- Add maintainer instructions explaining how to prepare, compress, name, store, reference, and verify portfolio videos and poster images, including guidance on when larger videos should use external hosting.
- **BREAKING** None.

## Impact
- Affected specs: portfolio (new)
- Affected code: src/app (new route), src/ui (new portfolio components), src/constants or src/lib (portfolio data), project documentation
