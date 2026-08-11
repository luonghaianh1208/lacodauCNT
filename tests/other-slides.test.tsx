import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CoverSlideView } from "@/components/slides/CoverSlideView";
import { DividerSlideView } from "@/components/slides/DividerSlideView";
import { KpiSlideView } from "@/components/slides/KpiSlideView";
import { ModelSlideView } from "@/components/slides/ModelSlideView";
import { OutroSlideView } from "@/components/slides/OutroSlideView";
import type {
  CoverSlide,
  DividerSlide,
  KpiSlide,
  ModelSlide,
  OutroSlide,
} from "@/lib/slides/types";

const cover: CoverSlide = {
  kind: "cover", number: 1, density: "vua",
  eyebrow: ["BCH ĐOÀN TRƯỜNG", "THPT CHUYÊN NGUYỄN TRÃI"],
  title: ["BÁO CÁO KẾT QUẢ", "ĐƠN VỊ ĐĂNG KÝ", "LÁ CỜ ĐẦU"],
  subtitle: ["trong công tác Đoàn"],
  units: [["ĐOÀN PHƯỜNG LÊ THANH NGHỊ"]],
  date: ["P. Lê Thanh Nghị,", "ngày 12 tháng 8 năm 2026"],
  footer: ["HẢI PHÒNG · 2026"],
  images: [
    { src: "/media/slides/a.jpg", alt: "Nền", caption: ["Nền"], role: "nen" },
    { src: "/media/slides/b.jpg", alt: "Phụ 1", caption: ["Phụ 1"], role: "phu" },
    { src: "/media/slides/c.jpg", alt: "Phụ 2", caption: ["Phụ 2"], role: "phu" },
    { src: "/media/slides/d.jpg", alt: "Phụ 3", caption: ["Phụ 3"], role: "phu" },
  ],
};

const divider: DividerSlide = {
  kind: "divider", number: 5, density: "vua", part: "B",
  title: ["THÀNH TÍCH ĐẠT ĐƯỢC", "TRONG NĂM HỌC 2025–2026"],
  toc: [["Công tác giáo dục"], ["Hội nhập quốc tế"]],
  background: { src: "/media/slides/e.jpg", alt: "Nền", caption: ["Nền"], role: "nen" },
};

const kpi: KpiSlide = {
  kind: "kpi", number: 31, density: "thoang",
  title: ["6. Kết quả thực hiện", "chỉ tiêu năm học"],
  lead: ["Đoàn trường hoàn thành", "15/15 nhóm chỉ tiêu."],
  headline: "15/15",
  headlineLabel: ["NHÓM CHỈ TIÊU HOÀN THÀNH"],
  metrics: [
    { value: "05 · 11", label: ["05 công trình."], tone: "blue" },
    { value: "80 · 27", label: ["27 kết nạp Đảng."], tone: "red" },
  ],
};

const model: ModelSlide = {
  kind: "model", number: 34, density: "vua",
  title: ["1. Mô hình 1 – Nền tảng số"],
  url: "https://doantruong.chuyennguyentrai.edu.vn",
  lead: ["Nền tảng tích hợp", "06 nhóm chức năng."],
  functions: [["Quản lý nền nếp."], ["Khen thưởng."]],
  effects: [["Dữ liệu tập trung."]],
  images: [{ src: "/media/slides/f.png", alt: "Giao diện", caption: ["Giao diện"], role: "phu" }],
  videoSrc: "/media/platform-demo.mp4",
  footnote: ["Phần C.7 – Mô hình 1."],
};

const outro: OutroSlide = {
  kind: "outro", number: 44, density: "vua",
  kicker: ["KẾT LUẬN"],
  title: ["Tuổi trẻ Chuyên Nguyễn Trãi"],
  slogan: [["Bản lĩnh"], ["Trí tuệ"], ["Sáng tạo"], ["Cống hiến"]],
  lead: ["Đoàn trường hoàn thành", "toàn diện nhiệm vụ."],
  stats: [{ value: "37", label: ["chi đoàn"], tone: "blue" }],
};

describe("năm khuôn còn lại", () => {
  it("bìa render tiêu đề và đủ bốn ảnh", () => {
    render(<CoverSlideView slide={cover} />);
    expect(
      screen.getByRole("heading", { name: "BÁO CÁO KẾT QUẢ ĐƠN VỊ ĐĂNG KÝ LÁ CỜ ĐẦU" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("figure")).toHaveLength(3);
    expect(screen.getByText("HẢI PHÒNG · 2026")).toBeInTheDocument();
  });

  it("trang phân mục render chữ cái phần và nhãn PHẦN", () => {
    render(<DividerSlideView slide={divider} />);
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("PHẦN")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "THÀNH TÍCH ĐẠT ĐƯỢC TRONG NĂM HỌC 2025–2026" }),
    ).toBeInTheDocument();
  });

  it("khuôn số liệu render con số chủ đạo và đúng số thẻ", () => {
    render(<KpiSlideView slide={kpi} />);
    expect(screen.getByText("15/15")).toBeInTheDocument();
    expect(screen.getAllByTestId("kpi-metric")).toHaveLength(2);
  });

  it("khuôn mô hình render URL, danh sách và thẻ video", () => {
    render(<ModelSlideView slide={model} />);
    expect(screen.getByText("https://doantruong.chuyennguyentrai.edu.vn")).toBeInTheDocument();
    expect(screen.getAllByTestId("model-function")).toHaveLength(2);
    expect(screen.getByTestId("model-video")).toHaveAttribute("src", "/media/platform-demo.mp4");
  });

  it("khuôn kết luận render thông điệp và dải chỉ số", () => {
    render(<OutroSlideView slide={outro} />);
    expect(screen.getByRole("heading", { name: "Tuổi trẻ Chuyên Nguyễn Trãi" })).toBeInTheDocument();
    expect(screen.getAllByTestId("outro-stat")).toHaveLength(1);
  });

  // Chặn tái diễn: khuôn mô hình cũng dùng panel navy đổi bên như khuôn nội dung, nên
  // gánh chung lỗi số trang không đổi bên theo panel (SlideChrome). Số trang và chú thích
  // chân trang phải luôn cùng bên, ngược bên với panel ảnh.
  it("khuôn mô hình: số trang và chú thích chân trang luôn cùng bên, ngược bên với panel ảnh", () => {
    const { container: right } = render(<ModelSlideView slide={model} side="right" />);
    expect((right.querySelector(".slide-stage") as HTMLElement).dataset.side).toBe("right");
    expect(right.querySelector(".slide-num")).toHaveAttribute("data-align", "left");
    expect(right.querySelector(".slide-foot")).toHaveAttribute("data-align", "left");

    const { container: left } = render(<ModelSlideView slide={model} side="left" />);
    expect((left.querySelector(".slide-stage") as HTMLElement).dataset.side).toBe("left");
    expect(left.querySelector(".slide-num")).toHaveAttribute("data-align", "right");
    expect(left.querySelector(".slide-foot")).toHaveAttribute("data-align", "right");
  });
});
