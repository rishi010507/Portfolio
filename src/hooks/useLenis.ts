import { useEffect } from "react";
import { gsap, ScrollTrigger } from "../lib/gsapConfig";
import { destroyLenis, initLenis } from "../lib/lenisConfig";
import { useScrollStore } from "../store/scrollStore";

/**
 * Bridges Lenis smooth-scroll with GSAP ScrollTrigger through a single shared
 * clock (gsap.ticker) and a scrollerProxy, so both agree on scroll position.
 * Also publishes normalized document scroll progress into scrollStore for
 * the R3F camera rig to read inside its own render loop.
 */
export function useLenis() {
  useEffect(() => {
    const lenis = initLenis();

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);

    lenis.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: document.body.style.transform ? "transform" : "fixed",
    });

    const progressTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        useScrollStore.getState().setProgress(self.progress);
      },
    });

    const refreshHandler = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", refreshHandler);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      ScrollTrigger.removeEventListener("refresh", refreshHandler);
      progressTrigger.kill();
      gsap.ticker.remove(onTick);
      destroyLenis();
    };
  }, []);
}
