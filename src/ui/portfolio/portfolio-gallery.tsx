"use client";

import { useState, type FC } from "react";
import classNames from "classnames";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import type { PortfolioPhoto } from "@/lib/portfolio";
import ResponsiveImage from "@/ui/common/responsive-image";
import type { SlideImage } from "yet-another-react-lightbox";

interface PortfolioGalleryProps {
  photos: PortfolioPhoto[];
  className?: string;
}

const PortfolioGallery: FC<PortfolioGalleryProps> = ({ photos, className }) => {
  const [index, setIndex] = useState(-1);

  return (
    <div className={classNames("mt-6", className)} data-testid="portfolio-gallery">
      <PhotoAlbum
        layout="columns"
        photos={photos.map((photo) => ({ ...photo, key: photo.id }))}
        spacing={12}
        padding={2}
        columns={(containerWidth) => {
          if (containerWidth < 300) return 1;
          if (containerWidth < 600) return 2;
          return 3;
        }}
        onClick={({ index: photoIndex }) => setIndex(photoIndex)}
        render={{
          image: ({ className, style, src, alt }, { width, height }) => (
            <div
              className={classNames(className, "rounded-2xl shadow-sm overflow-hidden")}
              style={{ ...style, aspectRatio: `${width} / ${height}` }}
            >
              <ResponsiveImage
                src={src}
                alt={alt ?? ""}
                className="h-full w-full"
                imgClassName="transition-transform duration-300 hover:scale-[1.02]"
                sizes="(max-width: 520px) 50vw, (max-width: 900px) 33vw, 25vw"
              />
            </div>
          ),
        }}
      />
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={photos.map((photo) => ({
          src: photo.src,
          width: photo.width,
          height: photo.height,
          alt: photo.alt,
          key: photo.id,
        }))}
        render={{
          slide: ({ slide, rect }) => {
            const image = slide as SlideImage;
            const ratio = image.width && image.height ? image.width / image.height : 1;
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
                  <ResponsiveImage
                    src={image.src}
                    alt={image.alt ?? ""}
                    className="h-full w-full"
                    imgClassName="object-contain object-center"
                    sizes="100vw"
                  />
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
