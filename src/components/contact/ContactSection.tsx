import { motion } from "framer-motion";
import { SectionWrapper } from "../layout/SectionWrapper";
import { SectionHeading } from "../ui/SectionHeading";
import { GlassPanel } from "../ui/GlassPanel";
import { SocialLinks } from "./SocialLinks";
import { PLACEHOLDERS } from "../../data/placeholders";
import { SECTION_IDS } from "../../lib/constants";

export function ContactSection() {
  return (
    <SectionWrapper id={SECTION_IDS.contact}>
      <SectionHeading
        eyebrow="Contact"
        title="Let's build something on another level"
        subtitle={`Reach out at ${PLACEHOLDERS.CONTACT_EMAIL}, or connect below.`}
      />
      <GlassPanel variant="panel" glow="cyan" className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 0.84, 0.44, 1] }}
          className="mx-auto flex w-fit flex-col items-center"
        >
          <div className="glass-surface rounded-[var(--radius-md)] p-4 shadow-[var(--glow-cyan)]">
            <img
              src="/images/linkedin-qr.png"
              alt="QR code linking to LinkedIn profile"
              width={180}
              height={180}
              className="rounded-[calc(var(--radius-md)-1rem)]"
            />
          </div>
          <span className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--text-dim)]">
            Scan to connect on LinkedIn
          </span>
        </motion.div>

        <div className="mt-10 border-t border-white/10 pt-8">
          <SocialLinks />
        </div>
      </GlassPanel>
    </SectionWrapper>
  );
}
