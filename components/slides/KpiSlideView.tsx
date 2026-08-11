"use client";

import { useEffect, useState } from "react";

import { animDelay } from "@/lib/anim";
import { Phrase } from "@/components/Phrase";
import { SlideChrome } from "@/components/SlideChrome";
import type { KpiSlide } from "@/lib/slides/types";

/**
 * Nhịp "dàn nhạc vào" của khuôn số liệu — chép đúng từ mockup đã duyệt
 * `docs/superpowers/references/mockups/05-chuyen-dong.html`, khối `.kp`.
 * Thanh cờ và cụm nhận diện do `SlideChrome` lo.
 */
const KPI_DELAY = {
  title: 160,
  lead: 230,
  rule: 300,
  hero: 340,
  heroLabel: 420,
  cellBase: 470,
  cellStep: 60,
} as const;

/**
 * Đếm tăng bắt đầu CÙNG mốc với cú trồi lên của con số (340ms) chứ không phải từ 0ms:
 * trước mốc đó phần tử còn trong suốt (`animation-fill-mode: both`), đếm lúc ấy là đếm
 * cho không ai xem. Thời lượng 900ms lấy từ spec §5.4, và mockup 05 cũng chạy đúng vậy.
 */
const HERO_COUNT_MS = 900;

/**
 * Tách phần số đứng đầu chuỗi con số chủ đạo: `"15/15"` → 15 và `"/15"`, `"100%"` → 100 và
 * `"%"`. Trả về `null` khi chuỗi không mở đầu bằng chữ số (`"Trên 1.000"`) — trường hợp đó
 * hiện thẳng, không đếm, vì đếm phần đuôi của một cụm chữ đọc ra thành vô nghĩa.
 */
export function splitLeadingNumber(
  headline: string,
): { target: number; rest: string } | null {
  const match = /^\d+/.exec(headline);
  if (!match) {
    return null;
  }
  return { target: Number(match[0]), rest: headline.slice(match[0].length) };
}

/**
 * Con số chủ đạo đếm tăng từ 0 trong 900ms (spec §5.4). Giá trị khởi tạo là chuỗi cuối cùng
 * để HTML dựng sẵn lúc build khớp với lần render đầu ở client (hydration); vòng đếm chỉ bắt
 * đầu trong effect, tức là chỉ ở client.
 */
function useCountUpHeadline(headline: string, animate: boolean): string {
  const [display, setDisplay] = useState(headline);

  useEffect(() => {
    const parts = splitLeadingNumber(headline);
    if (!animate || !parts) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(headline);
      return;
    }

    const { target, rest } = parts;
    let frame = 0;
    let startedAt: number | null = null;

    const step = (now: number) => {
      startedAt ??= now;
      const progress = Math.min(1, (now - startedAt) / HERO_COUNT_MS);
      setDisplay(`${Math.round(progress * target)}${rest}`);
      if (progress < 1) {
        frame = window.requestAnimationFrame(step);
      }
    };

    setDisplay(`0${rest}`);
    const timer = window.setTimeout(() => {
      frame = window.requestAnimationFrame(step);
    }, KPI_DELAY.hero);

    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
    };
  }, [animate, headline]);

  return display;
}

/**
 * Khuôn số liệu — con số chủ đạo cạnh nhãn, lưới 6 thẻ chỉ tiêu bên dưới.
 * `animate=true` bật hiệu ứng đếm-vào cho con số chủ đạo; `animate=false` (mặc định)
 * hiện thẳng giá trị cuối để ô xem trước ở màn điều khiển không nhấp nháy.
 */
export function KpiSlideView({
  slide,
  animate = false,
}: {
  slide: KpiSlide;
  animate?: boolean;
}) {
  const headline = useCountUpHeadline(slide.headline, animate);

  return (
    <div className="slide-stage figures-stage" data-density={slide.density}>
      <SlideChrome slide={slide} />
      <div className="figures-head">
        <h1 className="serif anim a-rise" style={animDelay(KPI_DELAY.title)}>
          <Phrase value={slide.title} />
          {slide.continued ? " (tiếp)" : null}
        </h1>
        {!slide.continued && slide.lead ? (
          <p className="figures-sum anim a-rise" style={animDelay(KPI_DELAY.lead)}>
            <Phrase value={slide.lead} />
          </p>
        ) : null}
      </div>
      <div className="figures-rule anim a-grow" style={animDelay(KPI_DELAY.rule)} />
      <div className="figures-hero">
        {/* `serif` bắt buộc: đây là glyph lớn nhất cả bộ (spec §3.1 — tiêu đề VÀ con số
            dùng Source Serif 4), mockup 03 cũng dùng `<b class="serif">`. */}
        <b
          className="figures-hero-value serif anim a-rise"
          style={animDelay(KPI_DELAY.hero)}
        >
          {headline}
        </b>
        <div className="figures-hero-txt anim a-rise" style={animDelay(KPI_DELAY.heroLabel)}>
          <span className="figures-hero-label">
            <Phrase value={slide.headlineLabel} />
          </span>
        </div>
      </div>
      <div className="figures-grid">
        {slide.metrics.map((metric, index) => (
          <div
            key={`${index}-${metric.value}`}
            className={`figures-cell tone-${metric.tone} anim a-rise`}
            style={animDelay(KPI_DELAY.cellBase + KPI_DELAY.cellStep * index)}
            data-testid="kpi-metric"
          >
            <b>{metric.value}</b>
            <span>
              <Phrase value={metric.label} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
