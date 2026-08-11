import { describe, expect, it } from "vitest";

import auditRaw from "@/lib/slides/image-audit.json";

// Khai báo kiểu tường minh để tránh lỗi TypeScript khi dùng biến string index
type ImageMetrics = { flat: number; white: number; screenshot: boolean };
const audit = auditRaw as Record<string, ImageMetrics>;

describe("bộ lọc ảnh màn hình", () => {
  it("mọi ảnh đều đo được, không ảnh nào lỗi giải mã", () => {
    for (const [file, m] of Object.entries(audit)) {
      expect(m.flat, `${file} không giải mã được`).toBeGreaterThanOrEqual(0);
      expect(m.white, `${file} không giải mã được`).toBeGreaterThanOrEqual(0);
    }
  });

  describe("neo giá trị đo từ 8 ảnh mẫu hiệu chuẩn", () => {
    // Bốn số neo dưới KHÔNG chép từ `image-audit.json` (như vậy thì test chỉ là phép lặp
    // thừa): chúng đo ở giai đoạn thiết kế bằng một script KHÁC, trên đúng những file ảnh
    // này — đã đối chiếu md5 để chắc file lúc đó và file trong repo là một. Nhờ vậy chúng
    // là nguồn đối chứng độc lập, bắt được cả lỗi của script sinh ra `image-audit.json`.
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

  it("c) kiểm chứng biên an toàn: ảnh sát ranh giới quyết định", () => {
    // Quy tắc phân loại là HOẶC hai chiều: screenshot = (white > 0.25 HOẶC flat > 0.65)
    // Test này tìm những ảnh nằm sát ranh giới: |white - 0.25| < 0.05 HOẶC |flat - 0.65| < 0.05
    // Khi có ảnh rơi vào vùng này, một thay đổi nhỏ trong phép đo sẽ lật kết quả.
    // Nếu test này đỏ, cần mở ảnh ra nhìn thủ công, chứ không phải nới ngưỡng.

    const nearBoundary = Object.entries(audit).filter(([, m]) => {
      const whiteDistance = Math.abs(m.white - 0.25);
      const flatDistance = Math.abs(m.flat - 0.65);
      return whiteDistance < 0.05 || flatDistance < 0.05;
    });

    const nearBoundaryFiles = nearBoundary.map(([f]) => f);
    expect(nearBoundaryFiles, "Số lượng ảnh sát biên thay đổi").toEqual(["s24_img6.jpg"]);
  });
});
