import type { CSSProperties } from "react";

import type { SlideImage } from "@/lib/slides/types";

const FOCUS_POSITION: Record<NonNullable<SlideImage["focus"]>, string> = {
  top: "center top",
  center: "center center",
  bottom: "center bottom",
};

/**
 * Ép vị trí cắt ảnh (CSS `object-position`) khi mặc định "lệch lên trên" (`.slide-stage img`
 * trong app/globals.css) không hợp cho ảnh này — ví dụ ảnh không có người ở nửa trên khung
 * hình. Trả về `undefined` khi ảnh không khai `focus`, để mặc định của CSS áp dụng như cũ.
 */
export function focusStyle(image: Pick<SlideImage, "focus">): CSSProperties | undefined {
  if (!image.focus) {
    return undefined;
  }
  return { objectPosition: FOCUS_POSITION[image.focus] };
}
