import Image from "next/image";

import { Phrase } from "@/components/Phrase";
import { SlideChrome } from "@/components/SlideChrome";
import type { ContentSlide, SlideImage } from "@/lib/slides/types";

function Figure({ image, className }: { image: SlideImage; className?: string }) {
  return (
    <figure className={className}>
      <div>
        <Image src={image.src} alt={image.alt} width={1280} height={720} />
      </div>
      <figcaption>
        <Phrase value={image.caption} />
      </figcaption>
    </figure>
  );
}

/**
 * Ruột panel đổi theo số ảnh: 1 ảnh tràn kín, 2 ảnh xếp dọc,
 * 3 ảnh là 1 lớn + 2 nhỏ, từ 4 ảnh trở lên là lưới 2 cột.
 */
function MediaPanel({ images }: { images: readonly SlideImage[] }) {
  if (images.length === 0) return <div className="content-media" />;
  if (images.length === 1) {
    return (
      <div className="content-media">
        <Figure image={images[0]} className="media-solo" />
      </div>
    );
  }
  if (images.length === 2) {
    return (
      <div className="content-media">
        <Figure image={images[0]} className="media-lead" />
        <Figure image={images[1]} className="media-lead" />
      </div>
    );
  }
  if (images.length === 3) {
    return (
      <div className="content-media">
        <Figure image={images[0]} className="media-lead" />
        <div className="media-pair">
          <Figure image={images[1]} />
          <Figure image={images[2]} />
        </div>
      </div>
    );
  }
  return (
    <div className="content-media">
      <div className="media-grid">
        {images.map((image) => (
          <Figure key={image.src} image={image} />
        ))}
      </div>
    </div>
  );
}

export function ContentSlideView({
  slide,
  side,
}: {
  slide: ContentSlide;
  side: "left" | "right";
}) {
  return (
    <div
      className="slide-stage"
      data-density={slide.density}
      data-side={side}
      data-on-dark={side === "left" ? "true" : "false"}
    >
      <MediaPanel images={slide.images} />
      <SlideChrome slide={slide} footAlign={side === "left" ? "right" : "left"} />
      <div className="content-text">
        <h1 className="content-title serif">
          <Phrase value={slide.title} />
          {slide.continued ? " (tiếp)" : null}
        </h1>
        <div className="content-rule" />
        {!slide.continued && slide.lead ? (
          <p className="content-lead">
            <Phrase value={slide.lead} />
          </p>
        ) : null}
        <ul className="content-bullets">
          {slide.bullets.map((bullet, index) => (
            <li key={`${index}-${bullet[0]}`}>
              <Phrase value={bullet} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
