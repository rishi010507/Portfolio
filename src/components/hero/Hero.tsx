import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Name3D } from "./Name3D";
import { RotatingSubtitle } from "./RotatingSubtitle";
import { ScrollIndicator } from "./ScrollIndicator";
import { GlassButton } from "../ui/GlassButton";
import { PLACEHOLDERS } from "../../data/placeholders";
import { getLenis } from "../../lib/lenisConfig";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mvY, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(mvX, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 20 });
  const translateX = useSpring(useTransform(mvX, [-0.5, 0.5], [-14, 14]), { stiffness: 100, damping: 22 });
  const translateY = useSpring(useTransform(mvY, [-0.5, 0.5], [-10, 10]), { stiffness: 100, damping: 22 });

  function handleMouseMove(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <section
      id="hero"
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 py-32 text-center"
    >
      {/* scrim: keeps text readable against the bright galactic core */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[min(900px,100vw)] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(3, 2, 14, 0.68), rgba(3, 2, 14, 0.28) 55%, transparent 78%)",
        }}
      />

      <motion.div
        style={{ x: translateX, y: translateY, rotateX, rotateY, transformPerspective: 1000 }}
        className="relative z-10 flex w-full max-w-3xl flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 0.84, 0.44, 1] }}
        >
          {/* separate layer for the continuous idle bob, so it never fights framer-motion's entrance transform */}
          <div className="animate-card-float">
            <span className="glass-surface eyebrow mb-8 flex items-center !rounded-[var(--radius-pill)] px-4 py-2">
              <span
                className="mr-2 h-1.5 w-1.5 rounded-full bg-[var(--color-cyan-glow)]"
                style={{ boxShadow: "0 0 10px 2px var(--color-cyan-glow)", animation: "pulseDot 1.8s ease infinite" }}
              />
              Available for opportunities
            </span>
          </div>
        </motion.div>

        {/* every letter tumbles in from its own random 3D rotation/depth on load,
            then any letter the cursor passes near lifts and tilts toward it in 3D */}
        <h1
          className="font-[var(--font-display)] text-[clamp(2.8rem,8vw,6rem)] font-bold uppercase leading-[1.02] tracking-[-0.02em] text-[var(--color-soft-white)]"
          style={{ filter: "drop-shadow(0 0 34px rgba(139, 92, 246, 0.4))" }}
        >
          <Name3D text={PLACEHOLDERS.NAME} />
        </h1>

        {/* tagline sits right under the name — text-shadow keeps it legible
            regardless of how bright/colorful the galaxy behind it gets */}
        <motion.p
          className="mt-4 max-w-xl text-balance text-[clamp(1.1rem,2.2vw,1.35rem)] leading-relaxed text-[#c9cfeb]"
          style={{ textShadow: "0 2px 14px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.95)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 0.84, 0.44, 1] }}
        >
          {PLACEHOLDERS.HERO_TAGLINE}
        </motion.p>

        <p
          className="mt-3 text-[clamp(1rem,2vw,1.25rem)] text-[var(--text-dim)]"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}
        >
          <RotatingSubtitle />
        </p>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 0.84, 0.44, 1] }}
        >
          <GlassButton variant="primary" onClick={() => getLenis()?.scrollTo("#projects")}>
            View My Work
          </GlassButton>
          <GlassButton variant="outline" onClick={() => getLenis()?.scrollTo("#contact")}>
            Get In Touch
          </GlassButton>
        </motion.div>
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}
