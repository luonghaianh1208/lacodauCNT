import { describe, expect, it } from "vitest";

import { focusStyle } from "@/lib/image-focus";

describe("focusStyle", () => {
  it("không có focus thì trả về undefined, để CSS mặc định (lệch lên trên) áp dụng", () => {
    expect(focusStyle({})).toBeUndefined();
  });

  it("focus=top ép object-position lên mép trên", () => {
    expect(focusStyle({ focus: "top" })).toEqual({ objectPosition: "center top" });
  });

  it("focus=center ép object-position về giữa, ghi đè mặc định lệch lên trên", () => {
    expect(focusStyle({ focus: "center" })).toEqual({ objectPosition: "center center" });
  });

  it("focus=bottom ép object-position xuống mép dưới", () => {
    expect(focusStyle({ focus: "bottom" })).toEqual({ objectPosition: "center bottom" });
  });
});
