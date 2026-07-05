import { motion } from "framer-motion";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

export function SectionHeading({ eyebrow, title, subtitle, align = "center" }: SectionHeadingProps) {
  return (
    <div className={`mx-auto mb-14 max-w-2xl ${align === "center" ? "text-center" : "text-left"}`}>
      <motion.span
        className="eyebrow mb-3 block"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1] }}
      >
        {eyebrow}
      </motion.span>
      <motion.h2
        className="font-[var(--font-display)] text-[clamp(1.9rem,4vw,2.8rem)] font-semibold tracking-tight text-[var(--color-soft-white)]"
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.7, ease: [0.16, 0.84, 0.44, 1], delay: 0.08 }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          className="mt-4 text-[var(--text-dim,#9aa2c7)] leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1], delay: 0.16 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
