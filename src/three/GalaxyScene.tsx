import { Lighting } from "./Lighting";
import { CameraRig } from "./CameraRig";
import { Starfield } from "./Starfield";
import { SpiralGalaxy } from "./SpiralGalaxy";
import { NebulaLayer } from "./NebulaLayer";
import { CosmicDust } from "./CosmicDust";
import { ShootingStars } from "./ShootingStars";
import { PerformanceGate } from "./PerformanceGate";
import { usePerfTier } from "../hooks/usePerfTier";

export function GalaxyScene() {
  const tier = usePerfTier();

  return (
    <>
      <color attach="background" args={["#030210"]} />
      <Lighting />
      <CameraRig />
      <PerformanceGate tier={tier}>
        {({ starCount, dustCount, galaxyCount, nebulaPlanes, showShootingStars }) => (
          <>
            <SpiralGalaxy count={galaxyCount} />
            <Starfield count={starCount} radius={70} />
            <NebulaLayer planeCount={nebulaPlanes} />
            {dustCount > 0 && <CosmicDust count={dustCount} />}
            {showShootingStars && <ShootingStars count={6} />}
          </>
        )}
      </PerformanceGate>
    </>
  );
}
