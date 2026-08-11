import Image from "next/image";
import { type RefObject } from "react";

import { animDelay } from "@/lib/anim";
import { Phrase } from "@/components/Phrase";
import { SlideChrome } from "@/components/SlideChrome";
import type { ModelSlide } from "@/lib/slides/types";

/**
 * Nhịp "dàn nhạc vào" của khuôn mô hình. Mockup `05-chuyen-dong.html` không dựng khuôn này
 * nên nhịp được suy ra theo đúng tinh thần khuôn nội dung: khung → tiêu đề → chữ dẫn →
 * nội dung chi tiết → ảnh. Riêng hai danh sách chạy tiếp một mạch (bước 55ms thay vì 70ms
 * như gạch đầu dòng khuôn nội dung) vì tổng có tới chín mục; giữ 70ms thì mục cuối rơi quá
 * xa mốc ~900ms mà spec §7.1 đặt ra.
 */
const MODEL_DELAY = {
  title: 160,
  url: 230,
  lead: 300,
  listHeading: 345,
  listBase: 400,
  listStep: 55,
  mediaBase: 260,
  shotBase: 350,
  shotStep: 90,
} as const;

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
  // Danh sách hiệu quả nối tiếp danh sách chức năng: cộng thêm một bước cho tiêu đề nhóm.
  const effectsBase =
    MODEL_DELAY.listBase + MODEL_DELAY.listStep * (slide.functions.length + 1);

  return (
    <div
      className="slide-stage model-stage"
      data-density={slide.density}
      data-side={side}
      data-on-dark={side === "left" ? "true" : "false"}
    >
      <div className="model-media">
        <figure className="anim a-media" style={animDelay(MODEL_DELAY.mediaBase)}>
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
        {/* `data-count` để CSS xếp ba ảnh phụ thành một hàng ba cột; hai cột sẽ thành hai
            hàng, làm ruột panel cao hơn slide và cắt mất chú thích hàng dưới. */}
        {shots.length > 0 ? (
          <div className="model-shots" data-count={shots.length}>
            {shots.map((image, index) => (
              <figure
                key={image.src}
                className="anim a-media"
                style={animDelay(MODEL_DELAY.shotBase + MODEL_DELAY.shotStep * index)}
              >
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
        <h1 className="serif anim a-rise" style={animDelay(MODEL_DELAY.title)}>
          <Phrase value={slide.title} />
        </h1>
        {slide.url ? (
          <p className="model-url anim a-rise" style={animDelay(MODEL_DELAY.url)}>
            {slide.url}
          </p>
        ) : null}
        <p className="model-sum anim a-rise" style={animDelay(MODEL_DELAY.lead)}>
          <Phrase value={slide.lead} />
        </p>
      </div>
      <div className="model-lists">
        <section>
          <h2 className="fn anim a-rise" style={animDelay(MODEL_DELAY.listHeading)}>
            <Phrase value={["CÁC CHỨC NĂNG CHÍNH"]} />
          </h2>
          <ul className="model-functions">
            {slide.functions.map((item, index) => (
              <li
                key={`${index}-${item[0]}`}
                className="anim a-rise"
                style={animDelay(MODEL_DELAY.listBase + MODEL_DELAY.listStep * index)}
                data-testid="model-function"
              >
                <Phrase value={item} />
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2
            className="ef anim a-rise"
            style={animDelay(effectsBase - MODEL_DELAY.listStep)}
          >
            <Phrase value={["HIỆU QUẢ"]} />
          </h2>
          <ul className="model-effects">
            {slide.effects.map((item, index) => (
              <li
                key={`${index}-${item[0]}`}
                className="anim a-rise"
                style={animDelay(effectsBase + MODEL_DELAY.listStep * index)}
              >
                <Phrase value={item} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
