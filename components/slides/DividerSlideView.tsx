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
  toc: 540,
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
      <div className="divider-wrap">
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
        <p className="divider-toc anim a-rise" style={animDelay(DIVIDER_DELAY.toc)}>
          {slide.toc.map((entry, index) => (
            <span key={`${index}-${entry[0]}`}>
              {index > 0 ? " · " : null}
              <Phrase value={entry} />
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
