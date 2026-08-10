import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SlideChrome } from "@/components/SlideChrome";
import type { ContentSlide } from "@/lib/slides/types";

const slide: ContentSlide = {
  kind: "content",
  number: 8,
  density: "thoang",
  title: ["Tiêu đề"],
  bullets: [["Một dòng"]],
  images: [],
  footnote: ["Phần B.I – Mục 1.3."],
};

describe("SlideChrome", () => {
  it("hiện số trang, hai logo và chú thích chân trang", () => {
    render(<SlideChrome slide={slide} />);

    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByAltText("Logo Trường THPT Chuyên Nguyễn Trãi")).toBeInTheDocument();
    expect(screen.getByAltText("Logo Đoàn TNCS Hồ Chí Minh")).toBeInTheDocument();
    expect(screen.getByText("Phần B.I – Mục 1.3.")).toBeInTheDocument();
  });

  it("không render chú thích khi slide không có", () => {
    render(<SlideChrome slide={{ ...slide, footnote: undefined }} />);
    expect(screen.queryByText(/Phần B.I/)).not.toBeInTheDocument();
  });

  // Chặn tái diễn: số trang và chú thích chân trang thuộc cùng cột chữ, phải luôn cùng
  // bên — bên đối diện panel ảnh (`side`). Kiểm qua thuộc tính `data-align`, không đọc
  // style nội tuyến, để test không giòn trước cách CSS hiện thực hoá vị trí.
  it("side mặc định 'right' (panel phải): số trang và chân trang cùng nằm bên trái", () => {
    const { container } = render(<SlideChrome slide={slide} />);

    expect(container.querySelector(".slide-num")).toHaveAttribute("data-align", "left");
    expect(container.querySelector(".slide-foot")).toHaveAttribute("data-align", "left");
  });

  it("side='left' (panel trái): số trang và chân trang cùng nằm bên phải", () => {
    const { container } = render(<SlideChrome slide={slide} side="left" />);

    expect(container.querySelector(".slide-num")).toHaveAttribute("data-align", "right");
    expect(container.querySelector(".slide-foot")).toHaveAttribute("data-align", "right");
  });
});
