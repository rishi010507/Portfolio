import type { ReactNode } from "react";

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function SectionWrapper({ id, children, className = "" }: SectionWrapperProps) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-6xl px-6 py-28 md:py-36 ${className}`}>
      {children}
    </section>
  );
}
