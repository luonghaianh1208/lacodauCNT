import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ControlDeck } from "@/components/ControlDeck";
import { collectImagePaths } from "@/lib/useImagePreload";
import { SLIDES } from "@/lib/slides";

/**
 * Màn điều khiển hiện tiến độ nạp trước ảnh ở đâu đó dễ thấy, nhưng KHÔNG chặn thao tác —
 * người bấm máy vẫn cần dùng màn này ngay trong lúc chờ (khác với màn trình chiếu, nơi
 * lớp che chặn hẳn nút cho tới khi nạp xong — xem tests/present-preload-gate.test.tsx).
 */
class FakeImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  #src = "";

  static instances: FakeImage[] = [];

  constructor() {
    FakeImage.instances.push(this);
  }

  set src(value: string) {
    this.#src = value;
  }

  get src() {
    return this.#src;
  }

  decode() {
    return Promise.resolve();
  }
}

const TOTAL = collectImagePaths(SLIDES).length;

describe("ControlDeck hiện tiến độ nạp trước ảnh không chặn thao tác", () => {
  beforeEach(() => {
    FakeImage.instances.length = 0;
    vi.stubGlobal("Image", FakeImage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("hiện tiến độ khi ảnh chưa nạp xong nhưng nút Tiếp vẫn dùng được", () => {
    render(<ControlDeck />);

    expect(screen.getByText(`Đang tải 0/${TOTAL} ảnh`)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tiếp" })).toBeEnabled();
  });

  it("chuyển slide được ngay cả khi đang nạp ảnh dở", () => {
    render(<ControlDeck />);

    // Mặc định mở ở trang 0 (chờ) — bấm Tiếp hai lần mới sang slide 2 (khuôn phân mục A).
    fireEvent.click(screen.getByRole("button", { name: "Tiếp" }));
    fireEvent.click(screen.getByRole("button", { name: "Tiếp" }));

    expect(screen.getByText("SLIDE 2 / 44")).toBeInTheDocument();
  });

  it("dòng tiến độ biến mất khi mọi ảnh đã nạp xong", async () => {
    render(<ControlDeck />);

    await act(async () => {
      for (const image of FakeImage.instances) {
        image.onload?.();
      }
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.queryByText(/Đang tải/)).not.toBeInTheDocument();
  });
});
