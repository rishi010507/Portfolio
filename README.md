# Portfolio — Galaxy Glass Spaceship

A cinematic, glassmorphic 3D portfolio built with Vite + React + TypeScript, React Three Fiber, custom GLSL shaders, GSAP ScrollTrigger, Lenis smooth scroll, and Framer Motion.

## Run it

```bash
npm install
npm run dev
```

## Before you ship: replace the placeholder content

Everything below is placeholder data, centralized in `src/data/` so it's easy to find and swap.

- **`src/data/placeholders.ts`** — your name, role titles, hero tagline, intro paragraphs, about copy (journey/mindset/goals), contact email, location.
- **`src/data/projects.data.ts`** — real projects: titles (`PROJECT_1_TITLE` etc.), taglines, descriptions, tech stacks, live/repo URLs.
- **`src/data/skills.data.ts`** — adjust skill levels (0–100) to reflect your actual proficiency.
- **`src/data/timeline.data.ts`** — real dates/periods for each journey milestone (currently `PLACEHOLDER_YEAR`).
- **`src/data/social.data.ts`** — real GitHub/LinkedIn URLs (currently `YOUR_USERNAME`). The email defaults to the address you gave me during setup — change it if that's not the one you want public.
- **`index.html`** — page `<title>` and meta description currently say "YOUR NAME".

Run a search for `PLACEHOLDER`, `YOUR_NAME`, `YOUR_USERNAME`, and `PROJECT_` across `src/` to catch everything in one pass.

## Fonts

The spec asked for Satoshi / General Sans / Clash Display, which aren't freely available on Google Fonts. This build uses **Space Grotesk** (display/headings) + **Inter** (body) as a close, freely-licensed substitute, loaded in `index.html`. Swap in the originals via `@font-face` or a service like Fontshare if you have a license, then update `--font-display` / `--font-body` in `src/index.css`.

## Architecture notes

- **3D galaxy background**: `src/three/` (scene graph) + `src/shaders/` (GLSL). Density scales automatically by device via `src/hooks/usePerfTier.ts`.
- **Camera movement**: `src/three/CameraRig.tsx` reads scroll progress from `src/store/scrollStore.ts` (written by a single document-spanning GSAP ScrollTrigger in `src/hooks/useLenis.ts`) and dollies through waypoints tuned to each section's actual scroll offset.
- **Custom cursor**: `src/hooks/useCursor.ts` + `src/components/cursor/CustomCursor.tsx` — fully ref/GSAP-driven, zero React re-renders per pointer move. Desktop-only; falls back to the native cursor on touch devices and under `prefers-reduced-motion`.
- **Glassmorphism**: one `.glass-surface` primitive in `src/index.css` (wrapped in `@layer base`/`@layer components` so Tailwind utilities can still override it) plus a `GlassPanel` React wrapper — every card/panel in the site composes this single source.
