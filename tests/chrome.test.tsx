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
});
