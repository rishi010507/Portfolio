import { SectionWrapper } from "../layout/SectionWrapper";
import { WordReveal } from "../hero/WordReveal";
import { SectionHeading } from "../ui/SectionHeading";
import { PLACEHOLDERS } from "../../data/placeholders";
import { SECTION_IDS } from "../../lib/constants";

export function IntroSection() {
  return (
    <SectionWrapper id={SECTION_IDS.intro}>
      <SectionHeading eyebrow="Introduction" title="A developer who treats the browser like a canvas" />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 text-center">
        {PLACEHOLDERS.INTRO_PARAGRAPHS.map((p, i) => (
          <p key={i} className="text-[clamp(1.05rem,2vw,1.3rem)] leading-relaxed text-[var(--text-dim)]">
            <WordReveal text={p} />
          </p>
        ))}
      </div>
    </SectionWrapper>
  );
}
