import { describe, expect, it } from "vitest";

import audit from "@/lib/slides/image-audit.json";

describe("bộ lọc ảnh màn hình", () => {
  it("mọi ảnh đều đo được, không ảnh nào lỗi giải mã", () => {
    for (const [file, m] of Object.entries(audit)) {
      expect(m.flat, `${file} không giải mã được`).toBeGreaterThanOrEqual(0);
      expect(m.white, `${file} không giải mã được`).toBeGreaterThanOrEqual(0);
    }
  });

  it("cờ screenshot khớp đúng ngưỡng đã chốt trong spec", () => {
    for (const [file, m] of Object.entries(audit)) {
      const expected = m.white > 0.25 || m.flat > 0.65;
      expect(m.screenshot, `${file} gắn cờ sai`).toBe(expected);
    }
  });
});
