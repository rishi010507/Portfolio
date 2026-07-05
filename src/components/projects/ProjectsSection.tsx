import { motion } from "framer-motion";
import { SectionWrapper } from "../layout/SectionWrapper";
import { SectionHeading } from "../ui/SectionHeading";
import { GlassPanel } from "../ui/GlassPanel";
import { SECTION_IDS } from "../../lib/constants";

export function ProjectsSection() {
  return (
    <SectionWrapper id={SECTION_IDS.projects}>
      <SectionHeading
        eyebrow="Selected Work"
        title="Projects that feel like their own world"
        subtitle="A new body of work is being crafted — worth the wait."
      />
      <GlassPanel variant="panel" glow="cyan" className="mx-auto max-w-2xl text-center">
        <motion.span
          className="eyebrow justify-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1] }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--color-cyan-glow)]"
            style={{ boxShadow: "0 0 10px 2px var(--color-cyan-glow)", animation: "pulseDot 1.8s ease infinite" }}
          />
          In Progress
        </motion.span>
        <motion.h3
          className="text-gradient mt-4 font-[var(--font-display)] text-[clamp(2.2rem,5vw,3.4rem)] font-bold uppercase tracking-tight"
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 0.84, 0.44, 1], delay: 0.1 }}
        >
          Coming Soon
        </motion.h3>
        <motion.p
          className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--text-dim)]"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1], delay: 0.2 }}
        >
          I'm putting the finishing touches on a set of projects worth showing off. Check back soon.
        </motion.p>
      </GlassPanel>
    </SectionWrapper>
  );
}
