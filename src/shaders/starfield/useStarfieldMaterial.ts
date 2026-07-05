import { useMemo } from "react";
import * as THREE from "three";
import vertexShader from "./starfield.vert.glsl";
import fragmentShader from "./starfield.frag.glsl";

interface StarfieldMaterialOptions {
  colorA: string;
  colorB: string;
  sizeScale?: number;
}

export function useStarfieldMaterial({ colorA, colorB, sizeScale = 1 }: StarfieldMaterialOptions) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uSizeScale: { value: sizeScale },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
    }),
    [colorA, colorB, sizeScale],
  );

  return { uniforms, vertexShader, fragmentShader };
}
