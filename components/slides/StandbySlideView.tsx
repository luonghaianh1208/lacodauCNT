import Image from "next/image";

import { animDelay } from "@/lib/anim";
import { Phrase } from "@/components/Phrase";
import { useSlideRenderEager } from "@/lib/slide-render-context";
import type { StandbySlide } from "@/lib/slides/types";

/**
 * Nhịp "dàn nhạc vào" của trang chờ — suy theo tinh thần khuôn bìa (cùng là khuôn nền navy
 * đặc, chữ căn giữa): dòng đơn vị → logo → tiêu đề → gạch đỏ → dòng chương trình → dòng
 * địa điểm/ngày tháng. Thứ tự hiện ra bám đúng thứ tự TỪ TRÊN XUỐNG của bố cục, nên khi
 * dòng đơn vị chuyển lên trên logo thì hai mốc thời gian đổi chỗ theo.
 */
const STANDBY_DELAY = {
  eyebrow: 80,
  logo: 140,
  title: 200,
  rule: 280,
  program: 340,
  place: 400,
} as const;

/**
 * Trang 0 — bìa chờ của chương trình kiểm tra, chiếu trước giờ khai mạc và giữa các phần
 * nghỉ. Nền navy ĐẶC, không dùng ảnh: đây là trang đứng chiếu lâu, ảnh nền sẽ gây nhiễu và
 * mỏi mắt. Chỉ mang logo Đoàn (đơn vị kiểm tra là Thành đoàn Hải Phòng) — KHÔNG dùng logo
 * trường như `SlideChrome`, nên khuôn này không gọi `SlideChrome` mà tự dựng thanh cờ và bố
 * cục riêng, căn giữa theo cả hai chiều. Không số trang, không chú thích chân trang: trang
 * này đứng ngoài 44 trang đánh số của báo cáo.
 */
export function StandbySlideView({ slide }: { slide: StandbySlide }) {
  const eager = useSlideRenderEager();

  return (
    <div className="slide-stage standby-stage" data-density={slide.density} data-on-dark="true">
      <div className="slide-bar anim a-bar" />
      <div className="standby-wrap">
        <p className="standby-eyebrow anim a-rise" style={animDelay(STANDBY_DELAY.eyebrow)}>
          <Phrase value={slide.eyebrow} />
        </p>
        <div className="standby-logo anim a-fade" style={animDelay(STANDBY_DELAY.logo)}>
          <Image
            src="/media/youth-union-logo.png"
            alt="Logo Đoàn TNCS Hồ Chí Minh"
            width={120}
            height={120}
            priority={eager}
          />
        </div>
        <h1 className="standby-title serif anim a-rise" style={animDelay(STANDBY_DELAY.title)}>
          <Phrase value={slide.title} />
        </h1>
        <div className="standby-rule anim a-grow" style={animDelay(STANDBY_DELAY.rule)} />
        <p className="standby-program anim a-rise" style={animDelay(STANDBY_DELAY.program)}>
          <Phrase value={slide.program} />
        </p>
        <p className="standby-place anim a-rise" style={animDelay(STANDBY_DELAY.place)}>
          <Phrase value={slide.place} />
        </p>
      </div>
    </div>
  );
}
