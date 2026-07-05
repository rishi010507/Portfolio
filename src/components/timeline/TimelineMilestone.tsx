import { motion } from "framer-motion";
import { GlassPanel } from "../ui/GlassPanel";
import type { TimelineMilestone as TimelineMilestoneType } from "../../types/timeline";

interface TimelineMilestoneProps {
  milestone: TimelineMilestoneType;
  index: number;
}

export function TimelineMilestone({ milestone, index }: TimelineMilestoneProps) {
  return (
    <div className="relative pl-10">
      <span className="absolute left-0 top-2 h-4 w-4">
        <span
          className="animate-ping-ring absolute inset-0 rounded-full border border-[var(--color-cyan-glow)]"
          style={{ animationDelay: `${index * 0.3}s` }}
        />
        <span className="absolute inset-0 rounded-full border-2 border-[var(--color-cyan-glow)] bg-[var(--color-deep-space)] shadow-[0_0_16px_2px_rgba(34,211,238,0.5)]" />
      </span>
      <motion.div
        initial={{ opacity: 0, x: -24, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1], delay: index * 0.05 }}
      >
        <GlassPanel variant="card">
          <div className="flex items-center justify-between gap-4">
            <span className="eyebrow">{milestone.period}</span>
            <span className="font-[var(--font-display)] text-xs text-[var(--text-faint)]">{milestone.index}</span>
          </div>
          <h3 className="mt-2 font-[var(--font-display)] text-lg font-semibold text-[var(--color-soft-white)]">
            {milestone.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-dim)]">{milestone.description}</p>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
