import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PLACEHOLDERS } from "../../data/placeholders";

export function RotatingSubtitle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PLACEHOLDERS.ROLE_TITLES.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-grid place-items-center align-bottom">
      {PLACEHOLDERS.ROLE_TITLES.map((title, i) => (
        <motion.span
          key={title}
          className="text-gradient col-start-1 row-start-1 inline-block whitespace-nowrap font-[var(--font-display)] font-medium"
          animate={{ opacity: i === index ? 1 : 0, y: i === index ? 0 : 10 }}
          transition={{ duration: 0.5, ease: [0.16, 0.84, 0.44, 1] }}
        >
          {title}
        </motion.span>
      ))}
    </span>
  );
}
