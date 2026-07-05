import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";
import { usePerfTier } from "../hooks/usePerfTier";

interface CanvasRootProps {
  children: ReactNode;
}

export function CanvasRoot({ children }: CanvasRootProps) {
  const tier = usePerfTier();
  const dpr: [number, number] = tier === "low" ? [1, 1] : tier === "mid" ? [1, 1.5] : [1, 2];

  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: "none" }} aria-hidden="true">
      <Canvas
        dpr={dpr}
        gl={{ antialias: tier !== "low", powerPreference: "high-performance", alpha: false }}
        camera={{ fov: 55, near: 0.1, far: 200, position: [0, 0, 8] }}
      >
        {children}
      </Canvas>
    </div>
  );
}
