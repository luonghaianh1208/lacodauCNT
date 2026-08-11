import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { KpiSlideView, splitLeadingNumber } from "@/components/slides/KpiSlideView";
import type { KpiSlide } from "@/lib/slides/types";

const kpi: KpiSlide = {
  kind: "kpi",
  number: 31,
  density: "thoang",
  title: ["6. Kết quả thực hiện", "chỉ tiêu năm học"],
  lead: ["Đoàn trường hoàn thành", "15/15 nhóm chỉ tiêu."],
  headline: "15/15",
  headlineLabel: ["NHÓM CHỈ TIÊU HOÀN THÀNH"],
  metrics: [{ value: "05 · 11", label: ["05 công trình."], tone: "blue" }],
};

describe("splitLeadingNumber", () => {
  it("tách phần số đứng đầu và giữ nguyên phần đuôi", () => {
    expect(splitLeadingNumber("15/15")).toEqual({ target: 15, rest: "/15" });
    expect(splitLeadingNumber("100%")).toEqual({ target: 100, rest: "%" });
    expect(splitLeadingNumber("37")).toEqual({ target: 37, rest: "" });
  });

  it("chuỗi không mở đầu bằng chữ số thì không đếm", () => {
    expect(splitLeadingNumber("Trên 1.000")).toBeNull();
    expect(splitLeadingNumber("—")).toBeNull();
  });
});

describe("con số chủ đạo đếm tăng (spec §5.4)", () => {
  it("animate=false hiện thẳng giá trị cuối, không đếm", () => {
    render(<KpiSlideView slide={kpi} />);
    expect(screen.getByText("15/15")).toBeInTheDocument();
  });

  it("animate=true bắt đầu từ 0 rồi chạy tới giá trị cuối", async () => {
    const { container } = render(<KpiSlideView slide={kpi} animate />);
    const value = container.querySelector(".figures-hero-value") as HTMLElement;

    // Ngay sau khi gắn: mới đặt về mốc 0, chưa chạy khung hình nào.
    expect(value.textContent).toBe("0/15");

    // 900ms đếm cộng 340ms chờ đồng bộ với cú trồi lên, nên nới hạn chờ mặc định của
    // `waitFor` (1000ms). Đây là đồng hồ thật: `requestAnimationFrame` của jsdom chạy theo
    // bộ đếm thật, giả lập thời gian ở đây chỉ làm test giòn mà không nhanh hơn bao nhiêu.
    await waitFor(() => expect(value.textContent).toBe("15/15"), { timeout: 4000 });
  });

  it("con số không mở đầu bằng chữ số thì hiện thẳng dù animate=true", () => {
    render(<KpiSlideView slide={{ ...kpi, headline: "Trên 1.000" }} animate />);
    expect(screen.getByText("Trên 1.000")).toBeInTheDocument();
  });

  // Spec §3.1: tiêu đề VÀ con số dùng Source Serif 4. Đây là glyph lớn nhất cả bộ 44 slide
  // nên sai font là thấy ngay; `.figures-hero-value` không tự khai font, chữ serif đến từ
  // class này (mockup 03 cũng dùng `<b class="serif">15/15</b>`).
  it("con số chủ đạo mang class serif", () => {
    const { container } = render(<KpiSlideView slide={kpi} />);
    expect(container.querySelector(".figures-hero-value")?.className).toContain("serif");
  });
});
