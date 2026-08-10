"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { SlideCanvas } from "@/components/SlideCanvas";
import {
  SLIDES,
  clampSlideIndex,
  type PresentationState,
  type VideoCommand,
} from "@/lib/presentation";
import { usePresentationChannel } from "@/lib/usePresentationChannel";

function formatClock(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export function ControlDeck() {
  const [state, setState] = useState<PresentationState>({ slideIndex: 0, sequence: 0 });
  const [clock, setClock] = useState(() => formatClock(new Date()));
  const sequenceRef = useRef(0);
  const { projectorConnected, postState, postCommand } = usePresentationChannel({
    role: "control",
    currentState: state,
  });

  const navigate = useCallback(
    (target: number) => {
      const nextIndex = clampSlideIndex(target);
      if (nextIndex === state.slideIndex) {
        return;
      }

      const next = { slideIndex: nextIndex, sequence: ++sequenceRef.current };
      setState(next);
      postState(next);
    },
    [postState, state.slideIndex],
  );

  const sendVideoCommand = useCallback(
    (command: VideoCommand) => {
      const sequence = ++sequenceRef.current;
      setState((current) => ({ ...current, sequence }));
      postCommand(command, sequence);
    },
    [postCommand],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setClock(formatClock(new Date())), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigate(state.slideIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        navigate(state.slideIndex + 1);
      }
      if (event.key === " " && state.slideIndex === 2) {
        event.preventDefault();
        sendVideoCommand("play");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate, sendVideoCommand, state.slideIndex]);

  const slide = SLIDES[state.slideIndex];
  const nextIndex = state.slideIndex + 1;
  const nextSlide = SLIDES[nextIndex];
  const videoEnabled = state.slideIndex === 2;

  return (
    <main className="control-deck">
      <header className="control-header">
        <div className="presenter-brand">
          <span className="presenter-mark" aria-hidden="true" />
          <div>
            <strong>PRESENTER</strong>
            <span>Báo cáo Lá cờ đầu · Demo 3 slide</span>
          </div>
        </div>
        <div className="control-progress">SLIDE {state.slideIndex + 1} / 3</div>
        <div className="control-status">
          <time>{clock}</time>
          <span className={projectorConnected ? "status-dot status-dot--live" : "status-dot"} />
          <span>{projectorConnected ? "ĐÃ KẾT NỐI" : "ĐANG CHỜ MÀN CHIẾU"}</span>
          <button
            className="open-projector"
            type="button"
            aria-label="Mở màn hình trình chiếu"
            onClick={() => window.open("/present/", "cnt-projector")}
          >
            MỞ MÀN HÌNH TRÌNH CHIẾU
          </button>
        </div>
      </header>

      <div className="control-workspace">
        <section className="current-panel" aria-label="Slide hiện tại">
          <div className="panel-label">
            <span>HIỆN TẠI</span>
            <span>SLIDE {slide.sourceNumber}</span>
          </div>
          <div className="preview-stage preview-stage--current">
            <SlideCanvas index={state.slideIndex} mode="preview" />
          </div>
        </section>

        <section className="next-panel" aria-label="Slide tiếp theo">
          <div className="panel-label">
            <span>TIẾP THEO</span>
            <span>{nextSlide ? `SLIDE ${nextSlide.sourceNumber}` : "KẾT THÚC"}</span>
          </div>
          <div className="preview-stage preview-stage--next">
            {nextSlide ? (
              <SlideCanvas index={nextIndex} mode="preview" />
            ) : (
              <div className="end-card">
                <strong>HOÀN THÀNH DEMO</strong>
                <span>3 slide tiêu biểu</span>
              </div>
            )}
          </div>
        </section>

        <section className="speaker-notes" aria-label="Ghi chú thuyết trình">
          <div className="notes-icon" aria-hidden="true">✎</div>
          <div>
            <h2>GHI CHÚ THUYẾT TRÌNH</h2>
            <p>{slide.note}</p>
          </div>
        </section>
      </div>

      <footer className="control-bar">
        <button
          className="control-button control-button--secondary"
          type="button"
          aria-label="Lùi"
          disabled={state.slideIndex === 0}
          onClick={() => navigate(state.slideIndex - 1)}
        >
          <span aria-hidden="true">←</span> LÙI
        </button>
        <div className="video-control-group" aria-label="Điều khiển video">
          <button
            className="control-button control-button--primary"
            type="button"
            aria-label="Phát video"
            disabled={!videoEnabled}
            onClick={() => sendVideoCommand("play")}
          >
            <span aria-hidden="true">▶</span> PHÁT VIDEO
          </button>
          <button
            className="control-button control-button--compact"
            type="button"
            aria-label="Tạm dừng"
            disabled={!videoEnabled}
            onClick={() => sendVideoCommand("pause")}
          >
            Ⅱ TẠM DỪNG
          </button>
          <button
            className="control-button control-button--compact"
            type="button"
            aria-label="Phát lại"
            disabled={!videoEnabled}
            onClick={() => sendVideoCommand("restart")}
          >
            ↺ PHÁT LẠI
          </button>
        </div>
        <button
          className="control-button control-button--secondary"
          type="button"
          aria-label="Tiếp"
          disabled={state.slideIndex === SLIDES.length - 1}
          onClick={() => navigate(state.slideIndex + 1)}
        >
          TIẾP <span aria-hidden="true">→</span>
        </button>
      </footer>
    </main>
  );
}
