import Image from "next/image";
import { Fragment } from "react";

import { Phrase } from "@/components/Phrase";
import type { OutroSlide } from "@/lib/slides/types";

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
          <div className="outro-bg">
            <Image
              src={slide.background.src}
              alt={slide.background.alt}
              width={1280}
              height={720}
            />
          </div>
          <div className="outro-veil" />
        </>
      ) : null}
      <div className="slide-bar" />
      <div className="slide-num">{slide.number}</div>
      <div className="outro-msg">
        <p className="outro-kicker">
          <Phrase value={slide.kicker} />
        </p>
        <h1 className="serif">
          <Phrase value={slide.title} />
        </h1>
        <p className="outro-slogan">
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
      <p className="outro-lead">
        <Phrase value={slide.lead} />
      </p>
      <div className="outro-stats">
        {slide.stats.map((stat, index) => (
          <div
            key={`${index}-${stat.value}`}
            className={`outro-stat tone-${stat.tone}`}
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
