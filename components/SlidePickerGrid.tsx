"use client";

import { SlideCanvas } from "@/components/SlideCanvas";
import { phrasesToText } from "@/lib/phrases";
import { SLIDES, type Slide } from "@/lib/slides";

/** Mọi khuôn slide đều có `title` (xem `lib/slides/types.ts`) nên không cần rẽ nhánh theo `kind`. */
function slideShortTitle(slide: Slide): string {
  return phrasesToText(slide.title);
}

type SlidePickerGridProps = {
  open: boolean;
  currentIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
};

/**
 * Lưới chọn slide phủ toàn màn — cho người thuyết trình nhảy tới bất kỳ slide nào thay vì
 * chỉ Tiếp/Lùi từng bước. KHÔNG dựng gì khi đóng (return null): 45 ô nghĩa là 45 lần render
 * `SlideCanvas` đầy đủ, để mặc định mount sẵn dù đóng sẽ tốn không cần thiết.
 *
 * Bấm vào ô chỉ gọi `onSelect` — không tự viết cơ chế chuyển slide riêng. `onSelect` ở
 * `ControlDeck` là `navigate(index)` đã có sẵn, nên chuyển cảnh khi nhảy giống hệt khi bấm
 * Tiếp/Lùi (màn trình chiếu tự suy hướng tới/lùi từ chênh lệch chỉ số).
 */
export function SlidePickerGrid({ open, currentIndex, onSelect, onClose }: SlidePickerGridProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="slide-picker-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Chọn slide"
      onClick={onClose}
    >
      {/* Chặn nổi bọt để bấm vào panel (tiêu đề, ô lưới) không đóng lưới qua trình xử lý click nền. */}
      <div className="slide-picker-panel" onClick={(event) => event.stopPropagation()}>
        <div className="slide-picker-header">
          <h2>CHỌN SLIDE</h2>
          <button
            className="slide-picker-close"
            type="button"
            aria-label="Đóng lưới chọn slide"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="slide-picker-grid">
          {SLIDES.map((slide, index) => {
            const isCurrent = index === currentIndex;
            return (
              <button
                key={slide.number}
                type="button"
                className={
                  isCurrent ? "slide-picker-cell slide-picker-cell--current" : "slide-picker-cell"
                }
                aria-label={
                  slide.kind === "standby"
                    ? `Trang 0: ${slideShortTitle(slide)}`
                    : `Slide ${slide.number}: ${slideShortTitle(slide)}`
                }
                aria-current={isCurrent ? "true" : undefined}
                onClick={() => onSelect(index)}
              >
                <span className="slide-picker-thumb">
                  <SlideCanvas index={index} mode="preview" />
                </span>
                <span className="slide-picker-caption">
                  <span className="slide-picker-number">{slide.number}</span>
                  <span className="slide-picker-title">{slideShortTitle(slide)}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
