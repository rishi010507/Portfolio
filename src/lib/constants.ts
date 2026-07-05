export const SECTION_IDS = {
  hero: "hero",
  intro: "intro",
  projects: "projects",
  about: "about",
  timeline: "timeline",
  contact: "contact",
} as const;

export const NAV_ITEMS = [
  { id: SECTION_IDS.projects, label: "Projects" },
  { id: SECTION_IDS.about, label: "About" },
  { id: SECTION_IDS.timeline, label: "Journey" },
  { id: SECTION_IDS.contact, label: "Contact" },
] as const;

export const PALETTE = {
  deepSpace: "#050414",
  midnight: "#0a0e2e",
  nebulaPurple: "#8b5cf6",
  cyanGlow: "#22d3ee",
  electricBlue: "#3b82f6",
  softWhite: "#f4f5fb",
} as const;
