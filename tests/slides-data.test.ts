import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { MAX_PHRASE_LENGTH, type Phrases } from "@/lib/phrases";
import { SLIDES } from "@/lib/slides/data";

// Môi trường test là jsdom nên `import.meta.url` không phải URL file:.
// Vitest luôn chạy với cwd là gốc dự án, chỗ chứa vitest.config.ts.
const MEDIA_DIR = path.resolve(process.cwd(), "public/media/slides");

/** Ảnh dùng để đối chiếu: chỉ cần đường dẫn và chú thích. */
type CheckedImage = { src: string; caption: readonly string[] };

/**
 * Mọi ảnh của một slide, kể cả ảnh nền của khuôn phân mục và khuôn kết luận —
 * chúng nằm ở trường `background` chứ không nằm trong mảng `images`.
 */
function imagesOf(slide: (typeof SLIDES)[number]): CheckedImage[] {
  const images: CheckedImage[] = [];
  if ("images" in slide) images.push(...slide.images);
  if ("background" in slide && slide.background) images.push(slide.background);
  return images;
}

function allPhrases(value: unknown): Phrases[] {
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === "string")) return [value as unknown as Phrases];
    return value.flatMap(allPhrases);
  }
  if (value && typeof value === "object") return Object.values(value).flatMap(allPhrases);
  return [];
}

describe("dữ liệu 45 slide (44 trang báo cáo + trang 0 chờ)", () => {
  it("có đúng 45 slide, số trang chạy liên tục 0 đến 44", () => {
    expect(SLIDES).toHaveLength(45);
    expect(SLIDES.map((s) => s.number)).toEqual(
      Array.from({ length: 45 }, (_, i) => i),
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
      const background = "background" in slide && slide.background ? [slide.background] : [];
      for (const image of [...images, ...background]) {
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

  it("các ảnh trùng nội dung file chỉ mang một chú thích duy nhất", () => {
    // Gom theo md5 của file thật, không theo tên file: bộ ảnh trích từ PPTX có
    // nhiều bản sao cùng nội dung mang tên khác nhau. Cùng một tấm ảnh mà mang
    // hai chú thích thì ít nhất một chú thích đang sai.
    const groups = new Map<string, { where: string; caption: string }[]>();

    for (const slide of SLIDES) {
      for (const image of imagesOf(slide)) {
        const file = image.src.split("/").pop() as string;
        const hash = createHash("md5")
          .update(readFileSync(path.join(MEDIA_DIR, file)))
          .digest("hex");
        const entries = groups.get(hash) ?? [];
        entries.push({
          where: `slide ${slide.number} · ${file}`,
          caption: image.caption.join(" "),
        });
        groups.set(hash, entries);
      }
    }

    const conflicts = [...groups.entries()]
      .map(([hash, entries]) => ({
        hash,
        entries,
        captions: [...new Set(entries.map((entry) => entry.caption))],
      }))
      .filter((group) => group.captions.length > 1);

    const report = conflicts
      .map((group) =>
        [
          `Nhóm ảnh md5 ${group.hash.slice(0, 8)} mang ${group.captions.length} chú thích khác nhau:`,
          ...group.entries.map((entry) => `  ${entry.where} → "${entry.caption}"`),
        ].join("\n"),
      )
      .join("\n\n");

    expect(conflicts.length, `\n${report}\n`).toBe(0);
  });
});
