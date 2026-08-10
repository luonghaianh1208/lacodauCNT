import { SLIDES } from "@/lib/slides/data";
import type { Density, Slide } from "@/lib/slides/types";

export { SLIDES };
export type { Slide };

/** Slide có panel ảnh: khuôn nội dung và khuôn mô hình. */
function hasPanel(slide: Slide): boolean {
  return slide.kind === "content" || slide.kind === "model";
}

/**
 * Panel đổi bên theo thứ tự các slide CÓ PANEL liên tiếp, không theo số trang
 * chẵn lẻ — nếu theo số trang thì ba trang phân mục chen vào sẽ làm hai slide
 * có panel liền nhau rơi cùng một bên.
 */
export function panelSideFor(index: number): "left" | "right" {
  let count = 0;
  for (let i = 0; i < index; i += 1) {
    if (hasPanel(SLIDES[i])) count += 1;
  }
  return count % 2 === 0 ? "right" : "left";
}

export function densityForBullets(count: number): Density {
  if (count <= 5) return "thoang";
  if (count <= 7) return "vua";
  return "day";
}

export function clampIndex(index: number): number {
  return Math.min(SLIDES.length - 1, Math.max(0, index));
}

export function slideAt(index: number): Slide {
  return SLIDES[clampIndex(index)];
}
