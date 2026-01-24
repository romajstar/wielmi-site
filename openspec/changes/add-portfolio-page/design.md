## Context
The portfolio page is a new public route in a static-exported Next.js site. Portfolio items are authored in code and reference photos stored in the public folder.

## Goals / Non-Goals
- Goals: provide a simple, responsive gallery and clear project descriptions; keep data static and simple.
- Non-Goals: CMS integration, dynamic filtering, or server-side APIs.

## Decisions
- Decision: Keep portfolio data as a typed array in code for easy manual updates.
- Decision: Use `react-photo-album` for the gallery grid and `yet-another-react-lightbox` for full-screen viewing.

## Package Recommendations
- Recommended: `react-photo-album` for responsive masonry/grid layouts with minimal setup.
  - Pros: simple API, supports responsive layouts (rows/columns/masonry), lightweight, works well with static assets.
  - Cons: no built-in lightbox (needs pairing if you want click-to-view), client-side rendering only.
- Chosen: `yet-another-react-lightbox` for click-to-view full-screen photos.
  - Pros: modern UX, extensible plugins (captions, thumbnails), good keyboard/touch support.
  - Cons: extra dependency and bundle size, requires wiring to your gallery items.
- Rationale: Both libraries are client-side only, compatible with static export, and reduce custom layout code.

## Risks / Trade-offs
- Added dependencies increase bundle size; mitigate by keeping the gallery simple and deferring lightbox unless requested.

## Migration Plan
- Add route and data; no existing pages are affected.

## Open Questions
- Should the gallery support a lightbox or just a static grid?
