import { describe, expect, it } from "vitest";

import type { ContentSlide } from "@/lib/slides/types";

describe("kiểu dữ liệu slide", () => {
  it("chấp nhận mảng cụm từ cho mọi trường chữ", () => {
    const slide: ContentSlide = {
      kind: "content",
      number: 8,
      density: "thoang",
      title: ["1.3. Giáo dục truyền thống", "cách mạng, lòng yêu nước"],
      lead: ["Đoàn trường tổ chức nhiều hoạt động."],
      bullets: [["Cuộc thi kiến thức", "\"Dưới Ánh Sao Vàng\"."]],
      images: [],
    };

    expect(slide.title).toHaveLength(2);
    expect(slide.bullets[0]).toHaveLength(2);
  });

  it("từ chối chuỗi thường ở trường tiêu đề", () => {
    // @ts-expect-error tiêu đề phải là mảng cụm từ, không phải chuỗi
    const sai: ContentSlide["title"] = "1.3. Giáo dục truyền thống cách mạng";
    expect(typeof sai).toBe("string");
  });
});
