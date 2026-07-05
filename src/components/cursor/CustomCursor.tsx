import { useEffect, useState, type CSSProperties } from "react";
import { useCursor } from "../../hooks/useCursor";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { CURSOR_TRAIL_COUNT } from "./cursor.constants";

export function CustomCursor() {
  const reducedMotion = usePrefersReducedMotion();
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setFinePointer(mq.matches);
    const handler = () => setFinePointer(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const enabled = finePointer && !reducedMotion;
  const { rootRef, dotRef, ringRef, trailRefs } = useCursor(enabled);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="cursor-root" data-state="default">
      {Array.from({ length: CURSOR_TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="cursor-trail"
          style={{ "--i": i } as CSSProperties}
        />
      ))}
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
