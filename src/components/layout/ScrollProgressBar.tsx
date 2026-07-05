import { useEffect, useRef } from "react";
import { useScrollStore } from "../../store/scrollStore";

/** Thin gradient bar across the top that fills with overall scroll progress. */
export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = useScrollStore.subscribe((state) => {
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${state.progress})`;
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[var(--z-nav)] h-[3px] w-full bg-white/5">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-gradient-to-r from-[var(--color-cyan-glow)] via-[var(--color-nebula-purple)] to-[var(--color-electric-blue)]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
