import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsapConfig";
import { CURSOR_TRAIL_DURATIONS } from "../components/cursor/cursor.constants";

export function useCursor(enabled: boolean) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!enabled) return;
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const trails = trailRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (!root || !dot || !ring) return;

    gsap.set([dot, ring, ...trails], { xPercent: -50, yPercent: -50 });

    const dotTo = {
      x: gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" }),
      y: gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" }),
    };
    const ringTo = {
      x: gsap.quickTo(ring, "x", { duration: 0.32, ease: "power3.out" }),
      y: gsap.quickTo(ring, "y", { duration: 0.32, ease: "power3.out" }),
    };
    const trailTo = trails.map((el, i) => ({
      x: gsap.quickTo(el, "x", {
        duration: CURSOR_TRAIL_DURATIONS[i % CURSOR_TRAIL_DURATIONS.length],
        ease: "power2.out",
      }),
      y: gsap.quickTo(el, "y", {
        duration: CURSOR_TRAIL_DURATIONS[i % CURSOR_TRAIL_DURATIONS.length],
        ease: "power2.out",
      }),
    }));

    function onMove(e: PointerEvent) {
      dotTo.x(e.clientX);
      dotTo.y(e.clientY);
      ringTo.x(e.clientX);
      ringTo.y(e.clientY);
      trailTo.forEach((t) => {
        t.x(e.clientX);
        t.y(e.clientY);
      });
    }

    const interactiveSelector = "a, button, [data-cursor-hover]";

    function onOver(e: PointerEvent) {
      const target = e.target as HTMLElement;
      if (target.closest?.(interactiveSelector)) {
        root!.dataset.state = "hover";
      }
    }
    function onOut(e: PointerEvent) {
      const target = e.target as HTMLElement;
      const related = e.relatedTarget as HTMLElement | null;
      if (target.closest?.(interactiveSelector) && !related?.closest?.(interactiveSelector)) {
        root!.dataset.state = "default";
      }
    }

    function spawnRipple(x: number, y: number) {
      const ripple = document.createElement("div");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      root!.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    }

    function onDown(e: PointerEvent) {
      root!.dataset.state = root!.dataset.state === "hover" ? "hover-click" : "click";
      spawnRipple(e.clientX, e.clientY);
    }
    function onUp() {
      root!.dataset.state = root!.dataset.state === "hover-click" ? "hover" : "default";
    }

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  return { rootRef, dotRef, ringRef, trailRefs };
}
