## Context
The portfolio page is a new public route in a static-exported Next.js site. Portfolio items are authored in code and reference photos and optional videos stored in the public folder.

## Goals / Non-Goals
- Goals: provide a simple, responsive mixed-media gallery and clear project descriptions; keep data static and simple.
- Non-Goals: CMS integration, dynamic filtering, or server-side APIs.

## Decisions
- Decision: Keep portfolio data as a typed array in code for easy manual updates.
- Decision: Use `react-photo-album` for the gallery grid and `yet-another-react-lightbox` for full-screen viewing.
- Decision: Model photos and videos as a discriminated media union. Each video includes a poster image and dimensions so `react-photo-album` can render it as a stable thumbnail; the custom lightbox slide renderer displays the selected file with the native HTML `<video controls>` element.
- Decision: Do not autoplay portfolio videos. Use `preload="metadata"`, provide playback controls, and include accessible text describing the video.

## Package Recommendations
- Recommended: `react-photo-album` for responsive masonry/grid layouts with minimal setup.
  - Pros: simple API, supports responsive layouts (rows/columns/masonry), lightweight, works well with static assets.
  - Cons: image-oriented and has no built-in video playback or lightbox; video entries require poster thumbnails and custom rendering.
- Chosen: `yet-another-react-lightbox` for click-to-view full-screen photos.
  - Pros: modern UX, extensible plugins (captions, thumbnails), good keyboard/touch support.
  - Cons: extra dependency and bundle size; mixed photo/video slides require wiring to gallery items and using the existing custom slide renderer.
- Rationale: Both libraries are client-side only, compatible with static export, and reduce custom layout code.

## Risks / Trade-offs
- Video files can substantially increase page weight and hosting bandwidth; mitigate with compressed web-ready files, poster images, `preload="metadata"`, and no autoplay.
- Browser codec support varies; author videos as MP4/H.264 for broad compatibility, with optional WebM alternatives where useful.

## Migration Plan
- Add route and data; no existing pages are affected.

## Open Questions
- Should the gallery support a lightbox or just a static grid?
