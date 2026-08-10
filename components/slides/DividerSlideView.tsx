import Image from "next/image";

import { Phrase } from "@/components/Phrase";
import { SlideChrome } from "@/components/SlideChrome";
import type { DividerSlide } from "@/lib/slides/types";

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
          <div className="divider-bg">
            <Image
              src={slide.background.src}
              alt={slide.background.alt}
              width={1280}
              height={720}
            />
          </div>
          <div className="divider-veil" />
        </>
      ) : null}
      <SlideChrome slide={slide} />
      <div className="divider-wrap">
        <div className="divider-part">
          <span>
            <Phrase value={["PHẦN"]} />
          </span>
          <b className="serif">{slide.part}</b>
        </div>
        <h1 className="serif">
          <Phrase value={slide.title} />
        </h1>
        <div className="divider-rule" />
        <p className="divider-toc">
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
