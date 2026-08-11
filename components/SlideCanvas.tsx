"use client";

import { type RefObject } from "react";

import { ContentSlideView } from "@/components/slides/ContentSlideView";
import { CoverSlideView } from "@/components/slides/CoverSlideView";
import { DividerSlideView } from "@/components/slides/DividerSlideView";
import { KpiSlideView } from "@/components/slides/KpiSlideView";
import { ModelSlideView } from "@/components/slides/ModelSlideView";
import { OutroSlideView } from "@/components/slides/OutroSlideView";
import { StandbySlideView } from "@/components/slides/StandbySlideView";
import { type MotionMode } from "@/lib/motion";
import { clampIndex, panelSideFor, SLIDES } from "@/lib/slides";

type SlideCanvasProps = {
  index: number;
  mode: "full" | "preview";
  /**
   * Chế độ chuyển động của màn đang hiển thị. Chỉ dùng để tắt vòng đếm số của khuôn số
   * liệu: đó là vòng lặp JavaScript nên luật `[data-motion="off"] * { animation: none }`
   * trong CSS không chạm tới được. Bỏ qua thì ảnh chụp `?capture=1` (vốn ép về "off") bắt
   * đúng lúc con số còn đang đếm dở.
   */
  motion?: MotionMode;
  videoRef?: RefObject<HTMLVideoElement | null>;
  videoBlocked?: boolean;
  onVideoFallback?: () => void;
};

/**
 * Router khuôn: chọn đúng component khuôn theo `slide.kind`. Không gánh việc
 * chuyển cảnh — hệ chuyển động (`lib/motion.ts` + CSS) do nơi điều phối slide
 * (màn hình trình chiếu) áp `data-transition` / `data-motion` lên khung bọc.
 */
export function SlideCanvas({
  index,
  mode,
  motion = "force",
  videoRef,
  videoBlocked = false,
  onVideoFallback,
}: SlideCanvasProps) {
  const safeIndex = clampIndex(index);
  const slide = SLIDES[safeIndex];
  const animate = mode === "full" && motion !== "off";

  return (
    <div className={`slide-shell slide-shell--${mode}`} data-slide-index={safeIndex}>
      {slide.kind === "standby" ? <StandbySlideView slide={slide} /> : null}
      {slide.kind === "cover" ? <CoverSlideView slide={slide} /> : null}
      {slide.kind === "divider" ? <DividerSlideView slide={slide} /> : null}
      {slide.kind === "content" ? (
        <ContentSlideView slide={slide} side={panelSideFor(safeIndex)} />
      ) : null}
      {slide.kind === "kpi" ? <KpiSlideView slide={slide} animate={animate} /> : null}
      {slide.kind === "model" ? (
        <ModelSlideView
          slide={slide}
          side={panelSideFor(safeIndex)}
          videoRef={videoRef}
          videoBlocked={videoBlocked}
          onVideoFallback={onVideoFallback}
        />
      ) : null}
      {slide.kind === "outro" ? <OutroSlideView slide={slide} /> : null}
    </div>
  );
}
