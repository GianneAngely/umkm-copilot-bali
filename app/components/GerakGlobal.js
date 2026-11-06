"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

// Berlaku di semua halaman: progress bar tipis di atas dan smooth scroll Lenis.
// Saat gerak dikurangi, Lenis tidak dipasang dan gulir tetap bawaan peramban.
export default function GerakGlobal() {
  const bar = useRef(null);
  const path = usePathname();

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (s) => bar.current && (bar.current.style.transform = `scaleX(${s.progress.toFixed(4)})`),
    });

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      window.lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        window.lenis = undefined;
      };
    });

    return () => {
      st.kill();
      mm.revert();
    };
  }, []);

  // Pindah halaman: mulai dari atas dan hitung ulang posisi ScrollTrigger.
  useEffect(() => {
    window.lenis?.scrollTo(0, { immediate: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [path]);

  return <div className="progres" aria-hidden="true"><span ref={bar} /></div>;
}
