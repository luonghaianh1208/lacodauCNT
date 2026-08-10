"use client";

import { useCallback, useRef, useState } from "react";

import { SlideCanvas } from "@/components/SlideCanvas";
import {
  reducePresentationState,
  type PresentationState,
  type VideoCommand,
} from "@/lib/presentation";
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
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const applyState = useCallback((incoming: PresentationState) => {
    if (incoming.slideIndex !== 2) {
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

  usePresentationChannel({
    role: "present",
    currentState: view,
    onState: applyState,
    onCommand: applyCommand,
  });

  const prepareProjector = () => {
    setReady(true);
    const request = document.documentElement.requestFullscreen?.();
    request?.catch(() => undefined);
  };

  return (
    <main className="presentation-page">
      <div
        className={`projector-stage projector-stage--${view.direction}`}
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
