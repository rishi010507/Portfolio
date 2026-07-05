import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_ITEMS, SECTION_IDS } from "../../lib/constants";
import { getLenis } from "../../lib/lenisConfig";
import { GlassButton } from "../ui/GlassButton";
import { PLACEHOLDERS } from "../../data/placeholders";
import { useScrollStore } from "../../store/scrollStore";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const activeSection = useScrollStore((s) => s.activeSection);

  function scrollToSection(id: string) {
    getLenis()?.scrollTo(`#${id}`, { offset: -20 });
    setOpen(false);
  }

  return (
    <>
      <motion.nav
        className="glass-surface fixed left-1/2 top-4 z-[var(--z-nav)] flex w-[min(1100px,92vw)] -translate-x-1/2 items-center justify-between rounded-[var(--radius-pill)] px-6 py-3"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 0.84, 0.44, 1], delay: 0.2 }}
      >
        <button
          className="font-[var(--font-display)] text-sm font-semibold tracking-widest text-[var(--color-soft-white)]"
          onClick={() => scrollToSection(SECTION_IDS.hero)}
          data-cursor-hover
        >
          {PLACEHOLDERS.NAME}
        </button>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id} className="relative">
                <button
                  className={`relative text-sm transition-colors ${
                    isActive ? "text-[var(--color-soft-white)]" : "text-[var(--text-dim)] hover:text-[var(--color-soft-white)]"
                  }`}
                  onClick={() => scrollToSection(item.id)}
                  data-cursor-hover
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-[var(--color-cyan-glow)] to-[var(--color-nebula-purple)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:block">
          <GlassButton variant="glass" onClick={() => scrollToSection(SECTION_IDS.contact)}>
            Let&apos;s Talk
          </GlassButton>
        </div>

        <button
          className="flex flex-col gap-1.5 p-2 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          data-cursor-hover
        >
          <span className="h-0.5 w-5 bg-white" />
          <span className="h-0.5 w-5 bg-white" />
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="glass-surface fixed inset-x-4 top-20 z-[var(--z-nav)] flex flex-col gap-4 rounded-[var(--radius-md)] p-6 md:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 0.84, 0.44, 1] }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className="text-left text-base text-[var(--text-dim)]"
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
