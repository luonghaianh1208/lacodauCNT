"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { SlideCanvas } from "@/components/SlideCanvas";
import { SlidePickerGrid } from "@/components/SlidePickerGrid";
import { phrasesToText } from "@/lib/phrases";
import { MOTION_STORAGE_KEY, readMotionMode, type MotionMode } from "@/lib/motion";
import { type PresentationState, type VideoCommand } from "@/lib/presentation";
import { clampIndex, slideAt, slideHasVideo, SLIDES, type Slide } from "@/lib/slides";
import { useImagePreload } from "@/lib/useImagePreload";
import { usePresentationChannel } from "@/lib/usePresentationChannel";

const MOTION_LABELS: Record<MotionMode, string> = {
  force: "CHUYỂN ĐỘNG: BẬT",
  auto: "CHUYỂN ĐỘNG: THEO MÁY",
  off: "CHUYỂN ĐỘNG: TẮT",
};

/**
 * Ghi chú thuyết trình: ưu tiên `note`; nếu thiếu, rơi về `lead` — mọi khuôn có
 * trường này (content/kpi/model/outro), không riêng khuôn nội dung. 9/10 slide
 * mô hình trong data.ts không có `note` nên nếu chỉ rơi về `lead` cho khuôn
 * "content" thì ba slide đó mất trắng ghi chú dù `lead` sẵn nội dung hữu ích.
 * Không có cả hai mới hiện dấu gạch ngang.
 */
// Trang chờ (standby, số 0) đứng ngoài 44 trang đánh số của báo cáo, nên tổng số ở đây KHÔNG
// đếm nó — tránh đếm bằng SLIDES.length (45) khiến người bấm máy hiểu nhầm báo cáo có 45 trang.
const REPORT_SLIDE_COUNT = SLIDES.filter((s) => s.kind !== "standby").length;

/** Nhãn ngắn cho một slide: "TRANG 0" cho trang chờ, "SLIDE n" cho các trang còn lại. */
function slideBadge(slide: Slide): string {
  return slide.kind === "standby" ? "TRANG 0" : `SLIDE ${slide.number}`;
}

function presenterNote(slide: Slide): string {
  if (slide.note) {
    return phrasesToText(slide.note);
  }
  if (
    (slide.kind === "content" ||
      slide.kind === "kpi" ||
      slide.kind === "model" ||
      slide.kind === "outro") &&
    slide.lead
  ) {
    return phrasesToText(slide.lead);
  }
  return "—";
}

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
  const [motion, setMotion] = useState<MotionMode>("force");
  const [pickerOpen, setPickerOpen] = useState(false);
  const sequenceRef = useRef(0);
  // Chỉ để HIỆN tiến độ nạp trước ảnh cho người bấm máy biết — KHÔNG chặn thao tác nào ở
  // màn này, khác với lớp che bên màn trình chiếu (PresentationScreen).
  const preload = useImagePreload();
  const { projectorConnected, postState, postCommand, postMotion } = usePresentationChannel({
    role: "control",
    currentState: state,
  });

  const navigate = useCallback(
    (target: number) => {
      const nextIndex = clampIndex(target);
      if (nextIndex === state.slideIndex) {
        return;
      }

      const next = { slideIndex: nextIndex, sequence: ++sequenceRef.current };
      setState(next);
      postState(next);
    },
    [postState, state.slideIndex],
  );

  const pickSlide = useCallback(
    (target: number) => {
      // Nối thẳng vào `navigate` đã có sẵn — chuyển cảnh khi nhảy từ lưới phải giống hệt
      // khi bấm Tiếp/Lùi, không viết cơ chế đồng bộ riêng.
      navigate(target);
      setPickerOpen(false);
    },
    [navigate],
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
    // Đọc localStorage (chỉ có ở client) sau khi mount để tránh lệch giữa
    // HTML render sẵn trên server và lần render đầu ở client (hydration).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMotion(readMotionMode());
  }, []);

  const cycleMotion = () => {
    const order: MotionMode[] = ["force", "auto", "off"];
    const next = order[(order.indexOf(motion) + 1) % order.length];
    setMotion(next);
    window.localStorage.setItem(MOTION_STORAGE_KEY, next);
    postMotion(next);
  };

  const slide = slideAt(state.slideIndex);
  const videoEnabled = slideHasVideo(slide);

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
      if (event.key === " " && videoEnabled) {
        event.preventDefault();
        sendVideoCommand("play");
      }
      if (event.key === "Escape" && pickerOpen) {
        event.preventDefault();
        setPickerOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate, pickerOpen, sendVideoCommand, state.slideIndex, videoEnabled]);

  const nextIndex = state.slideIndex + 1;
  const nextSlide = SLIDES[nextIndex];

  return (
    <main className="control-deck">
      <header className="control-header">
        <div className="presenter-brand">
          <span className="presenter-mark" aria-hidden="true" />
          <div>
            <strong>PRESENTER</strong>
            <span>Báo cáo Lá cờ đầu · 44 slide</span>
          </div>
        </div>
        <div className="control-progress">
          {slide.kind === "standby" ? "TRANG 0" : `SLIDE ${slide.number} / ${REPORT_SLIDE_COUNT}`}
        </div>
        <div className="control-status">
          {!preload.done ? (
            <span className="control-preload" aria-live="polite">
              Đang tải {preload.loaded}/{preload.total} ảnh
            </span>
          ) : null}
          <time>{clock}</time>
          <span className={projectorConnected ? "status-dot status-dot--live" : "status-dot"} />
          <span>{projectorConnected ? "ĐÃ KẾT NỐI" : "ĐANG CHỜ MÀN CHIẾU"}</span>
          <button
            className="open-projector"
            type="button"
            aria-label="Chế độ chuyển động"
            onClick={cycleMotion}
          >
            {MOTION_LABELS[motion]}
          </button>
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
            <span>{slideBadge(slide)}</span>
          </div>
          <div className="preview-stage preview-stage--current">
            <SlideCanvas index={state.slideIndex} mode="preview" />
          </div>
        </section>

        <section className="next-panel" aria-label="Slide tiếp theo">
          <div className="panel-label">
            <span>TIẾP THEO</span>
            <span>{nextSlide ? slideBadge(nextSlide) : "KẾT THÚC"}</span>
          </div>
          <div className="preview-stage preview-stage--next">
            {nextSlide ? (
              <SlideCanvas index={nextIndex} mode="preview" />
            ) : (
              <div className="end-card">
                <strong>HOÀN THÀNH DEMO</strong>
                <span>{SLIDES.length} slide báo cáo</span>
              </div>
            )}
          </div>
        </section>

        <section className="speaker-notes" aria-label="Ghi chú thuyết trình">
          <div className="notes-icon" aria-hidden="true">✎</div>
          <div>
            <h2>GHI CHÚ THUYẾT TRÌNH</h2>
            <p>{presenterNote(slide)}</p>
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
        <button
          className="control-button control-button--secondary"
          type="button"
          aria-label="Chọn slide"
          onClick={() => setPickerOpen(true)}
        >
          <span aria-hidden="true">▦</span> CHỌN SLIDE
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

      <SlidePickerGrid
        open={pickerOpen}
        currentIndex={state.slideIndex}
        onSelect={pickSlide}
        onClose={() => setPickerOpen(false)}
      />
    </main>
  );
}
