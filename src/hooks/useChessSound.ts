"use client";
import { useCallback } from "react";

const playSound = (url: string) => {
  if (typeof window === "undefined") return;
  const audio = new Audio(url);
  audio.volume = 0.5;
  audio.play().catch(() => {});
};

export function useChessSound() {
  const playMove = useCallback(() => {
    playSound("https://lichess1.org/assets/sound/standard/Move.mp3");
  }, []);

  const playCapture = useCallback(() => {
    playSound("https://lichess1.org/assets/sound/standard/Capture.mp3");
  }, []);

  const playCheck = useCallback(() => {
    playSound("https://lichess1.org/assets/sound/standard/Check.mp3");
  }, []);

  const playEnd = useCallback(() => {
    playSound("https://lichess1.org/assets/sound/standard/GenericNotify.mp3");
  }, []);

  return { playMove, playCapture, playCheck, playEnd };
}