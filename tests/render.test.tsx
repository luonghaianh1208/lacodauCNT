import { createRef } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SlideCanvas } from "@/components/SlideCanvas";
import { ControlDeck } from "@/components/ControlDeck";
import { PresentationScreen } from "@/components/PresentationScreen";
import { SLIDES, type Slide } from "@/lib/slides";

const kpiIndex = SLIDES.findIndex((slide) => slide.kind === "kpi");
const modelWithVideoIndex = SLIDES.findIndex(
  (slide: Slide) => slide.kind === "model" && Boolean(slide.videoSrc),
);
const modelWithoutNoteIndex = SLIDES.findIndex(
  (slide: Slide) => slide.kind === "model" && !slide.note,
);

describe("SlideCanvas", () => {
  it("renders the approved cover copy, logos, and three gallery captions", () => {
    render(<SlideCanvas index={0} mode="full" />);

    expect(
      screen.getByRole("heading", {
        name: "BÁO CÁO KẾT QUẢ ĐƠN VỊ ĐĂNG KÝ LÁ CỜ ĐẦU",
      }),
    ).toBeInTheDocument();
    expect(screen.getByAltText("Logo Trường THPT Chuyên Nguyễn Trãi")).toBeInTheDocument();
    expect(screen.getByAltText("Logo Đoàn TNCS Hồ Chí Minh")).toBeInTheDocument();
    // Bìa có 4 ảnh trong data.ts nhưng 1 ảnh vai trò "nen" làm hero nền, không
    // có <figure> riêng — chỉ 3 ảnh "phu" còn lại lên băng ảnh dưới cùng.
    expect(screen.getAllByRole("figure")).toHaveLength(3);
  });

  it("renders the 15/15 KPI and six approved metrics", () => {
    // `motion="off"` để chốt GIÁ TRỊ NGHỈ của con số chủ đạo: ở chế độ có chuyển động, nó
    // đếm tăng từ 0 trong 900ms (spec §5.4) nên ngay sau khi gắn nó còn là "0/15". Nhịp đếm
    // có bộ test riêng ở `tests/kpi-count.test.tsx`; test này chỉ soi nội dung slide.
    render(<SlideCanvas index={kpiIndex} mode="full" motion="off" />);

    expect(screen.getByText("15/15")).toBeInTheDocument();
    expect(screen.getByText("Trên 1.000")).toBeInTheDocument();
    expect(screen.getByText("80 · 27")).toBeInTheDocument();
    expect(screen.getAllByTestId("kpi-metric")).toHaveLength(6);
  });

  it("renders the model slide's URL, functions, images, and embedded clip", () => {
    const videoRef = createRef<HTMLVideoElement>();
    render(<SlideCanvas index={modelWithVideoIndex} mode="full" videoRef={videoRef} />);

    expect(
      screen.getByText("https://doantruong.chuyennguyentrai.edu.vn"),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("model-function")).toHaveLength(6);
    expect(screen.getByAltText("Giao diện quản lý đoàn viên")).toBeInTheDocument();
    expect(screen.getByTestId("model-video")).toHaveAttribute(
      "src",
      "/media/platform-demo.mp4",
    );
  });
});

describe("ControlDeck", () => {
  it("shows current and next previews, notes, progress, and large controls", () => {
    render(<ControlDeck />);

    expect(screen.getByText(`SLIDE 1 / ${SLIDES.length}`)).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Slide hiện tại" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Slide tiếp theo" })).toBeInTheDocument();
    expect(screen.getByText(/Mở đầu báo cáo/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mở màn hình trình chiếu" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Lùi" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Tiếp" })).toBeEnabled();
  });

  it("falls back to the lead paragraph when a slide has no presenter note", () => {
    render(<ControlDeck />);

    // Slide số 3 (index 2, khuôn nội dung) không có `note` trong data.ts —
    // ghi chú thuyết trình phải rơi về `lead` của slide đó.
    fireEvent.click(screen.getByRole("button", { name: "Tiếp" }));
    fireEvent.click(screen.getByRole("button", { name: "Tiếp" }));

    expect(screen.getByText(`SLIDE 3 / ${SLIDES.length}`)).toBeInTheDocument();
    const notesRegion = screen.getByRole("region", { name: "Ghi chú thuyết trình" });
    expect(within(notesRegion).getByText(/Đoàn trường quản lý 37 chi đoàn/)).toBeInTheDocument();
  });

  it("falls back to the lead paragraph on a model slide with no presenter note", () => {
    render(<ControlDeck />);

    // 3/4 slide mô hình trong data.ts không có `note` — ghi chú thuyết trình
    // phải rơi về `lead` của chính slide đó (không riêng khuôn "content"),
    // và KHÔNG được hiện dấu gạch ngang dù đây là khuôn "model".
    for (let i = 0; i < modelWithoutNoteIndex; i += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Tiếp" }));
    }

    const notesRegion = screen.getByRole("region", { name: "Ghi chú thuyết trình" });
    expect(
      within(notesRegion).getByText(/WebApp số hóa toàn bộ quy trình/),
    ).toBeInTheDocument();
    expect(within(notesRegion).queryByText("—")).not.toBeInTheDocument();
  });

  it("navigates to the model slide with video and enables video actions", () => {
    render(<ControlDeck />);

    for (let i = 0; i < modelWithVideoIndex; i += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Tiếp" }));
    }

    expect(
      screen.getByText(`SLIDE ${modelWithVideoIndex + 1} / ${SLIDES.length}`),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Phát video" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Tạm dừng" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Phát lại" })).toBeEnabled();
  });
});

describe("PresentationScreen", () => {
  it("shows a projector-ready gate without the presenter toolbar", () => {
    render(<PresentationScreen />);

    expect(
      screen.getByRole("button", { name: "Sẵn sàng trình chiếu" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("GHI CHÚ THUYẾT TRÌNH")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "BÁO CÁO KẾT QUẢ ĐƠN VỊ ĐĂNG KÝ LÁ CỜ ĐẦU",
      }),
    ).toBeInTheDocument();
  });
});
