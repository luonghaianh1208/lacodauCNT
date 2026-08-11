import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SlideCanvas } from "@/components/SlideCanvas";
import { transitionKindFor } from "@/lib/motion";
import { SLIDES } from "@/lib/slides";
import type { Slide } from "@/lib/slides/types";

/** Fixture tối giản cho từng `kind` — chỉ cần đủ field để hợp lệ kiểu, không cần dữ liệu thật. */
const standby: Slide = {
  kind: "standby",
  number: 0,
  density: "vua",
  eyebrow: ["THÀNH ĐOÀN HẢI PHÒNG"],
  title: ["CHƯƠNG TRÌNH KIỂM TRA"],
  program: ["Nội dung chương trình"],
  place: ["Địa điểm, ngày tháng"],
};

const cover: Slide = {
  kind: "cover",
  number: 1,
  density: "vua",
  eyebrow: ["BCH ĐOÀN TRƯỜNG"],
  title: ["TIÊU ĐỀ BÌA"],
  subtitle: ["Phụ đề"],
  units: [["ĐƠN VỊ"]],
  date: ["Ngày"],
  footer: ["CHÂN TRANG"],
  images: [],
};

const divider: Slide = {
  kind: "divider",
  number: 5,
  density: "vua",
  part: "A",
  title: ["TIÊU ĐỀ PHÂN MỤC"],
  toc: [["Mục 1"]],
};

const content: Slide = {
  kind: "content",
  number: 8,
  density: "thoang",
  title: ["Tiêu đề nội dung"],
  bullets: [["Gạch đầu dòng"]],
  images: [],
};

const kpi: Slide = {
  kind: "kpi",
  number: 31,
  density: "thoang",
  title: ["Tiêu đề số liệu"],
  headline: "15/15",
  headlineLabel: ["NHÃN"],
  metrics: [],
};

const model: Slide = {
  kind: "model",
  number: 34,
  density: "vua",
  title: ["Tiêu đề mô hình"],
  lead: ["Tóm tắt"],
  groups: [],
  images: [],
};

const outro: Slide = {
  kind: "outro",
  number: 44,
  density: "vua",
  kicker: ["KẾT LUẬN"],
  title: ["Tiêu đề kết luận"],
  slogan: [["Khẩu hiệu"]],
  lead: ["Tóm tắt"],
  stats: [],
};

describe("SlideCanvas", () => {
  it("render được cả 45 slide mà không văng lỗi", () => {
    for (let index = 0; index < SLIDES.length; index += 1) {
      const { unmount } = render(<SlideCanvas index={index} mode="preview" />);
      unmount();
    }
    expect(SLIDES).toHaveLength(45);
  });

  it("slide đầu tiên (trang 0) là trang chờ, slide thứ hai là bìa báo cáo", () => {
    render(<SlideCanvas index={0} mode="full" />);
    expect(
      screen.getByRole("heading", { name: "CHƯƠNG TRÌNH KIỂM TRA" }),
    ).toBeInTheDocument();

    render(<SlideCanvas index={1} mode="full" />);
    expect(
      screen.getByRole("heading", { name: /BÁO CÁO KẾT QUẢ/ }),
    ).toBeInTheDocument();
  });
});

describe("transitionKindFor", () => {
  it("trang phân mục dùng chiều sâu, slide có panel dùng rèm, còn lại dùng trượt", () => {
    const kinds = SLIDES.map(transitionKindFor);
    const count = (k: string) => kinds.filter((x) => x === k).length;

    expect(count("depth")).toBe(3);
    expect(count("curtain")).toBe(37);
    expect(count("slide")).toBe(5);
  });

  // Test theo từng nhánh, tách khỏi phân bố dữ liệu thật: khoá đúng logic của hàm
  // (kind nào ra kiểu chuyển cảnh nào), không gắn vào số lượng slide mỗi loại trong
  // lib/slides/data.ts — nên không phải sửa lại mỗi khi dữ liệu đổi dù logic không đổi.
  it("phân mục → depth", () => {
    expect(transitionKindFor(divider)).toBe("depth");
  });

  it("nội dung → curtain", () => {
    expect(transitionKindFor(content)).toBe("curtain");
  });

  it("mô hình → curtain", () => {
    expect(transitionKindFor(model)).toBe("curtain");
  });

  it("bìa → slide", () => {
    expect(transitionKindFor(cover)).toBe("slide");
  });

  it("số liệu → slide", () => {
    expect(transitionKindFor(kpi)).toBe("slide");
  });

  it("kết luận → slide", () => {
    expect(transitionKindFor(outro)).toBe("slide");
  });

  it("trang chờ → slide", () => {
    expect(transitionKindFor(standby)).toBe("slide");
  });
});
