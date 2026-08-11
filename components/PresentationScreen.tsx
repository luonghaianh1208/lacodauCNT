"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

import { SlideCanvas } from "@/components/SlideCanvas";
import { readMotionMode, transitionKindFor, type MotionMode } from "@/lib/motion";
import {
  reducePresentationState,
  type PresentationState,
  type VideoCommand,
} from "@/lib/presentation";
import { SlideRenderProvider } from "@/lib/slide-render-context";
import { clampIndex, slideAt } from "@/lib/slides";
import { useImagePreload } from "@/lib/useImagePreload";
import { usePresentationChannel } from "@/lib/usePresentationChannel";

type ProjectorState = PresentationState & {
  direction: "forward" | "backward";
};

export function PresentationScreen() {
  const [view, setView] = useState<ProjectorState>({
    slideIndex: 0,
    sequence: -1,
    direction: "forward",
  });
  const [ready, setReady] = useState(false);
  const [videoBlocked, setVideoBlocked] = useState(false);
  const [motion, setMotion] = useState<MotionMode>("force");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Nạp trước toàn bộ ảnh của bộ slide trước khi cho phép người thuyết trình bấm nút: một
  // ô ảnh trắng hiện ra giữa lúc đang nói trước hội đồng là không chấp nhận được. `?capture=1`
  // bên dưới đi tắt qua `ready` nên không chờ tiến độ này — giữ đúng hành vi cho
  // `scripts/render-check.mjs`.
  const preload = useImagePreload();

  const applyState = useCallback((incoming: PresentationState) => {
    // Chỉ slide mô hình có video mới cần khoá "video bị chặn"; dựa vào slide
    // SẮP hiện ra (incoming), không phải chỉ số cố định như bản demo 3 slide cũ.
    const incomingSlide = slideAt(incoming.slideIndex);
    const incomingHasVideo = incomingSlide.kind === "model" && Boolean(incomingSlide.videoSrc);
    if (!incomingHasVideo) {
      setVideoBlocked(false);
    }
    setView((current) => {
      const next = reducePresentationState(current, {
        type: "sync",
        ...incoming,
      });
      if (next === current) {
        return current;
      }
      return {
        ...next,
        direction: next.slideIndex >= current.slideIndex ? "forward" : "backward",
      };
    });
  }, []);

  const playVideo = useCallback(async (restart = false) => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    if (restart) {
      video.currentTime = 0;
    }
    try {
      await video.play();
      setVideoBlocked(false);
    } catch {
      setVideoBlocked(true);
    }
  }, []);

  const applyCommand = useCallback(
    (command: VideoCommand) => {
      if (command === "pause") {
        videoRef.current?.pause();
        return;
      }
      void playVideo(command === "restart");
    },
    [playVideo],
  );

  const applyMotion = useCallback((mode: MotionMode) => {
    setMotion(mode);
  }, []);

  /**
   * Đọc lựa chọn chuyển động đã lưu, mở thẳng một slide qua `?slide=N` (0-based) và, khi có
   * thêm `?capture=1`, bỏ lớp che "SẴN SÀNG TRÌNH CHIẾU" rồi tắt chuyển động để chụp ảnh
   * kiểm tra thị giác.
   *
   * Màn trình chiếu PHẢI tự đọc `localStorage`, không chờ màn điều khiển gửi sang: cái bắt
   * tay qua kênh chỉ trả về `STATE` (slide đang mở), không kèm chế độ chuyển động. Đóng rồi
   * mở lại cửa sổ `/present/` sau khi đã chọn TẮT thì nút trên màn điều khiển vẫn ghi TẮT
   * trong khi màn chiếu chạy BẬT, phải bấm hết một vòng ba trạng thái mới khớp lại. Hai màn
   * cùng origin nên đọc thẳng chỗ màn điều khiển đã ghi là cách gọn nhất.
   *
   * Hai tham số TÁCH RỜI nhau có chủ đích: lớp che tồn tại để một cú nhấn của người dùng
   * mở khoá quyền phát video kèm tiếng, nên không được tự bỏ chỉ vì có `?slide=` — người
   * thuyết trình vẫn có thể mở thẳng một trang giữa bộ mà giữ nguyên quyền phát tiếng.
   * Chỉ `capture=1` (dùng cho `scripts/render-check.mjs`) mới bỏ lớp che.
   *
   * Dự án xuất tĩnh (`output: "export"`) nên không có `searchParams` phía server; phải đọc
   * `location.search` SAU khi mount, đúng cách `ControlDeck` đọc localStorage: đọc ngay
   * trong lần render đầu sẽ lệch với HTML đã render sẵn lúc build (hydration).
   */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMotion(readMotionMode());

    const params = new URLSearchParams(window.location.search);
    const raw = params.get("slide");
    if (raw !== null) {
      const parsed = Number.parseInt(raw, 10);
      if (Number.isFinite(parsed)) {
        // Kẹp về biên: `?slide=-5` ra trang đầu, `?slide=999` ra trang cuối.
        setView({ slideIndex: clampIndex(parsed), sequence: -1, direction: "forward" });
      }
    }
    if (params.get("capture") === "1") {
      // Chỉ dùng cho `scripts/render-check.mjs`: bỏ lớp che và tắt chuyển động để ảnh
      // chụp ra đúng trạng thái nghỉ của slide.
      setReady(true);
      setMotion("off");
    }
  }, []);

  usePresentationChannel({
    role: "present",
    currentState: view,
    onState: applyState,
    onCommand: applyCommand,
    onMotion: applyMotion,
  });

  const prepareProjector = () => {
    setReady(true);
    const request = document.documentElement.requestFullscreen?.();
    request?.catch(() => undefined);
  };

  const slide = slideAt(view.slideIndex);

  return (
    <SlideRenderProvider eager>
      <main className="presentation-page">
        <div
          className="projector-stage slide-live"
          data-motion={motion}
          data-transition={transitionKindFor(slide)}
          style={{ "--dir": view.direction === "forward" ? "4cqw" : "-4cqw" } as CSSProperties}
          key={`${view.slideIndex}-${view.sequence}`}
        >
          <SlideCanvas
            index={view.slideIndex}
            mode="full"
            motion={motion}
            videoRef={videoRef}
            videoBlocked={videoBlocked}
            onVideoFallback={() => void playVideo(false)}
          />
        </div>
        {!ready ? (
          <div className="ready-gate">
            <div className="ready-card">
              <span className="ready-kicker">MÀN HÌNH TRÌNH CHIẾU</span>
              <h1>Sẵn sàng cho chế độ toàn màn hình</h1>
              <p>
                Nhấn một lần để trình duyệt cho phép phát video có âm thanh. Sau đó thao tác
                chuyển slide ở màn hình điều khiển.
              </p>
              {!preload.done ? (
                <p className="ready-progress" aria-live="polite">
                  Đang tải {preload.loaded}/{preload.total} ảnh
                </p>
              ) : null}
              <button
                type="button"
                aria-label="Sẵn sàng trình chiếu"
                onClick={prepareProjector}
                disabled={!preload.done}
              >
                SẴN SÀNG TRÌNH CHIẾU
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </SlideRenderProvider>
  );
}
