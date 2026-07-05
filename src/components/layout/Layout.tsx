import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollProgressBar } from "./ScrollProgressBar";
import { SoundToggle } from "../ui/SoundToggle";
import { CustomCursor } from "../cursor/CustomCursor";
import { CanvasRoot } from "../../three/CanvasRoot";
import { GalaxyScene } from "../../three/GalaxyScene";
import { useLenis } from "../../hooks/useLenis";
import { useActiveSection } from "../../hooks/useActiveSection";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useLenis();
  useActiveSection();

  return (
    <>
      <CanvasRoot>
        <GalaxyScene />
      </CanvasRoot>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 130% 90% at 50% 42%, transparent 38%, rgba(2, 2, 10, 0.55) 100%), linear-gradient(to bottom, rgba(2,2,10,0.35), transparent 18%, transparent 82%, rgba(2,2,10,0.45))",
        }}
      />
      <CustomCursor />
      <ScrollProgressBar />
      <SoundToggle />
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
    </>
  );
}
