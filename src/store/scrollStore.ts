import { create } from "zustand";

interface ScrollState {
  /** Normalized 0..1 progress across the entire document, driven by ScrollTrigger. */
  progress: number;
  activeSection: string;
  setProgress: (progress: number) => void;
  setActiveSection: (id: string) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  activeSection: "hero",
  setProgress: (progress) => set({ progress }),
  setActiveSection: (id) => set({ activeSection: id }),
}));
