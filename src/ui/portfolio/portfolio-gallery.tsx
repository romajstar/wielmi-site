"use client";

import { useState, type FC } from "react";
import classNames from "classnames";
import PhotoAlbum, { type Photo } from "react-photo-album";
import Lightbox, { type SlideImage } from "yet-another-react-lightbox";
import type { PortfolioMedia, PortfolioVideo } from "@/lib/portfolio";
import { publicAssetPath } from "@/lib/public-asset";
import ResponsiveImage from "@/ui/common/responsive-image";

interface PortfolioGalleryProps {
  media: PortfolioMedia[];
  className?: string;
}

type AlbumItem = Photo & {
  media: PortfolioMedia;
};

type PortfolioLightboxSlide = SlideImage & {
  media: PortfolioMedia;
};

const isVideo = (mediaItem: PortfolioMedia): mediaItem is PortfolioVideo => mediaItem.type === "video";

const PortfolioGallery: FC<PortfolioGalleryProps> = ({ media, className }) => {
  const [index, setIndex] = useState(-1);

  const albumItems: AlbumItem[] = media.map((mediaItem) => ({
    src: isVideo(mediaItem) ? mediaItem.poster : mediaItem.src,
    width: mediaItem.width,
    height: mediaItem.height,
    alt: mediaItem.alt,
    key: mediaItem.id,
    label: isVideo(mediaItem) ? `Odtwórz film: ${mediaItem.alt}` : `Powiększ zdjęcie: ${mediaItem.alt}`,
    media: mediaItem,
  }));

  const slides: PortfolioLightboxSlide[] = media.map((mediaItem) => ({
    src: isVideo(mediaItem) ? mediaItem.poster : mediaItem.src,
    width: mediaItem.width,
    height: mediaItem.height,
    alt: mediaItem.alt,
    media: mediaItem,
  }));

  return (
    <div className={classNames("mt-6", className)} data-testid="portfolio-gallery">
      <PhotoAlbum<AlbumItem>
        layout="columns"
        photos={albumItems}
        spacing={12}
        padding={2}
        columns={(containerWidth) => {
          if (containerWidth < 300) return 1;
          if (containerWidth < 600) return 2;
          return 3;
        }}
        onClick={({ index: mediaIndex }) => setIndex(mediaIndex)}
        render={{
          image: ({ className: imageClassName, style, src, alt }, { photo, width, height }) => (
            <div
              className={classNames(imageClassName, "relative overflow-hidden rounded-2xl shadow-sm")}
              style={{ ...style, aspectRatio: `${width} / ${height}` }}
            >
              <ResponsiveImage
                src={src}
                alt={alt ?? ""}
                className="h-full w-full"
                imgClassName="transition-transform duration-300 hover:scale-[1.02]"
                sizes="(max-width: 520px) 50vw, (max-width: 900px) 33vw, 25vw"
              />
              {isVideo(photo.media) && (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
                  <span className="flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-sm">
                    <span className="ml-0.5 inline-block h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-white" />
                    Film
                  </span>
                </span>
              )}
            </div>
          ),
        }}
      />
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        render={{
          slide: ({ slide, rect }) => {
            const portfolioSlide = slide as PortfolioLightboxSlide;
            const { media: mediaItem } = portfolioSlide;
            const ratio = mediaItem.width && mediaItem.height ? mediaItem.width / mediaItem.height : 1;
            const fittedHeight = Math.min(rect.height, rect.width / ratio);
            const fittedWidth = Math.min(rect.width, rect.height * ratio);

            return (
              <div className="flex h-full w-full items-center justify-center">
                <div
                  className="relative"
                  style={{
                    width: `${fittedWidth}px`,
                    height: `${fittedHeight}px`,
                  }}
                >
                  {isVideo(mediaItem) ? (
                    <video
                      aria-label={mediaItem.alt}
                      className="h-full w-full object-contain object-center"
                      controls
                      playsInline
                      poster={publicAssetPath(mediaItem.poster)}
                      preload="metadata"
                    >
                      <source src={publicAssetPath(mediaItem.src)} type={mediaItem.mimeType} />
                      Twoja przeglądarka nie obsługuje odtwarzania tego filmu.
                    </video>
                  ) : (
                    <ResponsiveImage
                      src={mediaItem.src}
                      alt={mediaItem.alt}
                      className="h-full w-full"
                      imgClassName="object-contain object-center"
                      sizes="100vw"
                    />
                  )}
                </div>
              </div>
            );
          },
        }}
      />
    </div>
  );
};

export default PortfolioGallery;
