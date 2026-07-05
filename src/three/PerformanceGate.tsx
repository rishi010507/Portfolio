import type { ReactNode } from "react";
import type { PerfTier } from "../hooks/usePerfTier";

export interface SceneDensityConfig {
  starCount: number;
  dustCount: number;
  galaxyCount: number;
  nebulaPlanes: number;
  showShootingStars: boolean;
}

const TIER_CONFIG: Record<PerfTier, SceneDensityConfig> = {
  low: { starCount: 900, dustCount: 0, galaxyCount: 18000, nebulaPlanes: 1, showShootingStars: false },
  mid: { starCount: 2100, dustCount: 350, galaxyCount: 40000, nebulaPlanes: 2, showShootingStars: true },
  high: { starCount: 3500, dustCount: 850, galaxyCount: 72000, nebulaPlanes: 3, showShootingStars: true },
};

interface PerformanceGateProps {
  tier: PerfTier;
  children: (config: SceneDensityConfig) => ReactNode;
}

export function PerformanceGate({ tier, children }: PerformanceGateProps) {
  return <>{children(TIER_CONFIG[tier])}</>;
}
