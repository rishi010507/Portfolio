import type { ComponentPropsWithoutRef } from "react";

type Variant = "panel" | "card" | "pill";
type Glow = "none" | "cyan" | "purple";

interface GlassPanelOwnProps {
  variant?: Variant;
  glow?: Glow;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  panel: "rounded-[var(--radius-lg)] p-8 md:p-12",
  card: "rounded-[var(--radius-md)] p-6 md:p-8",
  pill: "rounded-[var(--radius-pill)] px-5 py-2.5",
};

const glowClasses: Record<Glow, string> = {
  none: "",
  cyan: "shadow-[var(--glow-cyan)]",
  purple: "shadow-[var(--glow-purple)]",
};

export function GlassPanel({
  variant = "card",
  glow = "none",
  children,
  className = "",
  ...rest
}: GlassPanelOwnProps & ComponentPropsWithoutRef<"div">) {
  return (
    <div className={`glass-surface ${variantClasses[variant]} ${glowClasses[glow]} ${className}`} {...rest}>
      {children}
    </div>
  );
}
