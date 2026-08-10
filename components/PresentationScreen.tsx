"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";

import { SlideCanvas } from "@/components/SlideCanvas";
import { transitionKindFor, type MotionMode } from "@/lib/motion";
import {
  reducePresentationState,
  type PresentationState,
  type VideoCommand,
} from "@/lib/presentation";
import { clampIndex, SLIDES, type Slide } from "@/lib/slides";
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

  const applyState = useCallback((incoming: PresentationState) => {
    // Chỉ slide mô hình có video mới cần khoá "video bị chặn"; dựa vào slide
    // SẮP hiện ra (incoming), không phải chỉ số cố định như bản demo 3 slide cũ.
    // Ép kiểu về `Slide` — lý do xem chú thích tương tự trong ControlDeck.tsx.
    const incomingSlide = SLIDES[clampIndex(incoming.slideIndex)] as Slide;
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

  const slide = SLIDES[clampIndex(view.slideIndex)];

  return (
    <main className="presentation-page" data-motion={motion}>
      <div
        className="projector-stage slide-live"
        data-transition={transitionKindFor(slide)}
        style={{ "--dir": view.direction === "forward" ? "4cqw" : "-4cqw" } as CSSProperties}
        key={`${view.slideIndex}-${view.sequence}`}
      >
        <SlideCanvas
          index={view.slideIndex}
          mode="full"
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
            <button type="button" aria-label="Sẵn sàng trình chiếu" onClick={prepareProjector}>
              SẴN SÀNG TRÌNH CHIẾU
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
