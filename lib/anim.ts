import type { CSSProperties } from "react";

/**
 * Độ trễ của một phần tử trong "dàn nhạc vào" (spec §7.1). Trả về style nội tuyến đặt biến
 * `--d` mà luật `.slide-live .anim` trong `app/globals.css` đọc — cùng cách mockup đã duyệt
 * `docs/superpowers/references/mockups/05-chuyen-dong.html` làm.
 *
 * Tách thành hàm dùng chung vì cả sáu khuôn đều cần, và vì `--d` là biến CSS tuỳ ý nên
 * `CSSProperties` không có khoá đó — phải ép kiểu, và chỉ nên ép ở đúng một chỗ.
 */
export function animDelay(ms: number): CSSProperties {
  return { "--d": `${ms}ms` } as CSSProperties;
}
