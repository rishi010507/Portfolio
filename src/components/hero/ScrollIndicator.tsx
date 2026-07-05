export function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[var(--text-dim)]">
      <span className="text-[0.65rem] uppercase tracking-[0.3em]">Scroll</span>
      <span className="flex h-10 w-6 justify-center rounded-full border border-white/25 pt-2">
        <span
          className="h-1.5 w-1.5 rounded-full bg-[var(--color-cyan-glow)]"
          style={{ animation: "scrollDown 1.6s ease infinite" }}
        />
      </span>
    </div>
  );
}
