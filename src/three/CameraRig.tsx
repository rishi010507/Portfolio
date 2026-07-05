import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore } from "../store/scrollStore";

interface Waypoint {
  progress: number;
  position: [number, number, number];
  rotation: [number, number, number];
}

/**
 * Scroll-progress waypoints the camera dollies through, aligned to each
 * section's actual measured scroll-offset fraction (hero -> intro -> skills
 * -> projects -> about -> timeline -> contact) so the dolly pace matches
 * real content rather than an arbitrary guess.
 */
const WAYPOINTS: Waypoint[] = [
  { progress: 0.0, position: [0, 0, 8], rotation: [0, 0, 0] },
  { progress: 0.113, position: [1.1, -0.3, 3.5], rotation: [0.015, 0.09, 0] },
  { progress: 0.206, position: [-1.4, 0.4, -1], rotation: [-0.015, -0.11, 0] },
  { progress: 0.361, position: [1.6, -0.6, -8], rotation: [0.025, 0.14, 0.01] },
  { progress: 0.627, position: [-1.3, 0.7, -18], rotation: [-0.02, -0.12, -0.01] },
  { progress: 0.739, position: [1.0, -0.5, -24], rotation: [0.02, 0.1, 0] },
  { progress: 0.939, position: [-0.6, 0.3, -31], rotation: [-0.01, -0.06, 0] },
  { progress: 1.0, position: [0, 0.2, -34], rotation: [0, 0, 0] },
];

function findSegment(progress: number): readonly [Waypoint, Waypoint] {
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    if (progress >= WAYPOINTS[i].progress && progress <= WAYPOINTS[i + 1].progress) {
      return [WAYPOINTS[i], WAYPOINTS[i + 1]] as const;
    }
  }
  return [WAYPOINTS[WAYPOINTS.length - 2], WAYPOINTS[WAYPOINTS.length - 1]] as const;
}

const BASE_FOV = 55;
const BASE_ASPECT = 16 / 9;
// how much horizontal field of view the scene is designed around — kept
// constant across aspect ratios so the galaxy's full width stays in frame
const BASE_HFOV = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(BASE_FOV) / 2) * BASE_ASPECT);

/**
 * On wide/landscape screens (laptops, tablets landscape) this returns the
 * original fixed FOV untouched. On narrower/portrait screens (phones) it
 * widens the vertical FOV just enough to keep the same horizontal framing —
 * effectively "zooming out" so the whole galaxy composition stays visible
 * instead of being cropped, the same way it looks on a laptop.
 */
function responsiveFov(aspect: number): number {
  if (aspect >= BASE_ASPECT) return BASE_FOV;
  const vFov = 2 * Math.atan(Math.tan(BASE_HFOV / 2) / aspect);
  const vFovDeg = THREE.MathUtils.radToDeg(vFov);
  return THREE.MathUtils.clamp(vFovDeg, BASE_FOV, 100);
}

export function CameraRig() {
  const { camera, size } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 8));
  const targetRot = useRef(new THREE.Euler(0, 0, 0));
  const desired = useRef(new THREE.Vector3());
  const pointer = useRef({ x: 0, y: 0 });
  const lastAspect = useRef(0);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const aspect = size.width / size.height;
    if (Math.abs(aspect - lastAspect.current) > 0.001 && camera instanceof THREE.PerspectiveCamera) {
      lastAspect.current = aspect;
      camera.fov = responsiveFov(aspect);
      camera.updateProjectionMatrix();
    }

    const progress = useScrollStore.getState().progress;
    const [a, b] = findSegment(progress);
    const span = b.progress - a.progress || 1;
    const t = THREE.MathUtils.clamp((progress - a.progress) / span, 0, 1);
    const smoothT = t * t * (3 - 2 * t);

    target.current.set(
      THREE.MathUtils.lerp(a.position[0], b.position[0], smoothT),
      THREE.MathUtils.lerp(a.position[1], b.position[1], smoothT),
      THREE.MathUtils.lerp(a.position[2], b.position[2], smoothT),
    );
    targetRot.current.set(
      THREE.MathUtils.lerp(a.rotation[0], b.rotation[0], smoothT),
      THREE.MathUtils.lerp(a.rotation[1], b.rotation[1], smoothT),
      THREE.MathUtils.lerp(a.rotation[2], b.rotation[2], smoothT),
    );

    desired.current.copy(target.current);
    desired.current.x += pointer.current.x * 0.35;
    desired.current.y += -pointer.current.y * 0.25;

    const damp = 1 - Math.pow(0.001, delta);
    camera.position.lerp(desired.current, damp);
    camera.rotation.x += (targetRot.current.x - camera.rotation.x) * damp;
    camera.rotation.y += (targetRot.current.y + pointer.current.x * 0.05 - camera.rotation.y) * damp;
    camera.rotation.z += (targetRot.current.z - camera.rotation.z) * damp;
  });

  return null;
}
