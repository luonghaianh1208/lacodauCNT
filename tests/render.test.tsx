import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SlideCanvas } from "@/components/SlideCanvas";
import { ControlDeck } from "@/components/ControlDeck";
import { PresentationScreen } from "@/components/PresentationScreen";

describe("SlideCanvas", () => {
  it("renders the approved cover copy, logos, and four captions", () => {
    render(<SlideCanvas index={0} mode="full" />);

    expect(
      screen.getByRole("heading", {
        name: "BÁO CÁO KẾT QUẢ ĐƠN VỊ ĐĂNG KÝ LÁ CỜ ĐẦU",
      }),
    ).toBeInTheDocument();
    expect(screen.getByAltText("Logo Trường THPT Chuyên Nguyễn Trãi")).toBeInTheDocument();
    expect(screen.getByAltText("Logo Đoàn TNCS Hồ Chí Minh")).toBeInTheDocument();
    expect(screen.getAllByRole("figure")).toHaveLength(4);
  });

  it("renders the 15/15 KPI and six approved metrics", () => {
    render(<SlideCanvas index={1} mode="full" />);

    expect(screen.getByText("15/15")).toBeInTheDocument();
    expect(screen.getByText("Trên 1.000")).toBeInTheDocument();
    expect(screen.getByText("80 · 27")).toBeInTheDocument();
    expect(screen.getAllByTestId("metric-card")).toHaveLength(6);
  });

  it("renders the platform URL, functions, images, and embedded clip", () => {
    const videoRef = createRef<HTMLVideoElement>();
    render(<SlideCanvas index={2} mode="full" videoRef={videoRef} />);

    expect(
      screen.getByText("https://doantruong.chuyennguyentrai.edu.vn"),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("platform-function")).toHaveLength(6);
    expect(screen.getByAltText("Giao diện quản lý đoàn viên")).toBeInTheDocument();
    expect(screen.getByTestId("platform-video")).toHaveAttribute(
      "src",
      "/media/platform-demo.mp4",
    );
  });
});

describe("ControlDeck", () => {
  it("shows current and next previews, notes, progress, and large controls", () => {
    render(<ControlDeck />);

    expect(screen.getByText("SLIDE 1 / 3")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Slide hiện tại" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Slide tiếp theo" })).toBeInTheDocument();
    expect(screen.getByText(/Mở đầu báo cáo/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mở màn hình trình chiếu" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Lùi" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Tiếp" })).toBeEnabled();
  });

  it("navigates to the KPI and platform slides and enables video actions", () => {
    render(<ControlDeck />);

    fireEvent.click(screen.getByRole("button", { name: "Tiếp" }));
    expect(screen.getByText("SLIDE 2 / 3")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Nhấn mạnh kết quả 15/15 nhóm chỉ tiêu và các chỉ tiêu vượt nổi bật.",
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Tiếp" }));
    expect(screen.getByText("SLIDE 3 / 3")).toBeInTheDocument();
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
