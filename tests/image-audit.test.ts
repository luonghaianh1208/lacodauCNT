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

  describe("neo giá trị đo từ ảnh mẫu hiệu chuẩn", () => {
    // Hai số neo dưới KHÔNG chép từ `image-audit.json` (như vậy thì test chỉ là phép lặp
    // thừa): chúng đo ở giai đoạn thiết kế bằng một script KHÁC, trên đúng những file ảnh
    // này — đã đối chiếu md5 để chắc file lúc đó và file trong repo là một. Nhờ vậy chúng
    // là nguồn đối chứng độc lập, bắt được cả lỗi của script sinh ra `image-audit.json`.
    //
    // Bộ 44 slide thay toàn bộ ảnh chụp hoạt động bằng bộ ảnh mới của nhà trường, nên hai
    // neo phía "ảnh chụp" (s8_img3.jpg, s9_img3.jpg) không còn file để đo. Không thay bằng
    // ảnh mới: giá trị của chúng chỉ có thể chép lại từ chính `image-audit.json` nên sẽ
    // không còn là đối chứng độc lập nữa. Phía "ảnh chụp" hiện được canh gác bằng test
    // "mọi ảnh đều đo được" và bằng test ảnh nền ở tests/slides-data.test.ts.
    const anchors = {
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

    /*
     * Đúng một tấm nằm sát biên và đã mở ra nhìn tận mắt: ảnh chiến sĩ hải quân mang quà
     * Tết ra đảo, chụp dưới trời trắng xoá không mây nên white = 0,285, vượt ngưỡng 0,25
     * và bị gắn nhầm cờ ảnh màn hình. KHÔNG nới ngưỡng vì một tấm: ảnh này chỉ đóng vai
     * ảnh phụ ở slide 41, mà cờ ảnh màn hình chỉ chặn vai trò ảnh NỀN nên không ảnh hưởng.
     */
    const nearBoundaryFiles = nearBoundary.map(([f]) => f);
    expect(nearBoundaryFiles, "Số lượng ảnh sát biên thay đổi").toEqual([
      "Những cánh thư vượt sóng 5.jpg",
    ]);
  });
});
