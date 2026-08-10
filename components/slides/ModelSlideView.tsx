import Image from "next/image";
import { type RefObject } from "react";

import { Phrase } from "@/components/Phrase";
import { SlideChrome } from "@/components/SlideChrome";
import type { ModelSlide } from "@/lib/slides/types";

/**
 * Khuôn mô hình + media — panel navy chứa video minh chứng đổi bên qua `side`,
 * văn bản (tiêu đề, URL, hai danh sách) nằm phía đối diện.
 * Không phải slide "model" nào cũng có `videoSrc` (3/4 slide thật chỉ có ảnh),
 * nên khi thiếu video thì hiện ảnh dẫn dắt (`role: "chinh"`) thay thế.
 */
export function ModelSlideView({
  slide,
  side = "right",
  videoRef,
  videoBlocked = false,
  onVideoFallback,
}: {
  slide: ModelSlide;
  side?: "left" | "right";
  videoRef?: RefObject<HTMLVideoElement | null>;
  videoBlocked?: boolean;
  onVideoFallback?: () => void;
}) {
  const hero = slide.images.find((image) => image.role === "chinh");
  const shots = slide.images.filter((image) => image.role !== "chinh");

  return (
    <div
      className="slide-stage model-stage"
      data-density={slide.density}
      data-side={side}
      data-on-dark={side === "left" ? "true" : "false"}
    >
      <div className="model-media">
        <figure>
          <div className="model-video">
            {slide.videoSrc ? (
              <video
                ref={videoRef}
                data-testid="model-video"
                src={slide.videoSrc}
                poster={hero?.src}
                preload="metadata"
                playsInline
              />
            ) : hero ? (
              <Image src={hero.src} alt={hero.alt} width={1280} height={720} />
            ) : null}
            {slide.videoSrc && videoBlocked ? (
              <button className="video-fallback" type="button" onClick={onVideoFallback}>
                <span className="play-triangle" aria-hidden="true" />
                NHẤN ĐỂ PHÁT VIDEO
              </button>
            ) : null}
          </div>
          {hero ? (
            <figcaption>
              <Phrase value={hero.caption} />
            </figcaption>
          ) : null}
        </figure>
        {shots.length > 0 ? (
          <div className="model-shots">
            {shots.map((image) => (
              <figure key={image.src}>
                <div>
                  <Image src={image.src} alt={image.alt} width={1280} height={720} />
                </div>
                <figcaption>
                  <Phrase value={image.caption} />
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}
      </div>
      <SlideChrome slide={slide} side={side} />
      <div className="model-head">
        <h1 className="serif">
          <Phrase value={slide.title} />
        </h1>
        {slide.url ? <p className="model-url">{slide.url}</p> : null}
        <p className="model-sum">
          <Phrase value={slide.lead} />
        </p>
      </div>
      <div className="model-lists">
        <section>
          <h2 className="fn">
            <Phrase value={["CÁC CHỨC NĂNG CHÍNH"]} />
          </h2>
          <ul className="model-functions">
            {slide.functions.map((item, index) => (
              <li key={`${index}-${item[0]}`} data-testid="model-function">
                <Phrase value={item} />
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="ef">
            <Phrase value={["HIỆU QUẢ"]} />
          </h2>
          <ul className="model-effects">
            {slide.effects.map((item, index) => (
              <li key={`${index}-${item[0]}`}>
                <Phrase value={item} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
