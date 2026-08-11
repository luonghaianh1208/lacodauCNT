import { createContext, useContext, type ReactNode } from "react";

/**
 * Cờ báo "màn đang vẽ có phải màn thật đang chiếu không" — chỉ dùng để quyết định có gắn
 * `priority` cho ảnh logo hay không (xem `SlideChrome`, `CoverSlideView`). Mặc định `false`:
 * mọi nơi dựng slide dạng xem trước (ô lưới current/next panel, lưới chọn slide) không cần
 * ảnh logo tải ngay. Chỉ `PresentationScreen` — màn hình trình chiếu thật — bọc `eager: true`,
 * vì đó là nơi cần logo hiện tức thì khi vào slide.
 *
 * Dùng context thay vì luồn prop `eager` qua sáu component khuôn (SlideCanvas →
 * Cover/Divider/Content/Kpi/Model/OutroSlideView → SlideChrome): chỉ hai nơi thật sự đọc cờ
 * này (SlideChrome, CoverSlideView), context tránh phải sửa chữ ký của bốn component ở giữa
 * không liên quan.
 */
const SlideRenderContext = createContext<{ eager: boolean }>({ eager: false });

export function SlideRenderProvider({
  eager,
  children,
}: {
  eager: boolean;
  children: ReactNode;
}) {
  return (
    <SlideRenderContext.Provider value={{ eager }}>{children}</SlideRenderContext.Provider>
  );
}

export function useSlideRenderEager(): boolean {
  return useContext(SlideRenderContext).eager;
}
