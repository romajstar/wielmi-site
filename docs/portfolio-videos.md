# Portfolio videos

Portfolio videos are authored in `src/lib/portfolio.ts`. Small, short clips can be shipped with the static site; larger or frequently watched videos should use external object storage or a video platform.

## 1. Prepare a web video

Use MP4 with H.264 video and AAC audio for broad browser support. Keep the original outside the repository and commit only the compressed web version.

Example using FFmpeg:

```bash
ffmpeg -i original.mov \
  -vf "scale='min(1920,iw)':-2" \
  -c:v libx264 \
  -crf 23 \
  -preset medium \
  -pix_fmt yuv420p \
  -movflags +faststart \
  -c:a aac \
  -b:a 128k \
  project-name.mp4
```

`+faststart` moves playback metadata to the beginning of the file so the browser can start playback before downloading the complete video. Increase CRF slightly for a smaller file or decrease it for higher quality. Review the result visually rather than relying only on file size.

Create a representative poster image:

```bash
ffmpeg -ss 00:00:02 \
  -i project-name.mp4 \
  -frames:v 1 \
  -vf "scale=1280:-2" \
  project-name-poster.jpg
```

Run the poster through the existing image workflow. `next-export-optimize-images` optimizes the poster during the site build, but it does not process the video file.

## 2. Name and store the files

Use lowercase kebab-case names and keep each video and poster under the corresponding public directories:

```text
public/
├── images/portfolio/project-name-poster.jpg
└── videos/portfolio/project-name.mp4
```

The static export copies the MP4 unchanged into `out/videos/portfolio/`. Do not commit source `.mov` files or other uncompressed masters.

## 3. Add the video to a project

Add a video entry to the project's `media` array in `src/lib/portfolio.ts`:

```ts
{
  type: "video",
  id: "project-name-video",
  src: "/videos/portfolio/project-name.mp4",
  poster: "/images/portfolio/project-name-poster.jpg",
  posterWidth: 1280,
  posterHeight: 720,
  width: 1920,
  height: 1080,
  mimeType: "video/mp4",
  alt: "Prezentacja ukończonej instalacji inteligentnego domu",
}
```

`posterWidth` and `posterHeight` describe the cropped thumbnail ratio used in the gallery. `width` and `height` describe the actual video ratio used in the full-screen viewer. `alt` is the accessible description announced for the thumbnail and player. The gallery adds the configured deployment base path to local video and poster URLs; full `https://` URLs are left unchanged.

The player uses native controls, inline playback, `preload="metadata"`, and no autoplay. The poster is displayed in the gallery so opening the portfolio page does not download every video.

## 4. Verify the result

1. Run the development server and open `/realizacje/`.
2. Confirm the poster has a visible **Film** badge.
3. Open it and check play, pause, seeking, sound, keyboard controls, mobile inline playback, and the previous/next lightbox controls.
4. Run the test suite and production build.
5. Confirm the exported MP4 exists at `out/videos/portfolio/project-name.mp4` and test the exported site through an HTTP server. Opening exported HTML directly with a `file://` URL is not a valid playback test.

## 5. Decide where to host it

Keeping a video in Git and `public/videos` is suitable when it is short, compressed, rarely replaced, and small enough that repository growth, CI artifacts, server storage, and visitor bandwidth remain acceptable. As an initial target, try to keep each clip below approximately 20–30 MB.

Use object storage, a CDN, or a video platform when a file is large, there are many clips, adaptive streaming is needed, traffic is significant, or the same video changes often. Put the hosted `https://` URL in `src`. Prefer keeping the poster local; a remote poster also requires an allowed remote image configuration. Verify that the video host permits cross-origin playback and byte-range requests.
