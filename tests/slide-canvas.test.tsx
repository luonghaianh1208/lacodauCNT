import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SlideCanvas } from "@/components/SlideCanvas";
import { transitionKindFor } from "@/lib/motion";
import { SLIDES } from "@/lib/slides";

describe("SlideCanvas", () => {
  it("render được cả 38 slide mà không văng lỗi", () => {
    for (let index = 0; index < SLIDES.length; index += 1) {
      const { unmount } = render(<SlideCanvas index={index} mode="preview" />);
      unmount();
    }
    expect(SLIDES).toHaveLength(38);
  });

  it("slide đầu tiên là bìa và hiện đúng tiêu đề báo cáo", () => {
    render(<SlideCanvas index={0} mode="full" />);
    expect(
      screen.getByRole("heading", { name: /BÁO CÁO KẾT QUẢ/ }),
    ).toBeInTheDocument();
  });
});

describe("transitionKindFor", () => {
  it("trang phân mục dùng chiều sâu, slide có panel dùng rèm, còn lại dùng trượt", () => {
    const kinds = SLIDES.map(transitionKindFor);
    const count = (k: string) => kinds.filter((x) => x === k).length;

    expect(count("depth")).toBe(3);
    expect(count("curtain")).toBe(31);
    expect(count("slide")).toBe(4);
  });
});
