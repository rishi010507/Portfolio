import { useMemo } from "react";
import * as THREE from "three";
import vertexShader from "./nebula.vert.glsl";
import fragmentShader from "./nebula.frag.glsl";

interface NebulaMaterialOptions {
  colorA: string;
  colorB: string;
  colorC: string;
  opacity?: number;
}

export function useNebulaMaterial({ colorA, colorB, colorC, opacity = 1 }: NebulaMaterialOptions) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uColorC: { value: new THREE.Color(colorC) },
      uOpacity: { value: opacity },
    }),
    [colorA, colorB, colorC, opacity],
  );

  return { uniforms, vertexShader, fragmentShader };
}
