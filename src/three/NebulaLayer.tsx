import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useNebulaMaterial } from "../shaders/nebula/useNebulaMaterial";

interface NebulaPlaneConfig {
  position: [number, number, number];
  scale: number;
  colorA: string;
  colorB: string;
  colorC: string;
  opacity: number;
  speed: number;
}

function NebulaPlane({ position, scale, colorA, colorB, colorC, opacity, speed }: NebulaPlaneConfig) {
  const ref = useRef<THREE.Mesh>(null);
  const { uniforms, vertexShader, fragmentShader } = useNebulaMaterial({ colorA, colorB, colorC, opacity });

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime * speed;
    ref.current?.lookAt(state.camera.position);
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

const CONFIGS: NebulaPlaneConfig[] = [
  { position: [-9, 4, -40], scale: 44, colorA: "#0a0620", colorB: "#5b2fd6", colorC: "#ffcf7a", opacity: 0.4, speed: 0.6 },
  { position: [12, -6, -54], scale: 52, colorA: "#060818", colorB: "#1d3a8f", colorC: "#3fb9e6", opacity: 0.34, speed: 0.4 },
  { position: [-2, 8, -68], scale: 62, colorA: "#070516", colorB: "#3b1f7a", colorC: "#22d3ee", opacity: 0.26, speed: 0.3 },
];

interface NebulaLayerProps {
  planeCount?: number;
}

export function NebulaLayer({ planeCount = 3 }: NebulaLayerProps) {
  return (
    <>
      {CONFIGS.slice(0, planeCount).map((cfg, i) => (
        <NebulaPlane key={i} {...cfg} />
      ))}
    </>
  );
}
