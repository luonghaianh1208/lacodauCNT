import Image from "next/image";
import { type RefObject } from "react";

import { animDelay } from "@/lib/anim";
import { Phrase } from "@/components/Phrase";
import { SlideChrome } from "@/components/SlideChrome";
import { focusStyle } from "@/lib/image-focus";
import { isSlideVideo } from "@/lib/slides/types";
import type { ContentSlide, SlideMedia } from "@/lib/slides/types";

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
 *
 * Ô video dùng lại đúng khung của ảnh (class theo nhánh bố trí ở `MediaPanel` không đổi),
 * chỉ ép riêng khung video về 16:9 bằng inline style — không đụng CSS của các ô ảnh khác.
 * KHÔNG dùng `object-fit: cover` trên video, xem chú thích ở app/globals.css.
 */
function Figure({
  media,
  order,
  className,
  videoRef,
  videoBlocked = false,
  onVideoFallback,
}: {
  media: SlideMedia;
  order: number;
  className?: string;
  videoRef?: RefObject<HTMLVideoElement | null>;
  videoBlocked?: boolean;
  onVideoFallback?: () => void;
}) {
  const video = isSlideVideo(media);
  return (
    <figure
      className={className ? `${className} anim a-media` : "anim a-media"}
      style={animDelay(CONTENT_DELAY.mediaBase + CONTENT_DELAY.mediaStep * order)}
    >
      <div className={video ? "media-video" : undefined} style={video ? { aspectRatio: "16 / 9" } : undefined}>
        {video ? (
          <>
            <video
              ref={videoRef}
              data-testid="content-video"
              src={media.src}
              poster={media.poster}
              preload="metadata"
              playsInline
            />
            {videoBlocked ? (
              <button className="video-fallback" type="button" onClick={onVideoFallback}>
                <span className="play-triangle" aria-hidden="true" />
                NHẤN ĐỂ PHÁT VIDEO
              </button>
            ) : null}
          </>
        ) : (
          <Image
            src={media.src}
            alt={media.alt}
            width={1280}
            height={720}
            style={focusStyle(media)}
          />
        )}
      </div>
      <figcaption>
        <Phrase value={media.caption} />
      </figcaption>
    </figure>
  );
}

/** Ô video truyền chung xuống mọi `Figure` — vô hại với ô ảnh, `Figure` chỉ dùng khi là video. */
type VideoSlotProps = {
  videoRef?: RefObject<HTMLVideoElement | null>;
  videoBlocked?: boolean;
  onVideoFallback?: () => void;
};

/**
 * Ruột panel đổi theo số ô media: 1 ô tràn kín, 2 ô xếp dọc,
 * 3 ô là 1 lớn + 2 nhỏ, từ 4 ô trở lên là lưới 2 cột. Nhánh bố trí này chỉ tính theo SỐ
 * LƯỢNG, không phân biệt ảnh hay video — video chỉ đổi thứ render bên trong ô của nó.
 */
function MediaPanel({
  images,
  videoRef,
  videoBlocked,
  onVideoFallback,
}: { images: readonly SlideMedia[] } & VideoSlotProps) {
  const slot = { videoRef, videoBlocked, onVideoFallback };
  if (images.length === 0) return <div className="content-media" />;
  if (images.length === 1) {
    return (
      <div className="content-media">
        <Figure media={images[0]} order={0} className="media-solo" {...slot} />
      </div>
    );
  }
  if (images.length === 2) {
    // `--duo` chia đôi chiều cao và chừa chỗ cho cụm nhận diện; hai khung 16:9 xếp dọc
    // theo tỉ lệ gốc sẽ cao gần kín slide và đẩy ảnh lên đè cụm nhận diện.
    return (
      <div className="content-media content-media--duo">
        <Figure media={images[0]} order={0} className="media-lead" {...slot} />
        <Figure media={images[1]} order={1} className="media-lead" {...slot} />
      </div>
    );
  }
  if (images.length === 3) {
    return (
      <div className="content-media">
        <Figure media={images[0]} order={0} className="media-lead" {...slot} />
        <div className="media-pair">
          <Figure media={images[1]} order={1} {...slot} />
          <Figure media={images[2]} order={2} {...slot} />
        </div>
      </div>
    );
  }
  return (
    <div className="content-media">
      <div className="media-grid">
        {images.map((media, index) => (
          <Figure key={media.src} media={media} order={index} {...slot} />
        ))}
      </div>
    </div>
  );
}

export function ContentSlideView({
  slide,
  side,
  videoRef,
  videoBlocked,
  onVideoFallback,
}: {
  slide: ContentSlide;
  side: "left" | "right";
} & VideoSlotProps) {
  return (
    <div
      className="slide-stage"
      data-density={slide.density}
      data-side={side}
      data-on-dark={side === "left" ? "true" : "false"}
    >
      <MediaPanel
        images={slide.images}
        videoRef={videoRef}
        videoBlocked={videoBlocked}
        onVideoFallback={onVideoFallback}
      />
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
