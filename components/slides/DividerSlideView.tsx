import Image from "next/image";

import { animDelay } from "@/lib/anim";
import { Phrase } from "@/components/Phrase";
import { SlideChrome } from "@/components/SlideChrome";
import { focusStyle } from "@/lib/image-focus";
import type { DividerSlide } from "@/lib/slides/types";

/**
 * Nhịp "dàn nhạc vào" của trang phân mục — chép đúng từ mockup đã duyệt
 * `docs/superpowers/references/mockups/05-chuyen-dong.html`, khối `.dv`.
 * Thanh cờ và cụm nhận diện do `SlideChrome` lo.
 */
const DIVIDER_DELAY = {
  partLabel: 200,
  partLetter: 260,
  title: 380,
  rule: 480,
  lead: 520,
  toc: 540,
  pointBase: 600,
  pointStep: 70,
} as const;

export function DividerSlideView({ slide }: { slide: DividerSlide }) {
  return (
    <div
      className="slide-stage divider-stage"
      data-density={slide.density}
      data-on-dark="true"
      data-over-photo={slide.background ? "true" : "false"}
    >
      {slide.background ? (
        <>
          <div className="divider-bg anim a-media">
            <Image
              src={slide.background.src}
              alt={slide.background.alt}
              width={1280}
              height={720}
              style={focusStyle(slide.background)}
            />
          </div>
          <div className="divider-veil" />
        </>
      ) : null}
      <SlideChrome slide={slide} />
      {/* Có `points` thì khung chia đôi: cụm tiêu đề bên trái, các ý chi tiết bên phải —
          xếp dọc một cột thì tổng chiều cao vượt quá khoảng trống giữa cụm nhận diện và
          chú thích chân trang. */}
      <div className="divider-wrap" data-points={slide.points ? "true" : "false"}>
        <div className="divider-main">
          <div className="divider-part">
            <span className="anim a-rise" style={animDelay(DIVIDER_DELAY.partLabel)}>
              <Phrase value={["PHẦN"]} />
            </span>
            <b className="serif anim a-rise" style={animDelay(DIVIDER_DELAY.partLetter)}>
              {slide.part}
            </b>
          </div>
          <h1 className="serif anim a-rise" style={animDelay(DIVIDER_DELAY.title)}>
            <Phrase value={slide.title} />
          </h1>
          <div className="divider-rule anim a-grow" style={animDelay(DIVIDER_DELAY.rule)} />
          {slide.lead ? (
            <p className="divider-sum anim a-rise" style={animDelay(DIVIDER_DELAY.lead)}>
              <Phrase value={slide.lead} />
            </p>
          ) : null}
          <p className="divider-toc anim a-rise" style={animDelay(DIVIDER_DELAY.toc)}>
            {slide.toc.map((entry, index) => (
              <span key={`${index}-${entry[0]}`}>
                {index > 0 ? " · " : null}
                <Phrase value={entry} />
              </span>
            ))}
          </p>
        </div>
        {slide.points ? (
          <ul className="divider-points">
            {slide.points.map((point, index) => (
              <li
                key={`${index}-${point[0]}`}
                className="anim a-rise"
                style={animDelay(
                  DIVIDER_DELAY.pointBase + DIVIDER_DELAY.pointStep * index,
                )}
                data-testid="divider-point"
              >
                <Phrase value={point} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
