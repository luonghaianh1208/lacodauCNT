import Image from "next/image";

import { Phrase } from "@/components/Phrase";
import type { Slide } from "@/lib/slides/types";

/**
 * Thanh cờ, cụm nhận diện, số trang và chú thích chân trang — giống nhau ở mọi khuôn.
 *
 * `side` là vị trí của PANEL ẢNH (giống hệt prop `side` của khuôn gọi nó), không phải vị
 * trí hiển thị của số trang/chân trang: panel chiếm một bên thì cột chữ — nên cả số trang
 * lẫn chú thích chân trang — phải nằm bên còn lại, nếu không sẽ đè lên panel navy hoặc lẫn
 * màu với panel. Với khuôn không có panel ảnh (số liệu, phân mục), `.slide-stage` bao ngoài
 * không gắn thuộc tính `data-side`, nên CSS đổi vị trí (khoá theo `.slide-stage[data-side]`)
 * không áp dụng — số trang vẫn ở góc phải-trên và chân trang vẫn ở trái như trước giờ.
 */
export function SlideChrome({
  slide,
  side = "right",
}: {
  slide: Slide;
  side?: "left" | "right";
}) {
  const textSide = side === "left" ? "right" : "left";

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
      <div className="slide-num" data-align={textSide}>
        {slide.number}
      </div>
      {slide.footnote ? (
        <p className="slide-foot" data-align={textSide}>
          <Phrase value={slide.footnote} />
        </p>
      ) : null}
    </>
  );
}
