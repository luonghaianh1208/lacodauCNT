import { describe, expect, it } from "vitest";

import { SLIDES, clampIndex, densityForBullets, panelSideFor } from "@/lib/slides";

describe("helper slide", () => {
  it("mật độ chọn theo số gạch đầu dòng đúng ngưỡng spec", () => {
    expect(densityForBullets(3)).toBe("thoang");
    expect(densityForBullets(5)).toBe("thoang");
    expect(densityForBullets(6)).toBe("vua");
    expect(densityForBullets(7)).toBe("vua");
    expect(densityForBullets(8)).toBe("day");
    expect(densityForBullets(9)).toBe("day");
  });

  it("panel xen kẽ theo thứ tự slide có panel, không theo số trang chẵn lẻ", () => {
    const withPanel = SLIDES.map((s, i) => ({ s, i })).filter(
      ({ s }) => s.kind === "content" || s.kind === "model",
    );

    const sides = withPanel.map(({ i }) => panelSideFor(i));
    expect(sides[0]).toBe("right");
    expect(sides[1]).toBe("left");
    expect(sides[2]).toBe("right");

    // Không có hai slide có panel liền nhau nào cùng bên.
    for (let k = 1; k < sides.length; k += 1) {
      expect(sides[k], `slide thứ ${k} trùng bên với slide trước`).not.toBe(sides[k - 1]);
    }
  });

  it("clampIndex giữ chỉ số trong khoảng hợp lệ", () => {
    expect(clampIndex(-5)).toBe(0);
    expect(clampIndex(999)).toBe(SLIDES.length - 1);
    expect(clampIndex(7)).toBe(7);
  });
});
