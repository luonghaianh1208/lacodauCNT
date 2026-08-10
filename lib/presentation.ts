import type { MotionMode } from "@/lib/motion";
import { clampIndex } from "@/lib/slides";

export const CHANNEL_NAME = "cnt-presentation-demo-v1";

export type VideoCommand = "play" | "pause" | "restart";

export type PresentationState = {
  slideIndex: number;
  sequence: number;
};

export type PresentationMessage =
  | { type: "REQUEST_STATE" }
  | { type: "STATE"; slideIndex: number; sequence: number }
  | { type: "COMMAND"; command: VideoCommand; sequence: number }
  | { type: "PRESENTER_READY" }
  | { type: "MOTION"; mode: MotionMode };

export type PresentationAction =
  | { type: "sync"; slideIndex: number; sequence: number }
  | { type: "navigate"; slideIndex: number };

// Dữ liệu slide (SLIDES, panelSideFor, v.v.) đã chuyển sang lib/slides — file này
// chỉ còn giữ phần kênh truyền và trạng thái điều hướng dùng chung cho hai màn hình.
export { clampIndex as clampSlideIndex };

export function reducePresentationState(
  state: PresentationState,
  action: PresentationAction,
): PresentationState {
  if (action.type === "sync") {
    if (action.sequence <= state.sequence) {
      return state;
    }

    return {
      slideIndex: clampIndex(action.slideIndex),
      sequence: action.sequence,
    };
  }

  return {
    slideIndex: clampIndex(action.slideIndex),
    sequence: state.sequence + 1,
  };
}
