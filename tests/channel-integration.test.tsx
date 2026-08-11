import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ControlDeck } from "@/components/ControlDeck";
import { PresentationScreen } from "@/components/PresentationScreen";
import { SLIDES, type Slide } from "@/lib/slides";

const modelWithVideoIndex = SLIDES.findIndex(
  (slide: Slide) => slide.kind === "model" && Boolean(slide.videoSrc),
);

function clickNext(times: number) {
  for (let i = 0; i < times; i += 1) {
    fireEvent.click(screen.getByRole("button", { name: "Tiếp" }));
  }
}

class FakeBroadcastChannel {
  static rooms = new Map<string, Set<FakeBroadcastChannel>>();

  onmessage: ((event: MessageEvent) => void) | null = null;

  constructor(public readonly name: string) {
    const room = FakeBroadcastChannel.rooms.get(name) ?? new Set<FakeBroadcastChannel>();
    room.add(this);
    FakeBroadcastChannel.rooms.set(name, room);
  }

  postMessage(message: unknown) {
    for (const peer of FakeBroadcastChannel.rooms.get(this.name) ?? []) {
      if (peer !== this) {
        queueMicrotask(() => peer.onmessage?.({ data: message } as MessageEvent));
      }
    }
  }

  close() {
    FakeBroadcastChannel.rooms.get(this.name)?.delete(this);
  }
}

describe("two-window presentation channel", () => {
  beforeEach(() => {
    FakeBroadcastChannel.rooms.clear();
    // Chế độ chuyển động lưu ở localStorage và giờ được CẢ HAI màn đọc lúc khởi tạo, nên
    // rác từ test trước sẽ làm test sau phụ thuộc thứ tự chạy. Dọn trước mỗi test.
    window.localStorage.clear();
    vi.stubGlobal("BroadcastChannel", FakeBroadcastChannel);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("synchronizes navigation and video play from control to projector", async () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);

    const { container } = render(
      <>
        <ControlDeck />
        <PresentationScreen />
      </>,
    );
    const projector = container.querySelector(".presentation-page");
    expect(projector).not.toBeNull();

    await waitFor(() => expect(screen.getByText("ĐÃ KẾT NỐI")).toBeInTheDocument());

    clickNext(modelWithVideoIndex);
    await waitFor(() =>
      expect(
        projector?.querySelector(`[data-slide-index="${modelWithVideoIndex}"]`),
      ).not.toBeNull(),
    );

    fireEvent.click(screen.getByRole("button", { name: "Phát video" }));
    await waitFor(() => expect(play).toHaveBeenCalledTimes(1));
  });

  it("restores the current slide when a projector tab opens later", async () => {
    const control = render(<ControlDeck />);
    // Trang 0 (chờ) chèn ở đầu nên slide số 3 (khuôn nội dung, không có `note`) giờ ở index 3.
    clickNext(3);

    const projector = render(<PresentationScreen />);
    const projectorMain = projector.container.querySelector(".presentation-page");

    await waitFor(() =>
      expect(projectorMain?.querySelector('[data-slide-index="3"]')).not.toBeNull(),
    );
    // Slide số 3 (index 3) không có `note` trong data.ts — màn điều khiển phải
    // hiện `lead` thay thế, chứng tỏ hai màn đã đồng bộ đúng slide. Thu hẹp vào
    // đúng khối ghi chú vì cụm chữ này cũng lặp lại trong ô xem trước bên cạnh.
    const notesRegion = within(control.container).getByRole("region", {
      name: "Ghi chú thuyết trình",
    });
    expect(
      within(notesRegion).getByText(/Đoàn trường quản lý 37 chi đoàn/),
    ).toBeInTheDocument();
  });

  it("truyền chế độ chuyển động từ màn điều khiển sang màn trình chiếu", async () => {
    const control = render(<ControlDeck />);
    const projector = render(<PresentationScreen />);

    // `data-motion` gắn trên `.projector-stage.slide-live` (cùng node với
    // `data-transition`) — node này mang `key` theo slideIndex-sequence nên
    // REMOUNT ngay sau khi bắt tay kênh lần đầu (STATE đồng bộ từ control).
    // Không giữ tham chiếu DOM cũ qua remount — truy vấn lại mỗi lần kiểm tra.
    const readMotion = () =>
      (projector.container.querySelector(".projector-stage") as HTMLElement).dataset.motion;

    await waitFor(() => expect(readMotion()).toBe("force"));

    // Bấm một lần: force → auto
    fireEvent.click(control.getByRole("button", { name: "Chế độ chuyển động" }));

    await waitFor(() => expect(readMotion()).toBe("auto"));

    expect(window.localStorage.getItem("cnt-motion-mode")).toBe("auto");
  });

  /*
   * Chặn tái diễn: bắt tay qua kênh chỉ trả về `STATE` (slide đang mở), KHÔNG kèm chế độ
   * chuyển động. Người thuyết trình chọn TẮT ở phiên trước rồi đóng và mở lại cửa sổ
   * `/present/` thì nút màn điều khiển ghi TẮT trong khi màn chiếu chạy BẬT — phải bấm hết
   * một vòng ba trạng thái mới khớp lại. Màn trình chiếu phải tự đọc lựa chọn đã lưu.
   */
  it("màn trình chiếu mở lại tự đọc chế độ chuyển động đã lưu, không cần màn điều khiển", async () => {
    window.localStorage.setItem("cnt-motion-mode", "off");

    const projector = render(<PresentationScreen />);
    const readMotion = () =>
      (projector.container.querySelector(".projector-stage") as HTMLElement).dataset.motion;

    await waitFor(() => expect(readMotion()).toBe("off"));
  });

  it("màn trình chiếu mở lại một mình vẫn khớp với nút của màn điều khiển", async () => {
    window.localStorage.setItem("cnt-motion-mode", "auto");

    const control = render(<ControlDeck />);
    const projector = render(<PresentationScreen />);

    await waitFor(() =>
      expect(
        (projector.container.querySelector(".projector-stage") as HTMLElement).dataset.motion,
      ).toBe("auto"),
    );
    expect(
      within(control.container).getByRole("button", { name: "Chế độ chuyển động" }),
    ).toHaveTextContent("CHUYỂN ĐỘNG: THEO MÁY");
  });
});
