import Image from "next/image";

import { Phrase } from "@/components/Phrase";
import type { CoverSlide } from "@/lib/slides/types";

/**
 * Khuôn bìa (slide 1) dùng bố cục riêng lấy nguyên từ `01-bia.html` (phương án A):
 * logo nằm trong khối copy (không phải `slide-brand` góc trên trái), góc phải trên
 * là tấm đơn vị đăng ký thay cho số trang, và không có chú thích chân trang dạng
 * `SlideChrome`. Vì vậy khuôn này KHÔNG gọi `SlideChrome` — chỉ dùng lại `.slide-bar`
 * dùng chung để tránh đè chồng lên tấm đơn vị ở cùng góc.
 */
export function CoverSlideView({ slide }: { slide: CoverSlide }) {
  const hero = slide.images.find((image) => image.role === "nen");
  const band = slide.images.filter((image) => image.role !== "nen");

  return (
    <div className="slide-stage coverpage-stage" data-density={slide.density} data-over-photo="true">
      {hero ? (
        <>
          <div className="coverpage-hero">
            <Image src={hero.src} alt={hero.alt} width={1280} height={720} />
          </div>
          <div className="coverpage-veil" />
        </>
      ) : null}
      <div className="slide-bar" />
      <div className="coverpage-copy">
        <div className="coverpage-logos">
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
        </div>
        <p className="coverpage-eyebrow">
          <Phrase value={slide.eyebrow} />
        </p>
        <h1 className="coverpage-title serif">
          <Phrase value={slide.title} />
        </h1>
        <div className="coverpage-rule" />
        <p className="coverpage-sub">
          <Phrase value={slide.subtitle} />
        </p>
      </div>
      <div className="coverpage-card">
        {slide.units.map((unit, index) => (
          <p key={`unit-${index}-${unit[0]}`} className="coverpage-card-unit">
            <span className="coverpage-mark">●</span>
            <Phrase value={unit} />
          </p>
        ))}
        <p>
          <span className="coverpage-mark">●</span>
          <Phrase value={slide.date} />
        </p>
        <p className="coverpage-card-foot">
          <Phrase value={slide.footer} />
        </p>
      </div>
      <div className="coverpage-band">
        {band.map((image) => (
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
    </div>
  );
}
