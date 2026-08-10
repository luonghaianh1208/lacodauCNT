import { describe, expect, it } from "vitest";

import {
  CHANNEL_NAME,
  SLIDES,
  clampSlideIndex,
  reducePresentationState,
} from "@/lib/presentation";

describe("source-faithful presentation data", () => {
  it("contains exactly the three approved source slides", () => {
    expect(SLIDES.map((slide) => slide.sourceNumber)).toEqual([1, 31, 34]);
    expect(CHANNEL_NAME).toBe("cnt-presentation-demo-v1");
  });

  it("keeps the approved cover, KPI, and platform copy", () => {
    expect(SLIDES[0].title).toBe("BÁO CÁO KẾT QUẢ ĐƠN VỊ ĐĂNG KÝ LÁ CỜ ĐẦU");
    expect(SLIDES[1].headline).toBe("15/15");
    expect(SLIDES[1].metrics.map((metric) => metric.value)).toEqual([
      "05 · 11",
      "Trên 1.000",
      "05",
      "14",
      "03 · 01",
      "80 · 27",
    ]);
    expect(SLIDES[2].url).toBe("https://doantruong.chuyennguyentrai.edu.vn");
    expect(SLIDES[2].functions).toHaveLength(6);
    expect(SLIDES[2].effects).toHaveLength(4);
  });
});

describe("presentation state", () => {
  it("clamps navigation to the three-slide range", () => {
    expect(clampSlideIndex(-1)).toBe(0);
    expect(clampSlideIndex(1)).toBe(1);
    expect(clampSlideIndex(8)).toBe(2);
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
