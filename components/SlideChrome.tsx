import Image from "next/image";

import { Phrase } from "@/components/Phrase";
import type { Slide } from "@/lib/slides/types";

/** Thanh cờ, cụm nhận diện, số trang và chú thích chân trang — giống nhau ở mọi khuôn. */
export function SlideChrome({
  slide,
  footAlign = "left",
}: {
  slide: Slide;
  footAlign?: "left" | "right";
}) {
  return (
    <>
      <div className="slide-bar" />
      <div className="slide-brand">
        <Image
          src="/media/school-logo.png"
          alt="Logo Trường THPT Chuyên Nguyễn Trãi"
          width={120}
          height={120}
          priority
        />
        <Image
          src="/media/youth-union-logo.png"
          alt="Logo Đoàn TNCS Hồ Chí Minh"
          width={120}
          height={120}
          priority
        />
        <div>
          <strong>
            <Phrase value={["ĐOÀN TRƯỜNG THPT CHUYÊN NGUYỄN TRÃI"]} />
          </strong>
          <span>Năm học 2025–2026</span>
        </div>
      </div>
      <div className="slide-num">{slide.number}</div>
      {slide.footnote ? (
        <p
          className="slide-foot"
          style={
            footAlign === "right"
              ? { left: "auto", right: "3.4cqw", textAlign: "right" }
              : undefined
          }
        >
          <Phrase value={slide.footnote} />
        </p>
      ) : null}
    </>
  );
}
