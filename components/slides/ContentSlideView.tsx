import Image from "next/image";

import { animDelay } from "@/lib/anim";
import { Phrase } from "@/components/Phrase";
import { SlideChrome } from "@/components/SlideChrome";
import type { ContentSlide, SlideImage } from "@/lib/slides/types";

/**
 * Nhịp "dàn nhạc vào" của khuôn nội dung — chép đúng từ mockup đã duyệt
 * `docs/superpowers/references/mockups/05-chuyen-dong.html`, hai khối `.slide[data-kind=curtain]`.
 * Thanh cờ và cụm nhận diện do `SlideChrome` lo.
 */
const CONTENT_DELAY = {
  title: 160,
  rule: 280,
  lead: 330,
  bulletBase: 400,
  bulletStep: 70,
  mediaBase: 260,
  mediaStep: 90,
} as const;

/**
 * `order` là thứ tự ảnh trong panel (0 là ảnh dẫn dắt), dùng để so le nhịp hiện ảnh 90ms
 * — không phải chỉ số mảng của riêng từng nhánh bố trí.
 */
function Figure({
  image,
  order,
  className,
}: {
  image: SlideImage;
  order: number;
  className?: string;
}) {
  return (
    <figure
      className={className ? `${className} anim a-media` : "anim a-media"}
      style={animDelay(CONTENT_DELAY.mediaBase + CONTENT_DELAY.mediaStep * order)}
    >
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
        <Figure image={images[0]} order={0} className="media-solo" />
      </div>
    );
  }
  if (images.length === 2) {
    // `--duo` chia đôi chiều cao và chừa chỗ cho cụm nhận diện; hai khung 16:9 xếp dọc
    // theo tỉ lệ gốc sẽ cao gần kín slide và đẩy ảnh lên đè cụm nhận diện.
    return (
      <div className="content-media content-media--duo">
        <Figure image={images[0]} order={0} className="media-lead" />
        <Figure image={images[1]} order={1} className="media-lead" />
      </div>
    );
  }
  if (images.length === 3) {
    return (
      <div className="content-media">
        <Figure image={images[0]} order={0} className="media-lead" />
        <div className="media-pair">
          <Figure image={images[1]} order={1} />
          <Figure image={images[2]} order={2} />
        </div>
      </div>
    );
  }
  return (
    <div className="content-media">
      <div className="media-grid">
        {images.map((image, index) => (
          <Figure key={image.src} image={image} order={index} />
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
      <SlideChrome slide={slide} side={side} />
      <div className="content-text">
        <h1 className="content-title serif anim a-rise" style={animDelay(CONTENT_DELAY.title)}>
          <Phrase value={slide.title} />
          {slide.continued ? " (tiếp)" : null}
        </h1>
        <div className="content-rule anim a-grow" style={animDelay(CONTENT_DELAY.rule)} />
        {!slide.continued && slide.lead ? (
          <p className="content-lead anim a-rise" style={animDelay(CONTENT_DELAY.lead)}>
            <Phrase value={slide.lead} />
          </p>
        ) : null}
        <ul className="content-bullets">
          {slide.bullets.map((bullet, index) => (
            <li
              key={`${index}-${bullet[0]}`}
              className="anim a-rise"
              style={animDelay(CONTENT_DELAY.bulletBase + CONTENT_DELAY.bulletStep * index)}
            >
              <Phrase value={bullet} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
