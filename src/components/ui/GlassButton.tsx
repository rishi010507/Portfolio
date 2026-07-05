import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { MagneticWrap } from "./MagneticWrap";

type CommonProps = {
  variant?: "primary" | "outline" | "glass";
  children: ReactNode;
};

/** Framer Motion redefines these handlers with its own event signature. */
type MotionConflicting = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd";

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, MotionConflicting> & { as?: "button" };
type AnchorProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, MotionConflicting> & { as: "a" };

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[var(--radius-pill)] px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300";

const shimmer = (
  <span
    aria-hidden="true"
    className="light-sweep pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-60"
  />
);

const variants = {
  primary:
    "bg-gradient-to-r from-[var(--color-cyan-glow)] to-[var(--color-nebula-purple)] text-[#05060f] font-semibold shadow-[0_10px_40px_-10px_rgba(139,92,246,0.55)]",
  outline:
    "border border-[var(--glass-border)] bg-white/[0.03] text-[var(--color-soft-white)] backdrop-blur-md hover:border-[var(--color-cyan-glow)]",
  glass: "glass-surface !rounded-[var(--radius-pill)] px-6 py-2.5 text-[var(--color-soft-white)]",
};

export function GlassButton(props: ButtonProps | AnchorProps) {
  const { variant = "primary", children, className = "", ...rest } = props;
  const classes = `${base} ${variants[variant]} ${className}`;

  const content =
    props.as === "a" ? (
      <motion.a
        {...(rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, MotionConflicting>)}
        className={classes}
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {children}
        {shimmer}
      </motion.a>
    ) : (
      <motion.button
        {...(rest as Omit<ButtonHTMLAttributes<HTMLButtonElement>, MotionConflicting>)}
        className={classes}
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {children}
        {shimmer}
      </motion.button>
    );

  return <MagneticWrap strength={0.25}>{content}</MagneticWrap>;
}
