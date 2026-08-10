import { describe, expect, it } from "vitest";

import audit from "@/lib/slides/image-audit.json";

describe("bộ lọc ảnh màn hình", () => {
  it("mọi ảnh đều đo được, không ảnh nào lỗi giải mã", () => {
    for (const [file, m] of Object.entries(audit)) {
      expect(m.flat, `${file} không giải mã được`).toBeGreaterThanOrEqual(0);
      expect(m.white, `${file} không giải mã được`).toBeGreaterThanOrEqual(0);
    }
  });

  describe("neo giá trị đo từ 8 ảnh mẫu hiệu chuẩn", () => {
    const anchors = {
      "s8_img3.jpg": { flat: 0.361, white: 0.056, screenshot: false },
      "s9_img3.jpg": { flat: 0.314, white: 0.097, screenshot: false },
      "s34_img4.png": { flat: 0.717, white: 0.654, screenshot: true },
      "s35_img3.png": { flat: 0.856, white: 0.673, screenshot: true },
    };

    it("a) giá trị đo phải nằm trong khoảng ±0,05 so với hiệu chuẩn", () => {
      for (const [file, expected] of Object.entries(anchors)) {
        const measured = audit[file];
        expect(measured, `${file} không tồn tại trong audit`).toBeDefined();
        expect(measured.flat, `${file}: flat bị sai`).toBeCloseTo(expected.flat, 1);
        expect(measured.white, `${file}: white bị sai`).toBeCloseTo(expected.white, 1);
      }
    });

    it("b) phân loại phải khớp đúng: ảnh chụp vs ảnh màn hình", () => {
      for (const [file, expected] of Object.entries(anchors)) {
        const measured = audit[file];
        expect(measured.screenshot, `${file} gắn cờ sai`).toBe(expected.screenshot);
      }
    });
  });

  it("c) khoảng trống giữa hai nhóm: không chồng lấn", () => {
    const nonScreenshots = Object.values(audit).filter((m) => !m.screenshot);
    const screenshots = Object.values(audit).filter((m) => m.screenshot);

    const maxWhiteNonScreenshot = Math.max(...nonScreenshots.map((m) => m.white));
    const minWhiteScreenshot = Math.min(...screenshots.map((m) => m.white));

    const maxFlatNonScreenshot = Math.max(...nonScreenshots.map((m) => m.flat));
    const minFlatScreenshot = Math.min(...screenshots.map((m) => m.flat));

    // Hai nhóm tách rõ ở ít nhất một trong hai chỉ số
    const whiteGap = minWhiteScreenshot - maxWhiteNonScreenshot;
    const flatGap = minFlatScreenshot - maxFlatNonScreenshot;

    expect(whiteGap > 0 || flatGap > 0, "Hai nhóm ảnh chồng lấn").toBe(true);
    if (whiteGap > 0) {
      expect(whiteGap, `Khoảng trống white quá nhỏ (${whiteGap})`).toBeGreaterThan(0.1);
    } else {
      expect(flatGap, `Khoảng trống flat quá nhỏ (${flatGap})`).toBeGreaterThan(0.1);
    }
  });
});
