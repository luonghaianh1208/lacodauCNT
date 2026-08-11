import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PresentationScreen } from "@/components/PresentationScreen";
import { collectImagePaths } from "@/lib/useImagePreload";
import { SLIDES } from "@/lib/slides";

/**
 * Lớp che "SẴN SÀNG TRÌNH CHIẾU" phải chặn người thuyết trình bấm nút cho tới khi mọi ảnh
 * của bộ slide đã nạp trước xong — nếu không, ô ảnh trắng có thể hiện ra giữa lúc đang nói
 * trước hội đồng. `?capture=1` (dùng cho scripts/render-check.mjs) phải KHÔNG bị ảnh hưởng
 * — bộ test riêng cho tham số đó nằm ở tests/present-query.test.tsx.
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

describe("lớp che chờ nạp trước ảnh trước khi cho phép trình chiếu", () => {
  beforeEach(() => {
    FakeImage.instances.length = 0;
    vi.stubGlobal("Image", FakeImage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("nút vô hiệu và hiện đúng tiến độ khi ảnh chưa nạp xong", () => {
    render(<PresentationScreen />);

    const button = screen.getByRole("button", { name: "Sẵn sàng trình chiếu" });
    expect(button).toBeDisabled();
    expect(screen.getByText(`Đang tải 0/${TOTAL} ảnh`)).toBeInTheDocument();
  });

  it("tiến độ tăng theo từng ảnh nạp xong, nút vẫn vô hiệu khi chưa đủ", async () => {
    render(<PresentationScreen />);
    const button = screen.getByRole("button", { name: "Sẵn sàng trình chiếu" });

    await act(async () => {
      FakeImage.instances[0].onload?.();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByText(`Đang tải 1/${TOTAL} ảnh`)).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("nút bật lại và dòng tiến độ biến mất khi mọi ảnh đã nạp xong", async () => {
    render(<PresentationScreen />);
    const button = screen.getByRole("button", { name: "Sẵn sàng trình chiếu" });

    await act(async () => {
      for (const image of FakeImage.instances) {
        image.onload?.();
      }
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(button).toBeEnabled();
    expect(screen.queryByText(/Đang tải/)).not.toBeInTheDocument();
  });

  it("ảnh lỗi vẫn tính là xong, không treo nút mãi mãi", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(<PresentationScreen />);
    const button = screen.getByRole("button", { name: "Sẵn sàng trình chiếu" });

    await act(async () => {
      for (const image of FakeImage.instances) {
        image.onerror?.();
      }
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(button).toBeEnabled();
    expect(errorSpy).toHaveBeenCalled();
  });
});
