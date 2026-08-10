"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { MotionMode } from "@/lib/motion";
import {
  CHANNEL_NAME,
  type PresentationMessage,
  type PresentationState,
  type VideoCommand,
} from "@/lib/presentation";

type UsePresentationChannelOptions = {
  role: "control" | "present";
  currentState: PresentationState;
  onState?: (state: PresentationState) => void;
  onCommand?: (command: VideoCommand) => void;
  onMotion?: (mode: MotionMode) => void;
};

export function usePresentationChannel({
  role,
  currentState,
  onState,
  onCommand,
  onMotion,
}: UsePresentationChannelOptions) {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const stateRef = useRef(currentState);
  const onStateRef = useRef(onState);
  const onCommandRef = useRef(onCommand);
  const onMotionRef = useRef(onMotion);
  const [projectorConnected, setProjectorConnected] = useState(false);

  useEffect(() => {
    stateRef.current = currentState;
  }, [currentState]);

  useEffect(() => {
    onStateRef.current = onState;
  }, [onState]);

  useEffect(() => {
    onCommandRef.current = onCommand;
  }, [onCommand]);

  useEffect(() => {
    onMotionRef.current = onMotion;
  }, [onMotion]);

  useEffect(() => {
    if (!("BroadcastChannel" in window)) {
      return;
    }

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<PresentationMessage>) => {
      const message = event.data;

      if (message.type === "REQUEST_STATE" && role === "control") {
        channel.postMessage({
          type: "STATE",
          ...stateRef.current,
        } satisfies PresentationMessage);
      }

      if (message.type === "STATE" && role === "present") {
        onStateRef.current?.({
          slideIndex: message.slideIndex,
          sequence: message.sequence,
        });
      }

      if (message.type === "COMMAND" && role === "present") {
        onCommandRef.current?.(message.command);
      }

      if (message.type === "MOTION" && role === "present") {
        onMotionRef.current?.(message.mode);
      }

      if (message.type === "PRESENTER_READY" && role === "control") {
        setProjectorConnected(true);
      }
    };

    if (role === "present") {
      channel.postMessage({ type: "PRESENTER_READY" } satisfies PresentationMessage);
      channel.postMessage({ type: "REQUEST_STATE" } satisfies PresentationMessage);
    }

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [role]);

  const postState = useCallback((state: PresentationState) => {
    channelRef.current?.postMessage({ type: "STATE", ...state } satisfies PresentationMessage);
  }, []);

  const postCommand = useCallback((command: VideoCommand, sequence: number) => {
    channelRef.current?.postMessage({
      type: "COMMAND",
      command,
      sequence,
    } satisfies PresentationMessage);
  }, []);

  const postMotion = useCallback((mode: MotionMode) => {
    channelRef.current?.postMessage({ type: "MOTION", mode } satisfies PresentationMessage);
  }, []);

  return {
    projectorConnected,
    postState,
    postCommand,
    postMotion,
  };
}
