import type { Slide } from "@/lib/slides/types";

export type MotionMode = "force" | "auto" | "off";
export type TransitionKind = "slide" | "depth" | "curtain";

/**
 * Kiểu chuyển cảnh buộc vào loại slide, không trộn ngẫu nhiên: người xem sẽ đọc
 * sự ngẫu nhiên thành ý nghĩa rồi không tìm ra ý. Cú phóng sâu chỉ dùng cho ba
 * trang phân mục nên nó giữ được nghĩa "sắp sang phần mới".
 */
export function transitionKindFor(slide: Slide): TransitionKind {
  if (slide.kind === "divider") return "depth";
  if (slide.kind === "content" || slide.kind === "model") return "curtain";
  // Còn lại (bìa, số liệu, kết luận, VÀ trang chờ "standby") dùng chuyển động trung tính:
  // trang chờ đứng ngoài 38 trang đánh số, có thể chiếu lặp lại giữa các phần nghỉ, nên
  // không mang ý nghĩa "sắp sang phần mới" (depth) hay "lật trang nội dung" (curtain).
  return "slide";
}

export const MOTION_STORAGE_KEY = "cnt-motion-mode";

/**
 * Công tắc chuyển động mặc định BẬT (force) — đảo ngược thông lệ web. Đây là
 * công cụ chạy trên máy người thuyết trình: nhiều máy tắt hiệu ứng của Windows
 * để chạy nhẹ, không phải vì lý do nhạy cảm tiền đình. "auto" mới tôn trọng
 * `prefers-reduced-motion` của hệ điều hành.
 */
export function readMotionMode(): MotionMode {
  if (typeof window === "undefined") return "force";
  const saved = window.localStorage.getItem(MOTION_STORAGE_KEY);
  return saved === "auto" || saved === "off" ? saved : "force";
}
