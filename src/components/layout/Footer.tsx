import { socialLinks } from "../../data/social.data";
import { PLACEHOLDERS } from "../../data/placeholders";

export function Footer() {
  return (
    <footer className="relative mx-auto w-full max-w-6xl px-6 pb-10 pt-16 text-center">
      <p className="font-[var(--font-display)] text-lg font-semibold text-[var(--color-soft-white)]">
        {PLACEHOLDERS.NAME}
      </p>
      <p className="mt-2 text-sm text-[var(--text-dim)]">Building immersive, modern frontend experiences.</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
        {socialLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className="text-sm text-[var(--text-dim)] transition-colors hover:text-[var(--color-cyan-glow)]"
            data-cursor-hover
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
          >
            {link.label}
          </a>
        ))}
      </div>
      <p className="mt-10 text-xs text-[var(--text-faint)]">
        &copy; {new Date().getFullYear()} {PLACEHOLDERS.NAME}. All rights reserved.
      </p>
    </footer>
  );
}
