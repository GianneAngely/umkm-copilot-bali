"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const EASE = "expo.out";
const ribu = (v) => Math.round(v / 1000) * 1000;

function format(v, el) {
  const d = Number(el.dataset.desimal || 0);
  const angka = v.toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d });
  return (el.dataset.awalan || "") + angka + (el.dataset.akhiran || "");
}

// Semua gerak landing. Isi sudah ada di HTML; CSS menyembunyikan elemen yang akan dianimasikan
// hanya kalau <html> berkelas "js" dan gerak tidak dikurangi, lalu skrip ini memunculkannya.
export default function BerandaGerak() {
  useIsoLayoutEffect(() => {
    window.__gerak = true;
    const mm = gsap.matchMedia();

    mm.add({ gerak: "(prefers-reduced-motion: no-preference)", lebar: "(min-width: 960px)", halus: "(pointer: fine)" }, (ctx) => {
      const { gerak, lebar, halus } = ctx.conditions;
      if (!gerak) return;

      // Hero: kicker, judul per kata, garis kunyit tergambar, lalu isi lain.
      gsap.timeline({ defaults: { ease: EASE }, delay: 0.05 })
        .to(".hero .kicker", { opacity: 1, y: 0, duration: 0.75 })
        .to(".hero .hk", { opacity: 1, y: 0, yPercent: 0, duration: 0.9, stagger: 0.075 }, "-=0.5")
        .fromTo(".hero .kunci path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, "-=0.35")
        .to(".hero [data-intro]:not(.kicker)", { opacity: 1, y: 0, duration: 0.75, stagger: 0.075 }, "-=0.6")
        .from(".hero-foto", { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "power3.inOut" }, 0.1);

      // Nota: cetak dari atas, baris muncul seperti printer, sinar pindai, coret, stabilo,
      // hasil, harga hitung naik, cap turun. Berulang pelan, berhenti di luar layar.
      const nota = document.querySelector("[data-nota]");
      if (nota) {
        const q = gsap.utils.selector(nota);
        const min = q('[data-n="min"]')[0];
        const max = q('[data-n="max"]')[0];
        const h = { a: 0, b: 0 };
        const tulisHarga = () => {
          min.textContent = ribu(h.a).toLocaleString("id-ID");
          max.textContent = ribu(h.b).toLocaleString("id-ID");
        };
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 3, paused: true, defaults: { ease: "power2.out" } });
        tl.set(nota, { clipPath: "inset(0 0 100% 0)" })
          .set(q('[data-n="baris"], [data-n="hasil"], [data-n="scan"], [data-n="total"]'), { opacity: 0, y: 6 })
          .set(q('[data-n="coret"], [data-n="sapu"]'), { scaleX: 0 })
          .set(q('[data-n="cap"]'), { opacity: 0, y: -40, scale: 1.5 })
          .set(q('[data-n="sinar"]'), { yPercent: -100, opacity: 0 })
          .call(() => { h.a = 0; h.b = 0; tulisHarga(); })
          .to(nota, { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "power2.inOut" })
          .to(q('[data-n="baris"]'), { opacity: 1, y: 0, duration: 0.18, stagger: 0.11, ease: "steps(3)" }, "-=0.75")
          .to(q('[data-n="sinar"]'), { opacity: 1, duration: 0.1 }, ">0.1")
          .to(q('[data-n="sinar"]'), { yPercent: 620, duration: 1.3, ease: "power1.inOut" }, "<")
          .to(q('[data-n="sinar"]'), { opacity: 0, duration: 0.2 }, ">-0.2")
          .to(q('[data-n="coret"]'), { scaleX: 1, duration: 0.42, stagger: 0.3 }, "<-0.9")
          .to(q('[data-n="sapu"]'), { scaleX: 1, duration: 0.4, stagger: 0.25, ease: "power1.inOut" }, ">0.05")
          .to(q('[data-n="scan"]'), { opacity: 1, y: 0, duration: 0.3 }, ">0.1")
          .to(q('[data-n="hasil"]'), { opacity: 1, y: 0, duration: 0.25, stagger: 0.12, ease: "steps(3)" }, ">")
          .to(q('[data-n="total"]'), { opacity: 1, y: 0, duration: 0.35, stagger: 0.1 }, ">0.1")
          .to(h, { a: 27000, b: 35000, duration: 1, ease: "power2.out", onUpdate: tulisHarga }, "<")
          .to(q('[data-n="cap"]'), { opacity: 0.92, y: 0, scale: 1, duration: 0.65, ease: "back.out(2.2)" }, ">-0.3")
          .to({}, { duration: 3.2 })
          .to(nota, { opacity: 0, duration: 0.45 })
          .set(nota, { opacity: 1 });
        ScrollTrigger.create({ trigger: nota, start: "top 95%", end: "bottom 5%", onToggle: (s) => (s.isActive ? tl.play() : tl.pause()) });
        const ulang = () => tl.restart();
        nota.addEventListener("click", ulang);
        ctx.add(() => () => nota.removeEventListener("click", ulang));
      }

      // Stempel kepala bagian: dicap, sedikit memantul.
      gsap.utils.toArray("[data-pemisah]").forEach((el) => {
        gsap.fromTo(el, { opacity: 0, scale: 1.5, rotation: -10 }, {
          opacity: 1, scale: 1, rotation: -3, duration: 0.6, ease: "back.out(2)",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      // Ornamen garis tergambar saat masuk layar.
      gsap.utils.toArray("[data-ornamen]").forEach((svg) => {
        const garis = svg.querySelectorAll("path");
        garis.forEach((p) => { const n = p.getTotalLength ? p.getTotalLength() : 300; p.style.strokeDasharray = n; p.style.strokeDashoffset = n; });
        gsap.to(garis, { strokeDashoffset: 0, duration: 1.6, stagger: 0.15, ease: "power2.inOut", scrollTrigger: { trigger: svg, start: "top 92%", once: true } });
      });

      // Muncul per elemen, bertahap.
      ScrollTrigger.batch("[data-muncul]", {
        start: "top 92%",
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.75, stagger: 0.075, ease: EASE, overwrite: true }),
      });

      gsap.utils.toArray(".hitung .titik").forEach((t) => {
        gsap.fromTo(t, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: t, start: "top 90%", once: true } });
      });

      // Angka data hitung naik, lalu 100 titik terisi sampai 34.
      gsap.utils.toArray("[data-hitung]").forEach((el) => {
        const akhir = Number(el.dataset.hitung);
        const o = { v: 0 };
        el.textContent = format(0, el);
        ScrollTrigger.create({
          trigger: el, start: "top 90%", once: true,
          onEnter: () => gsap.to(o, { v: akhir, duration: 1.4, ease: "power2.out", onUpdate: () => (el.textContent = format(o.v, el)) }),
        });
      });
      gsap.from(".seratus-grid .isi", {
        scale: 0, opacity: 0, duration: 0.3, stagger: 0.02, ease: "back.out(2)",
        scrollTrigger: { trigger: ".seratus-grid", start: "top 88%", once: true },
      });

      // Foto kategori bergeser pelan di dalam bingkai.
      gsap.utils.toArray(".siapa-foto img").forEach((img) => {
        gsap.fromTo(img, { yPercent: -6, scale: 1.14 }, {
          yPercent: 6, scale: 1.14, ease: "none",
          scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      // Galeri nota: dipaku dan bergeser mendatar di layar lebar.
      const galeri = document.querySelector("[data-galeri]");
      const jalur = document.querySelector("[data-galeri-jalur]");
      if (lebar && galeri && jalur) {
        const jarak = () => Math.max(0, jalur.scrollWidth - galeri.clientWidth);
        if (jarak() > 0) {
          gsap.to(jalur, {
            x: () => -jarak(), ease: "none",
            scrollTrigger: { trigger: galeri, start: "center center", end: () => "+=" + jarak(), pin: true, scrub: 0.6, invalidateOnRefresh: true },
          });
        }
      }

      // Tombol magnetik.
      if (halus) {
        gsap.utils.toArray("[data-magnet]").forEach((el) => {
          const gerakkan = (e) => {
            const r = el.getBoundingClientRect();
            gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.22, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4, ease: "power3.out" });
          };
          const lepas = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.45)" });
          el.addEventListener("pointermove", gerakkan);
          el.addEventListener("pointerleave", lepas);
          ctx.add(() => () => { el.removeEventListener("pointermove", gerakkan); el.removeEventListener("pointerleave", lepas); });
        });
      }

      ScrollTrigger.refresh();
    });

    return () => mm.revert();
  }, []);

  return null;
}
