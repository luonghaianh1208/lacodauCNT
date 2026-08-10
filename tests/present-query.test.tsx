import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { PresentationScreen } from "@/components/PresentationScreen";
import { SLIDES } from "@/lib/slides";

/**
 * `?slide=` và `?capture=1` là hai tham số của màn trình chiếu, dùng cho script chụp ảnh
 * kiểm tra thị giác (`scripts/render-check.mjs`) và cho việc mở thẳng một trang giữa bộ.
 *
 * jsdom KHÔNG nạp `app/globals.css` nên bộ test này chỉ kiểm được LOGIC (mở đúng trang
 * nào, có bỏ lớp che không), không kiểm được bố cục. Phần bố cục do bước chụp ảnh headless
 * đảm nhiệm — xem docs/superpowers/references/render-check/NOTES.md.
 */
const REAL_SEARCH = window.location.search;

function openWith(search: string) {
  window.history.replaceState(null, "", search === "" ? "/present/" : `/present/${search}`);
  return render(<PresentationScreen />);
}

afterEach(() => {
  window.history.replaceState(null, "", `/present/${REAL_SEARCH}`);
});

function shownSlideIndex(container: HTMLElement): string | undefined {
  return container.querySelector<HTMLElement>("[data-slide-index]")?.dataset.slideIndex;
}

describe("tham số ?slide= của màn trình chiếu", () => {
  it("không có tham số thì mở trang đầu", async () => {
    const { container } = openWith("");
    await waitFor(() => expect(shownSlideIndex(container)).toBe("0"));
  });

  it("mở thẳng đúng trang được yêu cầu", async () => {
    const { container } = openWith("?slide=7");
    await waitFor(() => expect(shownSlideIndex(container)).toBe("7"));
  });

  it("kẹp về trang cuối khi vượt quá số trang", async () => {
    const { container } = openWith("?slide=999");
    await waitFor(() => expect(shownSlideIndex(container)).toBe(String(SLIDES.length - 1)));
  });

  it("kẹp về trang đầu khi âm", async () => {
    const { container } = openWith("?slide=-5");
    await waitFor(() => expect(shownSlideIndex(container)).toBe("0"));
  });

  it("bỏ qua giá trị không phải số, không vỡ", async () => {
    const { container } = openWith("?slide=abc");
    await waitFor(() => expect(shownSlideIndex(container)).toBe("0"));
  });
});

describe("tham số ?capture=1", () => {
  it("chỉ có ?slide= thì VẪN giữ lớp che, vì lớp che là chỗ mở khoá quyền phát tiếng", async () => {
    const { container } = openWith("?slide=12");
    await waitFor(() => expect(shownSlideIndex(container)).toBe("12"));
    expect(screen.getByRole("button", { name: "Sẵn sàng trình chiếu" })).toBeInTheDocument();
  });

  it("có ?capture=1 thì bỏ lớp che và tắt chuyển động", async () => {
    const { container } = openWith("?slide=12&capture=1");
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "Sẵn sàng trình chiếu" })).toBeNull(),
    );
    expect(shownSlideIndex(container)).toBe("12");
    expect(container.querySelector<HTMLElement>("[data-motion]")?.dataset.motion).toBe("off");
  });
});
