import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { cleanup, render, screen } from "@testing-library/react";
import { portfolioItems } from "@/lib/portfolio";

afterEach(() => {
  cleanup();
});

mock.module("react-photo-album", {
  defaultExport: ({ photos }: { photos: Array<{ src: string; alt: string }> }) => (
    <div data-testid="photo-album">
      {photos.map((photo, index) => (
        <div key={`${photo.src}-${index}`} role="img" aria-label={photo.alt} data-src={photo.src} />
      ))}
    </div>
  ),
});

mock.module("yet-another-react-lightbox", {
  defaultExport: ({ open }: { open: boolean }) => (
    <div data-testid="lightbox" data-open={open ? "true" : "false"} />
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

  const galleries = screen.getAllByTestId("portfolio-gallery");
  assert.equal(galleries.length, portfolioItems.length);
  assert.equal(screen.getAllByTestId("photo-album").length, portfolioItems.length);
});
