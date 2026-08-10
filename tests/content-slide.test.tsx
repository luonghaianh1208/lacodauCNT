import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContentSlideView } from "@/components/slides/ContentSlideView";
import type { ContentSlide } from "@/lib/slides/types";

const slide: ContentSlide = {
  kind: "content",
  number: 8,
  density: "thoang",
  title: ["1.3. Giáo dục truyền thống", "cách mạng, lòng yêu nước"],
  lead: ["Đoàn trường tổ chức", "nhiều hoạt động lịch sử."],
  bullets: [
    ["Cuộc thi kiến thức", "\"Dưới Ánh Sao Vàng\"."],
    ["Phim ngắn", "\"Mùa gió ngược\"."],
  ],
  images: [
    { src: "/media/slides/s8_img3.jpg", alt: "Triển lãm tranh", caption: ["Triển lãm tranh"], role: "chinh" },
    { src: "/media/slides/s8_img4.jpg", alt: "Giao lưu", caption: ["Giao lưu"], role: "phu" },
    { src: "/media/slides/s8_img5.jpg", alt: "Dâng hương", caption: ["Dâng hương"], role: "phu" },
  ],
  footnote: ["Phần B.I – Mục 1.3."],
};

describe("ContentSlideView", () => {
  it("render tiêu đề, dòng khái quát, đủ gạch đầu dòng và đủ ảnh", () => {
    render(<ContentSlideView slide={slide} side="right" />);

    expect(
      screen.getByRole("heading", {
        name: "1.3. Giáo dục truyền thống cách mạng, lòng yêu nước",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Đoàn trường tổ chức/)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getAllByRole("figure")).toHaveLength(3);
  });

  it("gắn thuộc tính bên panel và mật độ lên khung slide", () => {
    const { container } = render(<ContentSlideView slide={slide} side="left" />);
    const stage = container.querySelector(".slide-stage") as HTMLElement;

    expect(stage.dataset.side).toBe("left");
    expect(stage.dataset.density).toBe("thoang");
    expect(stage.dataset.onDark).toBe("true");
  });

  it("thêm dấu (tiếp) và bỏ dòng khái quát ở trang thứ hai", () => {
    render(<ContentSlideView slide={{ ...slide, continued: true }} side="right" />);

    expect(screen.getByRole("heading", { name: /\(tiếp\)$/ })).toBeInTheDocument();
    expect(screen.queryByText(/Đoàn trường tổ chức/)).not.toBeInTheDocument();
  });
});
