import Image from "next/image";
import { Fragment } from "react";

import { animDelay } from "@/lib/anim";
import { Phrase } from "@/components/Phrase";
import { focusStyle } from "@/lib/image-focus";
import type { OutroSlide } from "@/lib/slides/types";

/**
 * Nhịp "dàn nhạc vào" của khuôn kết luận. Mockup `05-chuyen-dong.html` không dựng khuôn này
 * nên nhịp được suy ra theo tinh thần khuôn bìa (cùng là khuôn "hai đầu sổ", chữ căn giữa):
 * khung → dòng dẫn → tiêu đề → khẩu hiệu → chữ khái quát → dải chỉ số. Khuôn này không có
 * gạch đỏ nên không có mốc `a-grow`.
 */
const OUTRO_DELAY = {
  kicker: 140,
  title: 200,
  slogan: 300,
  lead: 380,
  statBase: 460,
  statStep: 70,
} as const;

/**
 * Khuôn kết luận (slide 38) — như trang bìa, đây là khuôn "hai đầu sổ" của bộ slide
 * nên KHÔNG có `slide-brand` (mockup `.O` không có `.brand`). Tái dùng trực tiếp các
 * class dùng chung `.slide-bar` / `.slide-num` / `.slide-foot` thay vì gọi `SlideChrome`
 * (vốn luôn kèm khối brand) để khớp đúng bố cục đã duyệt.
 */
export function OutroSlideView({ slide }: { slide: OutroSlide }) {
  return (
    <div
      className="slide-stage outro-stage"
      data-density={slide.density}
      data-over-photo={slide.background ? "true" : "false"}
      data-on-dark="true"
    >
      {slide.background ? (
        <>
          <div className="outro-bg anim a-media">
            <Image
              src={slide.background.src}
              alt={slide.background.alt}
              width={1280}
              height={720}
              style={focusStyle(slide.background)}
            />
          </div>
          <div className="outro-veil" />
        </>
      ) : null}
      {/* Khuôn kết luận không gọi SlideChrome nên phải tự gắn nhịp cho thanh cờ. */}
      <div className="slide-bar anim a-bar" />
      <div className="slide-num">{slide.number}</div>
      <div className="outro-msg">
        <p className="outro-kicker anim a-rise" style={animDelay(OUTRO_DELAY.kicker)}>
          <Phrase value={slide.kicker} />
        </p>
        <h1 className="serif anim a-rise" style={animDelay(OUTRO_DELAY.title)}>
          <Phrase value={slide.title} />
        </h1>
        <p className="outro-slogan anim a-rise" style={animDelay(OUTRO_DELAY.slogan)}>
          {slide.slogan.map((word, index) => (
            <Fragment key={`${index}-${word[0]}`}>
              {index > 0 ? (
                <>
                  {" "}
                  <i>–</i>{" "}
                </>
              ) : null}
              <Phrase value={word} />
            </Fragment>
          ))}
        </p>
      </div>
      <p className="outro-lead anim a-rise" style={animDelay(OUTRO_DELAY.lead)}>
        <Phrase value={slide.lead} />
      </p>
      <div className="outro-stats">
        {slide.stats.map((stat, index) => (
          <div
            key={`${index}-${stat.value}`}
            className={`outro-stat tone-${stat.tone} anim a-rise`}
            style={animDelay(OUTRO_DELAY.statBase + OUTRO_DELAY.statStep * index)}
            data-testid="outro-stat"
          >
            <b>{stat.value}</b>
            <span>
              <Phrase value={stat.label} />
            </span>
          </div>
        ))}
      </div>
      {slide.footnote ? (
        <p className="slide-foot">
          <Phrase value={slide.footnote} />
        </p>
      ) : null}
    </div>
  );
}
