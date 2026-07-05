import { Starfield } from "./Starfield";

interface CosmicDustProps {
  count: number;
}

/** A closer, faster-drifting fine-dust layer for mid-ground parallax. */
export function CosmicDust({ count }: CosmicDustProps) {
  return <Starfield count={count} radius={26} colorA="#8fa3ff" colorB="#b9c2ff" sizeScale={0.5} speed={0.02} />;
}
