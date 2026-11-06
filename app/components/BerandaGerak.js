"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function format(v, el) {
  const d = Number(el.dataset.desimal || 0);
  const angka = v.toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d });
  return (el.dataset.awalan || "") + angka + (el.dataset.akhiran || "");
}

// Gerak beranda, seperlunya: intro hero, struk tercetak lalu disunting, muncul per bagian,
// angka hitung naik. Isi sudah utuh di HTML; saat gerak dikurangi tidak ada yang dijalankan.
export default function BerandaGerak() {
  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-intro]", { y: 22, opacity: 0, duration: 0.7, stagger: 0.09, ease: "power3.out", delay: 0.1 });

      // Struk: tercetak dari atas, isi muncul, AI menyunting, hasil, total, cap. Diputar sekali,
      // lalu bisa diputar ulang dengan klik.
      const struk = document.querySelector("[data-struk]");
      if (struk) {
        const q = gsap.utils.selector(struk);
        const tl = gsap.timeline({ delay: 0.35, defaults: { ease: "power2.out" } })
          .from(struk, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "power2.inOut" })
          .from(q('[data-s="kepala"]'), { opacity: 0, y: 6, duration: 0.3, stagger: 0.08 }, "-=0.45")
          .from(q('[data-s="isi"]'), { opacity: 0, x: -8, duration: 0.3, stagger: 0.12 }, ">")
          .from(q('[data-s="ai"]'), { opacity: 0, scaleX: 0.6, duration: 0.4 }, ">0.2")
          .from(q('[data-s="coret"]'), { scaleX: 0, duration: 0.45 }, ">0.1")
          .from(q('[data-s="sapu"]'), { scaleX: 0, duration: 0.4, stagger: 0.25, ease: "power1.inOut" }, ">0.05")
          .from(q('[data-s="hasil"]'), { opacity: 0, x: -8, duration: 0.3, stagger: 0.14 }, ">0.1")
          .from(q('[data-s="total"]'), { opacity: 0, y: 8, duration: 0.4, stagger: 0.1 }, ">0.1")
          .from(q('[data-s="cap"]'), { opacity: 0, scale: 1.8, rotation: -24, duration: 0.45, ease: "back.out(1.6)" }, ">0.1");
        const ulang = () => tl.restart(true);
        struk.addEventListener("click", ulang);
        struk.style.cursor = "pointer";
        struk.title = "Klik untuk memutar ulang";
      }

      const muncul = gsap.utils.toArray("[data-muncul]");
      gsap.set(muncul, { opacity: 0, y: 24 });
      ScrollTrigger.batch(muncul, {
        start: "top 88%",
        onEnter: (el) => gsap.to(el, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", overwrite: true }),
      });

      gsap.utils.toArray("[data-hitung]").forEach((el) => {
        const akhir = Number(el.dataset.hitung);
        const o = { v: 0 };
        el.textContent = format(0, el);
        ScrollTrigger.create({
          trigger: el, start: "top 90%", once: true,
          onEnter: () => gsap.to(o, { v: akhir, duration: 1.4, ease: "power2.out", onUpdate: () => (el.textContent = format(o.v, el)) }),
        });
      });

      gsap.from(".titik-isi", {
        scale: 0, opacity: 0, duration: 0.3, stagger: 0.02, ease: "back.out(2)",
        scrollTrigger: { trigger: ".titik-grid", start: "top 88%", once: true },
      });

      ScrollTrigger.refresh();
    });
    return () => mm.revert();
  }, []);

  return null;
}
