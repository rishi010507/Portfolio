import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const streakVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// bright head (uv.x = 1) fading to a transparent tail
const streakFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float tail = pow(vUv.x, 2.4);
    float edge = 1.0 - abs(vUv.y - 0.5) * 2.0;
    gl_FragColor = vec4(uColor, tail * edge * uOpacity);
  }
`;

interface StarState {
  active: boolean;
  t: number;
  nextSpawn: number;
  start: THREE.Vector3;
  end: THREE.Vector3;
}

const X_AXIS = new THREE.Vector3(1, 0, 0);

function ShootingStar({ color, delay }: { color: string; delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const dir = useRef(new THREE.Vector3());
  const stateRef = useRef<StarState>({
    active: false,
    t: 0,
    nextSpawn: delay,
    start: new THREE.Vector3(),
    end: new THREE.Vector3(),
  });

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
    }),
    [color],
  );

  useFrame((_, delta) => {
    const s = stateRef.current;
    const mesh = ref.current;
    if (!mesh) return;

    if (!s.active) {
      s.nextSpawn -= delta;
      uniforms.uOpacity.value = 0;
      if (s.nextSpawn <= 0) {
        s.active = true;
        s.t = 0;
        const startX = (Math.random() - 0.5) * 55;
        const startY = 12 + Math.random() * 12;
        const startZ = -20 - Math.random() * 35;
        s.start.set(startX, startY, startZ);
        s.end.set(
          startX - 20 - Math.random() * 12,
          startY - 24 - Math.random() * 12,
          startZ + (Math.random() - 0.5) * 8,
        );
        dir.current.subVectors(s.end, s.start).normalize();
        mesh.quaternion.setFromUnitVectors(X_AXIS, dir.current);
      }
      return;
    }

    s.t += delta / 1.0;
    if (s.t >= 1) {
      s.active = false;
      s.nextSpawn = 5 + Math.random() * 9;
      uniforms.uOpacity.value = 0;
      return;
    }

    mesh.position.lerpVectors(s.start, s.end, s.t);
    // fade in fast, fade out slow
    uniforms.uOpacity.value = Math.sin(Math.min(s.t * Math.PI, Math.PI)) * 0.9;
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[5, 0.07]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={streakVert}
        fragmentShader={streakFrag}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

const COLORS = ["#e0f7ff", "#c7b6ff", "#9ee8ff"];

interface ShootingStarsProps {
  count?: number;
}

export function ShootingStars({ count = 6 }: ShootingStarsProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ShootingStar key={i} color={COLORS[i % COLORS.length]} delay={i * 2.2 + Math.random() * 3} />
      ))}
    </>
  );
}
