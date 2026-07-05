import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

interface Name3DProps {
  text: string;
}

interface LetterProps {
  char: string;
  index: number;
  setRef: (el: HTMLSpanElement | null) => void;
}

function Letter({ char, index, setRef }: LetterProps) {
  // each letter tumbles in from its own random 3D orientation/depth — never
  // the same "slide up" every other site does
  const seed = useMemo(
    () => ({
      rx: -70 + Math.random() * 140,
      ry: -100 + Math.random() * 200,
      rz: (Math.random() - 0.5) * 50,
      z: -460 - Math.random() * 260,
      dx: (Math.random() - 0.5) * 180,
      dy: (Math.random() - 0.5) * 240,
    }),
    [],
  );

  return (
    <span
      ref={setRef}
      className="inline-block"
      style={{ willChange: "transform", transition: "transform 0.35s cubic-bezier(0.16, 0.84, 0.44, 1)" }}
    >
      <motion.span
        className="inline-block"
        initial={{
          opacity: 0,
          rotateX: seed.rx,
          rotateY: seed.ry,
          rotateZ: seed.rz,
          z: seed.z,
          x: seed.dx,
          y: seed.dy,
          scale: 0.35,
          filter: "blur(11px)",
        }}
        animate={{
          opacity: 1,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          z: 0,
          x: 0,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        }}
        transition={{
          delay: 0.25 + index * 0.055,
          type: "spring",
          stiffness: 130,
          damping: 13,
          mass: 0.9,
        }}
      >
        {char}
      </motion.span>
    </span>
  );
}

/** Each letter of the name tumbles in from a random 3D orientation and depth on
 * load, settles with spring physics, then reacts directly to the cursor: any
 * letter the pointer passes near lifts, scales, and tilts toward it in 3D,
 * creating a rippling "magnetic" wave across the name as the mouse moves.
 * Letters are grouped per-word (each word is its own atomic inline-block) so
 * a word wraps as a whole on narrow screens instead of splitting mid-word. */
export function Name3D({ text }: Name3DProps) {
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const words = useMemo(() => text.split(" "), [text]);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const RADIUS = 170;

    function onMove(e: PointerEvent) {
      letterRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const t = Math.max(0, 1 - dist / RADIUS);

        if (t <= 0) {
          el.style.transform = "";
          return;
        }

        const lift = t * 24;
        const pop = t * 46;
        const scale = 1 + t * 0.3;
        const rotateX = (-dy / RADIUS) * 20 * t;
        const rotateY = (dx / RADIUS) * 20 * t;
        el.style.transform = `translateY(${-lift}px) translateZ(${pop}px) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    }

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  let globalIndex = 0;

  return (
    <span className="relative inline-block" style={{ perspective: 1200, transformStyle: "preserve-3d" }}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split("").map((char) => {
            const i = globalIndex++;
            return (
              <Letter
                key={i}
                char={char}
                index={i}
                setRef={(el) => {
                  letterRefs.current[i] = el;
                }}
              />
            );
          })}
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
