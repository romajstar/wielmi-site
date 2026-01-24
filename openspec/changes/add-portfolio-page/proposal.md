## Why
The site needs a dedicated portfolio page to showcase completed projects with visuals and clear context for potential customers.

## What Changes
- Add a new portfolio page with a list of completed projects; each item includes a title, description, and photo gallery.
- Use the `/realizacje` route for the portfolio page.
- Store portfolio items as static in-code data, referencing photos in the public folder.
- Add a responsive gallery UI on the portfolio page.
- **BREAKING** None.

## Impact
- Affected specs: portfolio (new)
- Affected code: src/app (new route), src/ui (new portfolio components), src/constants or src/lib (portfolio data)
