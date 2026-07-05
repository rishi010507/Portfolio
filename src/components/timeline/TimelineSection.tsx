import { useEffect, useRef } from "react";
import { SectionWrapper } from "../layout/SectionWrapper";
import { SectionHeading } from "../ui/SectionHeading";
import { TimelineMilestone } from "./TimelineMilestone";
import { timeline } from "../../data/timeline.data";
import { SECTION_IDS } from "../../lib/constants";
import { gsap } from "../../lib/gsapConfig";

export function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !lineRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionWrapper id={SECTION_IDS.timeline}>
      <SectionHeading
        eyebrow="Journey"
        title="From curiosity to craft"
        subtitle="Even early in the path, every step compounds."
      />
      <div ref={containerRef} className="relative mx-auto max-w-2xl">
        <div className="absolute left-[7px] top-1 h-[calc(100%-8px)] w-px bg-white/10" />
        <div
          ref={lineRef}
          className="absolute left-[7px] top-1 h-[calc(100%-8px)] w-px origin-top bg-gradient-to-b from-[var(--color-cyan-glow)] to-[var(--color-nebula-purple)]"
        />
        <div className="flex flex-col gap-12">
          {timeline.map((milestone, i) => (
            <TimelineMilestone key={milestone.id} milestone={milestone} index={i} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
