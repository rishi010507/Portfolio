import { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/audio/ambient.mp3";
const TARGET_VOLUME = 0.35;

/** Loops a background ambience track with a smooth fade in/out on toggle. */
export function useAmbientSpaceSound() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeFrameRef = useRef<number | null>(null);

  function getAudio() {
    if (!audioRef.current) {
      const audio = new Audio(AUDIO_SRC);
      audio.loop = true;
      audio.volume = 0;
      audioRef.current = audio;
    }
    return audioRef.current;
  }

  function fadeTo(target: number, duration = 900) {
    const audio = getAudio();
    if (fadeFrameRef.current !== null) cancelAnimationFrame(fadeFrameRef.current);

    const start = audio.volume;
    const startTime = performance.now();

    function step(now: number) {
      const t = Math.min(1, (now - startTime) / duration);
      audio.volume = start + (target - start) * t;
      if (t < 1) {
        fadeFrameRef.current = requestAnimationFrame(step);
      } else {
        fadeFrameRef.current = null;
        if (target === 0) audio.pause();
      }
    }
    fadeFrameRef.current = requestAnimationFrame(step);
  }

  function toggle() {
    const audio = getAudio();
    if (enabled) {
      fadeTo(0);
      setEnabled(false);
    } else {
      void audio.play();
      fadeTo(TARGET_VOLUME);
      setEnabled(true);
    }
  }

  useEffect(() => {
    return () => {
      if (fadeFrameRef.current !== null) cancelAnimationFrame(fadeFrameRef.current);
      audioRef.current?.pause();
    };
  }, []);

  return { enabled, toggle };
}
