import { socialLinks } from "../../data/social.data";
import { MagneticWrap } from "../ui/MagneticWrap";

export function SocialLinks() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {socialLinks.map((link) => (
        <MagneticWrap key={link.id} strength={0.4}>
          <a
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            data-cursor-hover
            className="glass-surface flex items-center gap-2 !rounded-[var(--radius-pill)] px-5 py-2.5 text-sm text-[var(--color-soft-white)] transition-colors hover:border-[var(--color-cyan-glow)]"
          >
            {link.label}
          </a>
        </MagneticWrap>
      ))}
    </div>
  );
}
