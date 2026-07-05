import { useMemo } from "react";

export type PerfTier = "low" | "mid" | "high";

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

function detectPerfTier(): PerfTier {
  if (typeof navigator === "undefined") return "high";

  const isMobile = /Android|iPhone|iPad|iPod|Mobile|webOS/i.test(navigator.userAgent);
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as NavigatorWithMemory).deviceMemory ?? 8;

  if (isMobile && (cores <= 4 || memory <= 4)) return "low";
  if (isMobile) return "mid";
  if (cores <= 4 || memory <= 4) return "mid";
  return "high";
}

export function usePerfTier(): PerfTier {
  return useMemo(detectPerfTier, []);
}
