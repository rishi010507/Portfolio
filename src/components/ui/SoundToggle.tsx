import { useAmbientSpaceSound } from "../../hooks/useAmbientSpaceSound";

export function SoundToggle() {
  const { enabled, toggle } = useAmbientSpaceSound();

  return (
    <button
      onClick={toggle}
      aria-label={enabled ? "Mute ambient sound" : "Play ambient sound"}
      aria-pressed={enabled}
      data-cursor-hover
      className="glass-surface fixed bottom-6 right-6 z-[var(--z-nav)] flex h-12 w-12 items-center justify-center !rounded-full text-[var(--color-soft-white)] transition-colors hover:border-[var(--color-cyan-glow)]"
    >
      {enabled ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
