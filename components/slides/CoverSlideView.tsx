import Image from "next/image";

import { animDelay } from "@/lib/anim";
import { Phrase } from "@/components/Phrase";
import { focusStyle } from "@/lib/image-focus";
import { useSlideRenderEager } from "@/lib/slide-render-context";
import type { CoverSlide } from "@/lib/slides/types";

/**
 * Nhịp "dàn nhạc vào" của khuôn bìa — chép đúng từ mockup đã duyệt
 * `docs/superpowers/references/mockups/05-chuyen-dong.html`, khối `.cv`.
 * Tấm đơn vị đăng ký không có trong mockup đó nên được xếp xen giữa tiêu đề và gạch đỏ:
 * nó là khối phụ ở góc, vào trước phần chữ dẫn thì mắt vẫn bám được dòng tiêu đề.
 */
const COVER_DELAY = {
  logos: 80,
  eyebrow: 140,
  title: 200,
  card: 240,
  rule: 320,
  sub: 380,
  bandBase: 420,
  bandStep: 90,
} as const;

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
  const eager = useSlideRenderEager();

  return (
    <div className="slide-stage coverpage-stage" data-density={slide.density} data-over-photo="true">
      {hero ? (
        <>
          <div className="coverpage-hero anim a-media">
            <Image
              src={hero.src}
              alt={hero.alt}
              width={1280}
              height={720}
              style={focusStyle(hero)}
            />
          </div>
          <div className="coverpage-veil" />
        </>
      ) : null}
      {/* Khuôn bìa không gọi SlideChrome nên phải tự gắn nhịp cho thanh cờ. */}
      <div className="slide-bar anim a-bar" />
      <div className="coverpage-copy">
        <div className="coverpage-logos anim a-fade" style={animDelay(COVER_DELAY.logos)}>
          <Image
            src="/media/school-logo.png"
            alt="Logo Trường THPT Chuyên Nguyễn Trãi"
            width={120}
            height={120}
            priority={eager}
          />
          <Image
            src="/media/youth-union-logo.png"
            alt="Logo Đoàn TNCS Hồ Chí Minh"
            width={120}
            height={120}
            priority={eager}
          />
        </div>
        <p className="coverpage-eyebrow anim a-rise" style={animDelay(COVER_DELAY.eyebrow)}>
          <Phrase value={slide.eyebrow} />
        </p>
        <h1 className="coverpage-title serif anim a-rise" style={animDelay(COVER_DELAY.title)}>
          <Phrase value={slide.title} />
        </h1>
        <div className="coverpage-rule anim a-grow" style={animDelay(COVER_DELAY.rule)} />
        <p className="coverpage-sub anim a-rise" style={animDelay(COVER_DELAY.sub)}>
          <Phrase value={slide.subtitle} />
        </p>
      </div>
      <div className="coverpage-card anim a-rise" style={animDelay(COVER_DELAY.card)}>
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
        {band.map((image, index) => (
          <figure
            key={image.src}
            className="anim a-media"
            style={animDelay(COVER_DELAY.bandBase + COVER_DELAY.bandStep * index)}
          >
            <div>
              <Image
                src={image.src}
                alt={image.alt}
                width={1280}
                height={720}
                style={focusStyle(image)}
              />
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
