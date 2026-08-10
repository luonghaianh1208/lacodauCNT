import { describe, expect, it } from "vitest";

import { MAX_PHRASE_LENGTH, type Phrases } from "@/lib/phrases";
import { SLIDES } from "@/lib/slides/data";

function allPhrases(value: unknown): Phrases[] {
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === "string")) return [value as unknown as Phrases];
    return value.flatMap(allPhrases);
  }
  if (value && typeof value === "object") return Object.values(value).flatMap(allPhrases);
  return [];
}

describe("dữ liệu 38 slide", () => {
  it("có đúng 38 slide, số trang chạy liên tục 1 đến 38", () => {
    expect(SLIDES).toHaveLength(38);
    expect(SLIDES.map((s) => s.number)).toEqual(
      Array.from({ length: 38 }, (_, i) => i + 1),
    );
  });

  it("không cụm từ nào dài quá ngưỡng", () => {
    for (const slide of SLIDES) {
      for (const phrases of allPhrases(slide)) {
        for (const chunk of phrases) {
          expect(
            chunk.length,
            `slide ${slide.number}: cụm "${chunk}" dài ${chunk.length} ký tự`,
          ).toBeLessThanOrEqual(MAX_PHRASE_LENGTH);
        }
      }
    }
  });

  it("không cụm từ nào rỗng", () => {
    for (const slide of SLIDES) {
      for (const phrases of allPhrases(slide)) {
        for (const chunk of phrases) {
          expect(chunk.trim().length, `slide ${slide.number} có cụm rỗng`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("mọi ảnh đóng vai trò nền đều không phải ảnh màn hình", async () => {
    const audit = (await import("@/lib/slides/image-audit.json")).default as Record<
      string,
      { screenshot: boolean }
    >;

    for (const slide of SLIDES) {
      const images = "images" in slide ? slide.images : [];
      for (const image of images) {
        if (image.role !== "nen") continue;
        const file = image.src.split("/").pop() as string;
        expect(
          audit[file]?.screenshot,
          `slide ${slide.number}: ${file} là ảnh màn hình, không được làm ảnh nền`,
        ).toBe(false);
      }
    }
  });

  it("mỗi slide có ảnh đều có alt và caption thật", () => {
    for (const slide of SLIDES) {
      const images = "images" in slide ? slide.images : [];
      for (const image of images) {
        expect(image.alt.trim(), `slide ${slide.number}: thiếu alt`).not.toBe("");
        expect(image.caption[0], `slide ${slide.number}: caption chưa điền`).not.toBe(
          "Chờ chú thích",
        );
      }
    }
  });
});
