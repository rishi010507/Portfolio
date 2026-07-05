import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import galaxyVert from "../shaders/galaxy/galaxy.vert.glsl";
import galaxyFrag from "../shaders/galaxy/galaxy.frag.glsl";

const GALAXY = {
  radius: 14,
  // small dark gap before the disc starts — stops particles from piling up
  // into one dense, oversized bright dot at dead-center. The gap is filled
  // by a defined GalaxyCoreSphere + ring instead of being left empty.
  minRadius: 1.7,
  branches: 3,
  spin: 1.15,
  randomness: 0.32,
  randomnessPower: 2.9,
  // Warm-leaning palette: golden-white bulge, softer blue-gold arms (less blue
  // than before), bright golden-white + a touch of magenta star clusters,
  // a purple-leaning (not pure blue) outer rim.
  coreColor: "#fff6df",
  bulgeColor: "#ffc783",
  armColor: "#d9d0ff",
  brightClusterColor: "#fff4d6",
  goldColor: "#ffcf7a",
  magentaColor: "#ff8fd6",
  dustColor: "#3a2a24",
  rimColor: "#6a4fc9",
};

/** Cheap deterministic 2D hash noise (0..1) — used to clump bright clusters & dust lanes. */
function hashNoise(x: number, y: number) {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

function buildGalaxyGeometry(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const seeds = new Float32Array(count);
  const brights = new Float32Array(count);
  const randomness = new Float32Array(count * 3);

  const core = new THREE.Color(GALAXY.coreColor);
  const bulge = new THREE.Color(GALAXY.bulgeColor);
  const arm = new THREE.Color(GALAXY.armColor);
  const brightCluster = new THREE.Color(GALAXY.brightClusterColor);
  const gold = new THREE.Color(GALAXY.goldColor);
  const magenta = new THREE.Color(GALAXY.magentaColor);
  const dust = new THREE.Color(GALAXY.dustColor);
  const rim = new THREE.Color(GALAXY.rimColor);
  const tmp = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    const radius = GALAXY.minRadius + Math.pow(Math.random(), 1.9) * (GALAXY.radius - GALAXY.minRadius);
    const branchIndex = i % GALAXY.branches;
    const branchAngle = (branchIndex / GALAXY.branches) * Math.PI * 2;
    const spinAngle = radius * GALAXY.spin;
    const armAngle = branchAngle + spinAngle;

    positions[i3] = Math.sin(armAngle) * radius;
    positions[i3 + 1] = 0;
    positions[i3 + 2] = Math.cos(armAngle) * radius;

    const t = radius / GALAXY.radius;

    const rand = () =>
      Math.pow(Math.random(), GALAXY.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      GALAXY.randomness *
      Math.max(radius, 1.2);
    randomness[i3] = rand();
    // disc profile: puffy central bulge, thin flat outer disc
    randomness[i3 + 1] = rand() * (0.3 + Math.pow(1 - t, 2.2) * 1.6);
    randomness[i3 + 2] = rand();

    // --- base color: bulge (warm) -> arm (blue-white) -> rim (deep indigo)
    // a smaller, tighter bulge zone so the spiral arms take over closer to
    // center, leaving more visible room for arm structure/color/detail
    if (t < 0.2) {
      tmp.copy(core).lerp(bulge, t / 0.2);
    } else if (t < 0.45) {
      tmp.copy(bulge).lerp(arm, (t - 0.2) / 0.25);
    } else {
      tmp.copy(arm).lerp(rim, (t - 0.45) / 0.55);
    }

    // clumped noise along each arm (low frequency -> patchy clusters, not speckle)
    const clumpCoord = branchIndex * 11.7 + radius * 1.35;
    const acrossArm = hashNoise(clumpCoord, Math.floor(radius * 3.1));
    const clump = hashNoise(Math.floor(clumpCoord * 2.4), Math.floor(radius * 2.2));
    const goldClump = hashNoise(Math.floor(clumpCoord * 1.7) + 5.3, Math.floor(radius * 1.8) - 2.1);
    const magentaClump = hashNoise(Math.floor(clumpCoord * 3.1) - 8.7, Math.floor(radius * 2.6) + 3.4);

    let brightnessBoost = 1;

    // bright golden-white star-forming pockets, mid-arm only, in tight clusters
    if (t > 0.14 && t < 0.82 && clump > 0.86) {
      const mixAmt = 0.55 + Math.random() * 0.35;
      tmp.lerp(brightCluster, mixAmt);
      brightnessBoost = 1.4;
    }
    // warm golden star clusters — older stellar populations, scattered wider
    // across the disc than the bright pockets, glowing amber against the blue arms
    else if (t > 0.1 && t < 0.95 && goldClump > 0.74) {
      const mixAmt = 0.5 + Math.random() * 0.4;
      tmp.lerp(gold, mixAmt);
      brightnessBoost = 1.3;
    }
    // a small amount of magenta — rare, tiny accent clusters, not a dominant hue
    else if (t > 0.2 && t < 0.85 && magentaClump > 0.94) {
      const mixAmt = 0.45 + Math.random() * 0.3;
      tmp.lerp(magenta, mixAmt);
      brightnessBoost = 1.25;
    }
    // dust lane shadowing — thin dark band trailing just inside each arm
    else if (t > 0.12 && t < 0.5 && acrossArm > 0.75 && acrossArm < 0.83) {
      tmp.lerp(dust, 0.5);
      brightnessBoost = 0.55;
    }
    // occasional hot blue-white outlier star scattered through the arms
    else if (Math.random() < 0.04) {
      tmp.lerp(new THREE.Color("#eaf2ff"), 0.7);
      brightnessBoost = 1.5;
    }

    // arms dim toward the rim like a real disc galaxy, plus per-star sparkle variance
    const radialFade = 1 - t * 0.4;
    const sparkle = 0.82 + Math.random() * 0.36;
    // dim the very core noticeably so it doesn't blow out — real galactic cores
    // are bright but not a flat white wall
    const centerDim = t < 0.28 ? 0.52 + (t / 0.28) * 0.48 : 1;
    // fine high-frequency grain for extra texture/detail, independent of the
    // low-frequency arm clumping above
    const grain = 0.9 + hashNoise(radius * 37.1 + branchIndex * 4.2, armAngle * 12.3) * 0.22;
    const fade = radialFade * sparkle * brightnessBoost * centerDim * grain;

    colors[i3] = Math.min(1, tmp.r * fade);
    colors[i3 + 1] = Math.min(1, tmp.g * fade);
    colors[i3 + 2] = Math.min(1, tmp.b * fade);

    // bulge stars read slightly larger/brighter; bright clusters/hot outliers pop a bit more
    scales[i] = (0.4 + Math.random() * 1.3) * (1 + (1 - t) * 0.25) * (brightnessBoost > 1 ? 1.25 : 1);
    seeds[i] = Math.random();
    // a sparse subset of the hottest outlier stars get a sharp diffraction spike
    brights[i] = brightnessBoost >= 1.5 && Math.random() < 0.12 ? 1 : 0;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geo.setAttribute("aBright", new THREE.BufferAttribute(brights, 1));
  geo.setAttribute("aRandomness", new THREE.BufferAttribute(randomness, 3));
  return geo;
}

const coreGlowVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coreGlowFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uPower;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float alpha = pow(max(1.0 - d, 0.0), uPower);
    gl_FragColor = vec4(uColor, alpha * uIntensity);
  }
`;

function GlowPlane({
  size,
  color,
  intensity,
  power,
  renderOrder = 1,
}: {
  size: number;
  color: string;
  intensity: number;
  power: number;
  renderOrder?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uIntensity: { value: intensity },
      uPower: { value: power },
    }),
    [color, intensity, power],
  );

  useFrame((state) => {
    ref.current?.lookAt(state.camera.position);
  });

  return (
    <mesh ref={ref} renderOrder={renderOrder}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={coreGlowVert}
        fragmentShader={coreGlowFrag}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

const sphereVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const sphereFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uRim;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.3);
    float pulse = 0.94 + 0.06 * sin(uTime * 0.6);
    vec3 color = mix(uColor, uRim, fresnel * 0.95) * pulse;
    gl_FragColor = vec4(color, 1.0);
  }
`;

/** A defined, solid glowing sphere at the very center — gives the galaxy a
 * clear geometric focal point instead of a formless glow blob. */
function GalaxyCoreSphere({ radius }: { radius: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#ffdca0") },
      uRim: { value: new THREE.Color("#fff6df") },
      uTime: { value: 0 },
    }),
    [],
  );

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius, 48, 48]} />
      <shaderMaterial uniforms={uniforms} vertexShader={sphereVert} fragmentShader={sphereFrag} />
    </mesh>
  );
}

