import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ControlDeck } from "@/components/ControlDeck";
import { SLIDES } from "@/lib/slides";

/**
 * jsdom không nạp CSS nên không kiểm được hình học (kích thước ô, cuộn, content-visibility).
 * Test ở đây chỉ khoá: có dựng gì khi đóng hay không, số ô có đủ 45 (44 trang báo cáo + trang
 * 0 chờ), class đánh dấu ô hiện tại có đúng ô hay không, và bấm ô có nhảy đúng chỉ số hay không.
 */
describe("Lưới chọn slide", () => {
  it("không dựng gì khi đóng", () => {
    const { container } = render(<ControlDeck />);
    expect(container.querySelector(".slide-picker-overlay")).not.toBeInTheDocument();
  });

  it("bấm CHỌN SLIDE mở lưới với đủ 45 ô, ô slide hiện tại được đánh dấu", () => {
    const { container } = render(<ControlDeck />);
    fireEvent.click(screen.getByRole("button", { name: "Chọn slide" }));

    const cells = container.querySelectorAll(".slide-picker-cell");
    expect(cells).toHaveLength(SLIDES.length);

    const current = container.querySelectorAll(".slide-picker-cell--current");
    expect(current).toHaveLength(1);
    expect(cells[0]).toHaveClass("slide-picker-cell--current");
  });

  it("bấm vào một ô nhảy đúng tới slide đó và tự đóng lưới", () => {
    const { container } = render(<ControlDeck />);
    fireEvent.click(screen.getByRole("button", { name: "Chọn slide" }));

    const cells = container.querySelectorAll(".slide-picker-cell");
    fireEvent.click(cells[30]); // trang 0 chờ chiếm ô đầu, nên ô index 30 mới là slide số 30

    expect(screen.getByText("SLIDE 30 / 44")).toBeInTheDocument();
    expect(container.querySelector(".slide-picker-overlay")).not.toBeInTheDocument();
  });

  it("đóng lưới bằng nút đóng, bằng bấm nền tối, và bằng phím Escape", () => {
    const { container } = render(<ControlDeck />);

    fireEvent.click(screen.getByRole("button", { name: "Chọn slide" }));
    fireEvent.click(screen.getByRole("button", { name: "Đóng lưới chọn slide" }));
    expect(container.querySelector(".slide-picker-overlay")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Chọn slide" }));
    fireEvent.click(container.querySelector(".slide-picker-overlay") as Element);
    expect(container.querySelector(".slide-picker-overlay")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Chọn slide" }));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(container.querySelector(".slide-picker-overlay")).not.toBeInTheDocument();
  });

  it("bấm vào ô (panel) không đóng lưới qua đường bấm nền — chỉ đóng vì đã chọn slide", () => {
    const { container } = render(<ControlDeck />);
    fireEvent.click(screen.getByRole("button", { name: "Chọn slide" }));

    // Bấm vào tiêu đề trong panel (không phải ô slide, không phải nút đóng) không được đóng
    // lưới — panel phải chặn nổi bọt sự kiện click lên overlay nền.
    fireEvent.click(screen.getByRole("heading", { name: "CHỌN SLIDE" }));
    expect(container.querySelector(".slide-picker-overlay")).toBeInTheDocument();
  });

  it("phím mũi tên vẫn chuyển slide khi lưới đang mở, và ô đánh dấu di chuyển theo", () => {
    const { container } = render(<ControlDeck />);
    fireEvent.click(screen.getByRole("button", { name: "Chọn slide" }));

    fireEvent.keyDown(window, { key: "ArrowRight" });

    // Lưới không bị đóng bởi phím mũi tên.
    expect(container.querySelector(".slide-picker-overlay")).toBeInTheDocument();
    const cells = container.querySelectorAll(".slide-picker-cell");
    expect(cells[1]).toHaveClass("slide-picker-cell--current");
    expect(cells[0]).not.toHaveClass("slide-picker-cell--current");
  });
});
