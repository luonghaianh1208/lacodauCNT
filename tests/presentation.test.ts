import { describe, expect, it } from "vitest";

import { CHANNEL_NAME, clampSlideIndex, reducePresentationState } from "@/lib/presentation";
import { SLIDES } from "@/lib/slides";
import type { KpiSlide, ModelSlide, Slide } from "@/lib/slides/types";

// `SLIDES` là tuple `as const` nên phần tử của nó là hợp của 45 kiểu object
// literal chính xác, hẹp hơn kiểu `Slide` trừu tượng — .find() với type predicate
// chỉ thu hẹp đúng khi phần tử mảng đã có kiểu `Slide`. Ép kiểu một lần ở đây.
const slides: readonly Slide[] = SLIDES;

describe("source-faithful presentation data", () => {
  it("contains all 45 slides (trang 0 chờ + 44 trang báo cáo) in source order", () => {
    expect(SLIDES.map((slide) => slide.number)).toEqual(
      Array.from({ length: 45 }, (_, index) => index),
    );
    expect(CHANNEL_NAME).toBe("cnt-presentation-demo-v1");
  });

  it("keeps the approved cover, KPI, and model copy", () => {
    const kpiSlide = slides.find((slide): slide is KpiSlide => slide.kind === "kpi");
    const modelSlide = slides.find(
      (slide): slide is ModelSlide => slide.kind === "model" && Boolean(slide.videoSrc),
    );

    expect(SLIDES[0].kind).toBe("standby");
    expect(SLIDES[1].kind).toBe("cover");
    expect(kpiSlide?.headline).toBe("15/15");
    expect(kpiSlide?.metrics.map((metric) => metric.value)).toEqual([
      "05 · 11",
      "Trên 1.000",
      "05",
      "14",
      "03 · 01",
      "80 · 27",
    ]);
    expect(modelSlide?.url).toBe("https://doantruong.chuyennguyentrai.edu.vn");
    expect(modelSlide?.groups.map((group) => group.label.join(" "))).toEqual([
      "ĐIỂM MỚI, SÁNG TẠO",
      "HIỆU QUẢ",
    ]);
    expect(modelSlide?.groups.map((group) => group.items.length)).toEqual([5, 4]);
  });
});

describe("presentation state", () => {
  it("clamps navigation to the 45-slide range", () => {
    expect(clampSlideIndex(-1)).toBe(0);
    expect(clampSlideIndex(1)).toBe(1);
    expect(clampSlideIndex(999)).toBe(44);
  });

  it("accepts newer state and ignores stale state", () => {
    const initial = { slideIndex: 0, sequence: 4 };
    const newer = reducePresentationState(initial, {
      type: "sync",
      slideIndex: 2,
      sequence: 5,
    });
    const stale = reducePresentationState(newer, {
      type: "sync",
      slideIndex: 1,
      sequence: 3,
    });

    expect(newer).toEqual({ slideIndex: 2, sequence: 5 });
    expect(stale).toBe(newer);
  });

  it("advances locally with a monotonic sequence", () => {
    expect(
      reducePresentationState(
        { slideIndex: 1, sequence: 7 },
        { type: "navigate", slideIndex: 2 },
      ),
    ).toEqual({ slideIndex: 2, sequence: 8 });
  });
});
