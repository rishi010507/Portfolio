import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStarfieldMaterial } from "../shaders/starfield/useStarfieldMaterial";

interface StarfieldProps {
  count: number;
  radius?: number;
  /** cool star color (blue-white) */
  colorA?: string;
  /** warm star color (amber-white) */
  colorB?: string;
  sizeScale?: number;
  speed?: number;
}

export function Starfield({
  count,
  radius = 60,
  colorA = "#d6e4ff",
  colorB = "#ffedd2",
  sizeScale = 1,
  speed = 0.006,
}: StarfieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { uniforms, vertexShader, fragmentShader } = useStarfieldMaterial({ colorA, colorB, sizeScale });

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.35 + Math.random() * 0.65);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      // mostly tiny stars, occasional brighter one
      sizes[i] = Math.random() < 0.06 ? 1.4 + Math.random() * 0.8 : 0.35 + Math.random() * 0.65;
      seeds[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return geo;
  }, [count, radius]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
