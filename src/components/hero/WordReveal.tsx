import { motion } from "framer-motion";

interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
  /** "mount" plays immediately (use for always-visible hero content); "inView" waits for scroll. */
  mode?: "mount" | "inView";
}

export function WordReveal({ text, className = "", delay = 0, once = true, mode = "inView" }: WordRevealProps) {
  const words = text.split(" ");
  const revealState = { y: "0%", opacity: 1, filter: "blur(0px)" };

  return (
    <span className={className}>
      {words.map((word, i) => {
        const revealProps =
          mode === "mount"
            ? { animate: revealState }
            : { whileInView: revealState, viewport: { once, margin: "-10% 0px" } };

        return (
          <span key={i} className="inline-block overflow-hidden pb-1 pr-[0.28em]">
            <motion.span
              className="inline-block"
              initial={{ y: "110%", opacity: 0, filter: "blur(6px)" }}
              {...revealProps}
              transition={{ duration: 0.7, ease: [0.16, 0.84, 0.44, 1], delay: delay + i * 0.045 }}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
