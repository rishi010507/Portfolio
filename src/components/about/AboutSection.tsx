import { motion } from "framer-motion";
import { SectionWrapper } from "../layout/SectionWrapper";
import { SectionHeading } from "../ui/SectionHeading";
import { GlassPanel } from "../ui/GlassPanel";
import { PLACEHOLDERS } from "../../data/placeholders";
import { SECTION_IDS } from "../../lib/constants";

const ABOUT_ITEMS = [
  { label: "Journey", text: PLACEHOLDERS.ABOUT.journey },
  { label: "Mindset", text: PLACEHOLDERS.ABOUT.mindset },
  { label: "Goals", text: PLACEHOLDERS.ABOUT.goals },
];

export function AboutSection() {
  return (
    <SectionWrapper id={SECTION_IDS.about}>
      <SectionHeading eyebrow="About Me" title="Craft, curiosity, and a bias toward beautiful detail" />
      <div className="relative mx-auto max-w-4xl">
        {/* decorative orbiting accent behind the panel */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
          <div className="animate-orbit-spin relative h-[340px] w-[340px] max-w-full">
            <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[var(--color-cyan-glow)] shadow-[0_0_14px_3px_rgba(34,211,238,0.55)]" />
            <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[var(--color-nebula-purple)] shadow-[0_0_12px_3px_rgba(139,92,246,0.55)]" />
          </div>
        </div>

        <GlassPanel variant="panel">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {ABOUT_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1], delay: i * 0.12 }}
              >
                <span className="eyebrow">{item.label}</span>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-dim)]">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </SectionWrapper>
  );
}
