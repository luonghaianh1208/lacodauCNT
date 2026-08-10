import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ControlDeck } from "@/components/ControlDeck";
import { PresentationScreen } from "@/components/PresentationScreen";

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

    fireEvent.click(screen.getByRole("button", { name: "Tiếp" }));
    await waitFor(() =>
      expect(projector?.querySelector('[aria-label="Slide 31"]')).not.toBeNull(),
    );

    fireEvent.click(screen.getByRole("button", { name: "Tiếp" }));
    await waitFor(() =>
      expect(projector?.querySelector('[aria-label="Slide 34"]')).not.toBeNull(),
    );

    fireEvent.click(screen.getByRole("button", { name: "Phát video" }));
    await waitFor(() => expect(play).toHaveBeenCalledTimes(1));
  });

  it("restores the current slide when a projector tab opens later", async () => {
    const control = render(<ControlDeck />);
    fireEvent.click(screen.getByRole("button", { name: "Tiếp" }));
    fireEvent.click(screen.getByRole("button", { name: "Tiếp" }));

    const projector = render(<PresentationScreen />);
    const projectorMain = projector.container.querySelector(".presentation-page");

    await waitFor(() =>
      expect(projectorMain?.querySelector('[aria-label="Slide 34"]')).not.toBeNull(),
    );
    expect(
      within(control.container).getByText(
        "Giới thiệu 06 nhóm chức năng; phát clip ngắn để minh họa giao diện và cách vận hành.",
      ),
    ).toBeInTheDocument();
  });
});
