import { Phrase } from "@/components/Phrase";
import { SlideChrome } from "@/components/SlideChrome";
import type { KpiSlide } from "@/lib/slides/types";

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
  return (
    <div className="slide-stage figures-stage" data-density={slide.density}>
      <SlideChrome slide={slide} />
      <div className="figures-head">
        <h1 className="serif">
          <Phrase value={slide.title} />
          {slide.continued ? " (tiếp)" : null}
        </h1>
        {!slide.continued && slide.lead ? (
          <p className="figures-sum">
            <Phrase value={slide.lead} />
          </p>
        ) : null}
      </div>
      <div className="figures-rule" />
      <div className="figures-hero">
        <b className={animate ? "figures-hero-value figures-hero-value--animate" : "figures-hero-value"}>
          {slide.headline}
        </b>
        <div className="figures-hero-txt">
          <span className="figures-hero-label">
            <Phrase value={slide.headlineLabel} />
          </span>
        </div>
      </div>
      <div className="figures-grid">
        {slide.metrics.map((metric, index) => (
          <div
            key={`${index}-${metric.value}`}
            className={`figures-cell tone-${metric.tone}`}
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
