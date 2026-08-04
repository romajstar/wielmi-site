import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { portfolioItems, type PortfolioMedia } from "@/lib/portfolio";

afterEach(() => {
  cleanup();
});

type MockAlbumPhoto = {
  src: string;
  alt?: string;
  label?: string;
  width: number;
  height: number;
};

type MockAlbumProps = {
  photos: MockAlbumPhoto[];
  onClick?: (props: { index: number }) => void;
  render?: {
    image?: (
      props: { src: string; alt?: string },
      context: { photo: MockAlbumPhoto; index: number; width: number; height: number },
    ) => React.ReactNode;
  };
};

mock.module("react-photo-album", {
  defaultExport: ({ photos, onClick, render: albumRender }: MockAlbumProps) => (
    <div data-testid="photo-album">
      {photos.map((photo, index) => (
        <button
          key={`${photo.src}-${index}`}
          aria-label={photo.label}
          data-src={photo.src}
          onClick={() => onClick?.({ index })}
          type="button"
        >
          {albumRender?.image?.(
            { src: photo.src, alt: photo.alt },
            { photo, index, width: photo.width, height: photo.height },
          )}
        </button>
      ))}
    </div>
  ),
});

type MockLightboxProps = {
  open: boolean;
  index: number;
  slides: Array<{ src: string }>;
  render?: {
    slide?: (props: {
      slide: { src: string };
      rect: { width: number; height: number };
      offset: number;
    }) => React.ReactNode;
  };
};

mock.module("yet-another-react-lightbox", {
  defaultExport: ({ open, index, slides, render: lightboxRender }: MockLightboxProps) => (
    <div
      data-testid="lightbox"
      data-index={index}
      data-open={open ? "true" : "false"}
      data-slide-count={slides.length}
    >
      {open && lightboxRender?.slide?.({
        slide: slides[index],
        rect: { width: 1200, height: 800 },
        offset: 0,
      })}
    </div>
  ),
});

mock.module("next-export-optimize-images/image", {
  defaultExport: ({ alt }: { alt: string }) => <div role="img" aria-label={alt} />,
});

test("renders portfolio items with titles and descriptions", async () => {
  const { default: PortfolioSection } = await import("./portfolio-section");

  render(<PortfolioSection />);

  portfolioItems.forEach((item) => {
    assert.ok(screen.getByText(item.title));
    assert.ok(screen.getByText(item.description));
  });
});

test("renders a gallery for every portfolio item", async () => {
  const { default: PortfolioSection } = await import("./portfolio-section");

  render(<PortfolioSection />);

  assert.equal(screen.getAllByTestId("portfolio-gallery").length, portfolioItems.length);
  assert.equal(screen.getAllByTestId("photo-album").length, portfolioItems.length);
});

test("renders video posters and opens videos with explicit playback controls", async () => {
  const { default: PortfolioGallery } = await import("./portfolio-gallery");
  const media: PortfolioMedia[] = [
    {
      type: "photo",
      id: "photo-1",
      src: "/images/portfolio/example.jpg",
      width: 1200,
      height: 800,
      alt: "Przykładowe zdjęcie realizacji",
    },
    {
      type: "video",
      id: "video-1",
      src: "/videos/portfolio/example.mp4",
      poster: "/images/portfolio/example-poster.jpg",
      width: 1920,
      height: 1080,
      mimeType: "video/mp4",
      alt: "Prezentacja inteligentnego domu",
    },
  ];

  const { container } = render(<PortfolioGallery media={media} />);

  const videoButton = screen.getByRole("button", {
    name: "Odtwórz film: Prezentacja inteligentnego domu",
  });
  assert.equal(videoButton.getAttribute("data-src"), "/images/portfolio/example-poster.jpg");
  assert.ok(screen.getByText("Film"));

  fireEvent.click(videoButton);

  const lightbox = screen.getByTestId("lightbox");
  assert.equal(lightbox.getAttribute("data-open"), "true");
  assert.equal(lightbox.getAttribute("data-index"), "1");
  assert.equal(lightbox.getAttribute("data-slide-count"), "2");

  const video = screen.getByLabelText("Prezentacja inteligentnego domu", { selector: "video" });
  assert.ok(video instanceof HTMLVideoElement);
  assert.equal(video.controls, true);
  assert.equal(video.autoplay, false);
  assert.equal(video.preload, "metadata");
  assert.equal(video.getAttribute("poster"), "/images/portfolio/example-poster.jpg");

  const source = container.querySelector("video source");
  assert.equal(source?.getAttribute("src"), "/videos/portfolio/example.mp4");
  assert.equal(source?.getAttribute("type"), "video/mp4");
  assert.ok(screen.getByText("Twoja przeglądarka nie obsługuje odtwarzania tego filmu."));
});
