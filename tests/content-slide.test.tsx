import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ContentSlideView } from "@/components/slides/ContentSlideView";
import type { ContentSlide, SlideImage } from "@/lib/slides/types";

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

/** Sinh N ảnh giả để dựng fixture cho từng nhánh bố trí panel. */
function makeImages(count: number): SlideImage[] {
  return Array.from({ length: count }, (_, index) => ({
    src: `/media/slides/fake-${index}.jpg`,
    alt: `Ảnh ${index}`,
    caption: [`Ảnh ${index}`] as const,
    role: "phu" as const,
  }));
}

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

  it("0 ảnh: không render figure nào nhưng panel navy vẫn còn", () => {
    const { container } = render(
      <ContentSlideView slide={{ ...slide, images: [] }} side="right" />,
    );

    expect(container.querySelectorAll("figure")).toHaveLength(0);
    expect(container.querySelector(".content-media")).not.toBeNull();
    expect(container.querySelector(".media-solo")).toBeNull();
    expect(container.querySelector(".media-pair")).toBeNull();
    expect(container.querySelector(".media-grid")).toBeNull();
  });

  it("1 ảnh: ảnh tràn kín qua class media-solo", () => {
    const { container } = render(
      <ContentSlideView slide={{ ...slide, images: makeImages(1) }} side="right" />,
    );

    expect(container.querySelectorAll("figure")).toHaveLength(1);
    expect(container.querySelector(".media-solo")).not.toBeNull();
    expect(container.querySelector(".media-lead")).toBeNull();
    expect(container.querySelector(".media-pair")).toBeNull();
    expect(container.querySelector(".media-grid")).toBeNull();
  });

  it("2 ảnh: xếp dọc qua hai figure media-lead", () => {
    const { container } = render(
      <ContentSlideView slide={{ ...slide, images: makeImages(2) }} side="right" />,
    );

    expect(container.querySelectorAll("figure")).toHaveLength(2);
    expect(container.querySelectorAll(".media-lead")).toHaveLength(2);
    expect(container.querySelector(".media-solo")).toBeNull();
    expect(container.querySelector(".media-pair")).toBeNull();
    expect(container.querySelector(".media-grid")).toBeNull();
  });

  it("3 ảnh: 1 lớn media-lead cộng cặp media-pair", () => {
    const { container } = render(
      <ContentSlideView slide={{ ...slide, images: makeImages(3) }} side="right" />,
    );

    expect(container.querySelectorAll("figure")).toHaveLength(3);
    expect(container.querySelector(".media-lead")).not.toBeNull();
    expect(container.querySelector(".media-pair")).not.toBeNull();
    expect(container.querySelector(".media-solo")).toBeNull();
    expect(container.querySelector(".media-grid")).toBeNull();
  });

  it("4 ảnh trở lên: lưới 2 cột qua class media-grid", () => {
    const { container } = render(
      <ContentSlideView slide={{ ...slide, images: makeImages(4) }} side="right" />,
    );

    expect(container.querySelectorAll("figure")).toHaveLength(4);
    expect(container.querySelector(".media-grid")).not.toBeNull();
    expect(container.querySelector(".media-solo")).toBeNull();
    expect(container.querySelector(".media-lead")).toBeNull();
    expect(container.querySelector(".media-pair")).toBeNull();
  });

  it("5 ảnh: render đủ cả 5, không âm thầm cắt bớt", () => {
    const { container } = render(
      <ContentSlideView slide={{ ...slide, images: makeImages(5) }} side="right" />,
    );

    expect(container.querySelectorAll("figure")).toHaveLength(5);
    expect(container.querySelector(".media-grid")).not.toBeNull();
  });

  // Chặn tái diễn: số trang từng đè lên panel ảnh (side="right") hoặc lẫn màu với panel
  // (side="left") vì không đổi bên theo panel như chú thích chân trang đã làm. Giờ cả hai
  // phải luôn cùng bên, và bên đó luôn ngược với bên của panel ảnh.
  it("ảnh có focus thì ép object-position tương ứng lên thẻ img", () => {
    const { container } = render(
      <ContentSlideView
        slide={{ ...slide, images: [{ ...slide.images[0], focus: "top" }] }}
        side="right"
      />,
    );

    const img = container.querySelector("img") as HTMLImageElement;
    expect(img.style.objectPosition).toBe("center top");
  });

  it("ảnh không khai focus thì không ép style riêng, để CSS mặc định áp dụng", () => {
    const { container } = render(
      <ContentSlideView slide={{ ...slide, images: makeImages(1) }} side="right" />,
    );

    const img = container.querySelector("img") as HTMLImageElement;
    expect(img.style.objectPosition).toBe("");
  });

  it("số trang và chú thích chân trang luôn cùng bên, ngược bên với panel ảnh", () => {
    const { container: right } = render(<ContentSlideView slide={slide} side="right" />);
    expect((right.querySelector(".slide-stage") as HTMLElement).dataset.side).toBe("right");
    expect(right.querySelector(".slide-num")).toHaveAttribute("data-align", "left");
    expect(right.querySelector(".slide-foot")).toHaveAttribute("data-align", "left");

    const { container: left } = render(<ContentSlideView slide={slide} side="left" />);
    expect((left.querySelector(".slide-stage") as HTMLElement).dataset.side).toBe("left");
    expect(left.querySelector(".slide-num")).toHaveAttribute("data-align", "right");
    expect(left.querySelector(".slide-foot")).toHaveAttribute("data-align", "right");
  });

  // Ô media dẫn dắt của khuôn nội dung giờ nhận cả video (slide 9 "Phiên toà giả định") —
  // dùng lại đúng cơ chế của khuôn mô hình: thẻ <video>, poster, ref, nút phát dự phòng.
  describe("ô media là video", () => {
    const videoSlide: ContentSlide = {
      ...slide,
      images: [
        {
          kind: "video",
          src: "/media/phien-toa-gia-dinh.mp4",
          poster: "/media/slides/Phiên tòa giả định.jpg",
          alt: "Phiên tòa giả định",
          caption: ["Phiên tòa giả định về", "phòng, chống bạo lực học đường"],
          role: "chinh",
        },
        ...makeImages(3),
      ],
    };

    it("render thẻ video đúng src và poster thay vì img", () => {
      const { container } = render(<ContentSlideView slide={videoSlide} side="right" />);

      const video = container.querySelector("video") as HTMLVideoElement;
      expect(video).not.toBeNull();
      expect(video).toHaveAttribute("src", "/media/phien-toa-gia-dinh.mp4");
      expect(video).toHaveAttribute("poster", "/media/slides/Phiên tòa giả định.jpg");
      // Ba ảnh còn lại vẫn render bằng <img> bình thường (chỉ tính trong panel media,
      // không tính logo của SlideChrome cũng là <img>).
      expect(container.querySelectorAll(".content-media img")).toHaveLength(3);
    });

    it("gắn videoRef đúng vào thẻ video nằm trong khuôn nội dung", () => {
      const videoRef = createRef<HTMLVideoElement>();
      render(<ContentSlideView slide={videoSlide} side="right" videoRef={videoRef} />);

      expect(videoRef.current).not.toBeNull();
      expect(videoRef.current?.tagName).toBe("VIDEO");
    });

    it("videoBlocked=true hiện nút phát dự phòng, bấm gọi onVideoFallback", () => {
      const onVideoFallback = vi.fn();
      render(
        <ContentSlideView
          slide={videoSlide}
          side="right"
          videoBlocked
          onVideoFallback={onVideoFallback}
        />,
      );

      const fallback = screen.getByRole("button", { name: /NHẤN ĐỂ PHÁT VIDEO/ });
      fireEvent.click(fallback);
      expect(onVideoFallback).toHaveBeenCalledTimes(1);
    });

    it("videoBlocked=false (mặc định) không hiện nút phát dự phòng", () => {
      render(<ContentSlideView slide={videoSlide} side="right" />);

      expect(screen.queryByRole("button", { name: /NHẤN ĐỂ PHÁT VIDEO/ })).not.toBeInTheDocument();
    });
  });
});
