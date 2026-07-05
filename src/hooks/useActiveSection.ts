import { useEffect } from "react";
import { useScrollStore } from "../store/scrollStore";
import { SECTION_IDS } from "../lib/constants";

const IDS: string[] = Object.values(SECTION_IDS);

/** Tracks which section is currently centered in the viewport for scrollspy nav highlighting. */
export function useActiveSection() {
  useEffect(() => {
    const elements = IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          useScrollStore.getState().setActiveSection(visible.target.id);
        }
      },
      { threshold: [0.2, 0.4, 0.6], rootMargin: "-35% 0px -35% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
