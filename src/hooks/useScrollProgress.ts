import { useScrollStore } from "../store/scrollStore";

/** Reactive subscription to scroll progress — use sparingly (causes re-renders). */
export function useScrollProgress(): number {
  return useScrollStore((s) => s.progress);
}