const ringFrag = /* glsl */ `
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    float edge = smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.72, vUv.y);
    gl_FragColor = vec4(uColor, edge * 0.55);
  }
`;

/** A thin, defined accretion-disc ring hugging the core sphere for extra structure. */
function GalaxyCoreRing({ innerRadius, outerRadius }: { innerRadius: number; outerRadius: number }) {
  const uniforms = useMemo(() => ({ uColor: { value: new THREE.Color("#ffe6b8") } }), []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[innerRadius, outerRadius, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={coreGlowVert}
        fragmentShader={ringFrag}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

const discHazeFrag = /* glsl */ `
  uniform vec3 uInner;
  uniform vec3 uMid;
  uniform vec3 uOuter;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    vec3 color = mix(uInner, uMid, smoothstep(0.0, 0.4, d));
    color = mix(color, uOuter, smoothstep(0.35, 0.75, d));
    float alpha = pow(max(1.0 - d, 0.0), 3.4) * 0.13;
    gl_FragColor = vec4(color, alpha);
  }
`;

/** Faint glow lying in the galactic plane — reads as unresolved starlight between arms. */
function DiscHaze() {
  const uniforms = useMemo(
    () => ({
      uInner: { value: new THREE.Color("#fff2cf") },
      uMid: { value: new THREE.Color("#ffd88f") },
      uOuter: { value: new THREE.Color("#5c3f9e") },
    }),
    [],
  );

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[16, 16]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={coreGlowVert}
        fragmentShader={discHazeFrag}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

interface SpiralGalaxyProps {
  count: number;
}

export function SpiralGalaxy({ count }: SpiralGalaxyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => buildGalaxyGeometry(count), [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 1.0 },
      uPixelRatio: { value: 1 },
    }),
    [],
  );

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    // whole-disc revolution around the galactic axis, on top of the
    // per-star differential rotation done in the vertex shader
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.045;
    }
  });

  const coreRadius = 1.5;

  return (
    <group position={[0, -8.5, -28]} rotation={[-0.75, 0, 0]}>
      <group ref={groupRef}>
        <points geometry={geometry}>
          <shaderMaterial
            uniforms={uniforms}
            vertexShader={galaxyVert}
            fragmentShader={galaxyFrag}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
        <DiscHaze />
        <GalaxyCoreRing innerRadius={coreRadius * 1.15} outerRadius={coreRadius * 2.05} />
        <GalaxyCoreSphere radius={coreRadius} />
      </group>
      {/* wide soft halo of scattered light around the defined core sphere — the sphere
          + ring above give the center clean geometric edges, this glow just adds
          atmosphere around them without swallowing the galaxy's overall scale */}
      <GlowPlane size={11} color="#9077d9" intensity={0.16} power={2.0} renderOrder={0} />
      <GlowPlane size={7} color="#ffcf7a" intensity={0.13} power={2.6} renderOrder={1} />
      <GlowPlane size={3.1} color="#ffdca0" intensity={0.22} power={3.6} renderOrder={2} />
    </group>
  );
}
