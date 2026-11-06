"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect } from "react";
import { KARTU } from "./HeroJualan";

gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function format(v, el) {
  const d = Number(el.dataset.desimal || 0);
  const angka = v.toLocaleString("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d });
  return (el.dataset.awalan || "") + angka + (el.dataset.akhiran || "");
}

// Semua gerak beranda. Isi halaman sudah tampil utuh di HTML; skrip ini hanya menyembunyikan
// sebentar lalu memunculkan. Saat gerak dikurangi, tidak ada yang dijalankan.
export default function BerandaGerak() {
  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      { gerak: "(prefers-reduced-motion: no-preference)", lebar: "(min-width: 768px)", halus: "(pointer: fine)" },
      (ctx) => {
        const { gerak, lebar, halus } = ctx.conditions;
        if (!gerak) return;
        const jedaAwal = document.documentElement.classList.contains("pl-skip") ? 0.1 : 0.85;

        // Hero: judul tebal per kata, garis stabilo tergambar, lalu isian; di kanan kartu foto masuk.
        gsap.timeline({ defaults: { ease: "power3.out" }, delay: jedaAwal })
          .from(".g-eyelet", { y: 14, opacity: 0, duration: 0.5 })
          .from(".g-kata", { yPercent: 50, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.2")
          .from(".g-garis-bawah path", { strokeDasharray: 240, strokeDashoffset: 240, duration: 0.7, ease: "power2.inOut" }, "-=0.2")
          .from(".g-sub, .g-isian, .g-contoh", { y: 18, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.5")
          .from(".g-latar .v-huruf", { yPercent: 40, opacity: 0, duration: 0.9, stagger: 0.05 }, 0.3)
          .from(".v-kartu-belakang", { rotation: 0, xPercent: 0, opacity: 0, duration: 0.8 }, 0.6)
          .from(".v-kartu-depan", { rotation: -6, scale: 0.8, opacity: 0, duration: 0.9, ease: "back.out(1.4)" }, 0.7)
          .from(".v-pil", { y: 16, opacity: 0, duration: 0.6, stagger: 0.12 }, 1.1);

        // Pil melayang pelan; latar JUALAN dan kartu bergeser saat digulir.
        gsap.utils.toArray("[data-apung]").forEach((el, k) => {
          gsap.to(el, { y: k % 2 ? 8 : -8, duration: 3 + k * 0.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 });
        });
        gsap.to(".g-latar", {
          xPercent: -6, ease: "none",
          scrollTrigger: { trigger: ".g-hero", start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-v-tumpuk]", {
          yPercent: -14, rotation: 4, ease: "none",
          scrollTrigger: { trigger: ".g-hero", start: "top top", end: "bottom top", scrub: true },
        });

        // Kartu foto berganti tiap ~4 detik, berhenti saat hero di luar layar.
        const foto = gsap.utils.toArray(".v-kartu-depan img");
        const label = document.querySelector("[data-v-label]");
        const depan = document.querySelector(".v-kartu-depan");
        let i = 0;
        let jalan = true;
        const ganti = setInterval(() => {
          if (!jalan || document.hidden) return;
          foto[i].classList.remove("on");
          i = (i + 1) % foto.length;
          foto[i].classList.add("on");
          if (label) label.textContent = KARTU[i][2];
          gsap.fromTo(depan, { rotation: 4 }, { rotation: 9, duration: 0.9, ease: "power3.out" });
        }, 4200);
        ScrollTrigger.create({ trigger: ".g-hero", start: "top top", end: "bottom top", onToggle: (s) => (jalan = s.isActive) });

        // Tombol magnetik.
        const magnet = [];
        if (halus) {
          gsap.utils.toArray("[data-magnet]").forEach((el) => {
            const gerakkan = (e) => {
              const r = el.getBoundingClientRect();
              gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4, ease: "power3.out" });
            };
            const lepas = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.45)" });
            el.addEventListener("pointermove", gerakkan);
            el.addEventListener("pointerleave", lepas);
            magnet.push([el, gerakkan, lepas]);
          });
        }

        // Jendela produk membesar mengikuti gulir.
        gsap.fromTo("[data-pamer]", { scale: lebar ? 0.86 : 0.94, y: lebar ? 70 : 30 }, {
          scale: 1, y: 0, ease: "none",
          scrollTrigger: { trigger: ".b-pamer", start: "top 85%", end: "top 15%", scrub: 0.6 },
        });
        gsap.fromTo(".b-merek", { yPercent: 30 }, {
          yPercent: -10, ease: "none",
          scrollTrigger: { trigger: ".b-pamer", start: "top bottom", end: "bottom top", scrub: true },
        });

        // Demo hidup: coret, sorot, cetak per kata. Berulang, berhenti di luar layar.
        const demo = document.querySelector("[data-demo]");
        if (demo) {
          const q = gsap.utils.selector(demo);
          const hitung = q("[data-d-hitung]")[0];
          const n = { v: 0 };
          const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.6, paused: true, defaults: { ease: "power2.out" } });
          tl.set(q(".d-garis"), { scaleX: 0 })
            .set(q(".d-sapu"), { scaleX: 0 })
            .set(q(".d-no"), { scale: 0, opacity: 0 })
            .set(q(".d-catatan"), { opacity: 0 })
            .set(q(".d-struk"), { clipPath: "inset(0 0 100% 0)" })
            .set(q(".d-kata"), { opacity: 0, y: 6 })
            .set(q(".d-judul-hasil"), { opacity: 0.35 })
            .call(() => { n.v = 0; if (hitung) hitung.textContent = "0"; })
            .to(q(".d-garis")[0], { scaleX: 1, duration: 0.45 }, 0.6)
            .to(q(".d-coret")[0].querySelector(".d-no"), { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" }, ">-0.1")
            .to(q(".d-garis")[1], { scaleX: 1, duration: 0.45 }, ">0.15")
            .to(q(".d-coret")[1].querySelector(".d-no"), { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" }, ">-0.1")
            .to(q(".d-catatan"), { opacity: 1, duration: 0.3 }, ">")
            .to(q(".d-catatan .d-no"), { scale: 1, opacity: 1, duration: 0.25, stagger: 0.08 }, "<")
            .to(q(".d-sapu"), { scaleX: 1, duration: 0.4, stagger: 0.35, ease: "power1.inOut" }, ">0.1")
            .to(n, { v: 2, duration: 0.7, ease: "none", onUpdate: () => hitung && (hitung.textContent = String(Math.round(n.v))) }, "<")
            .to(q(".d-tombol"), { scale: 0.96, duration: 0.12, yoyo: true, repeat: 1 }, ">0.25")
            .to(q(".d-judul-hasil"), { opacity: 1, duration: 0.3 }, ">");
          q(".d-struk").forEach((s) => {
            tl.to(s, { clipPath: "inset(0 0 0% 0)", duration: 0.45, ease: "power2.inOut" }, ">0.05")
              .to(s.querySelectorAll(".d-kata"), { opacity: 1, y: 0, duration: 0.2, stagger: 0.045 }, ">-0.1");
          });
          tl.to({}, { duration: 2.6 }).to(q(".d-struk, .d-catatan"), { opacity: 0, duration: 0.4 })
            .set(q(".d-struk, .d-catatan"), { opacity: 1 });
          ScrollTrigger.create({
            trigger: demo, start: "top 90%", end: "bottom 10%",
            onToggle: (s) => (s.isActive ? tl.play() : tl.pause()),
          });
        }

        // Angka hitung naik saat terlihat.
        gsap.utils.toArray("[data-hitung]").forEach((el) => {
          const akhir = Number(el.dataset.hitung);
          const o = { v: 0 };
          el.textContent = format(0, el);
          ScrollTrigger.create({
            trigger: el, start: "top 88%", once: true,
            onEnter: () => gsap.to(o, { v: akhir, duration: 1.6, ease: "power2.out", onUpdate: () => (el.textContent = format(o.v, el)) }),
          });
        });

        // 100 titik terisi bertahap sampai 34.
        gsap.from(".titik-isi", {
          scale: 0, opacity: 0, duration: 0.35, stagger: 0.025, ease: "back.out(2)",
          scrollTrigger: { trigger: ".titik-grid", start: "top 85%", once: true },
        });

        // Pita marquee.
        gsap.to("[data-marquee]", { xPercent: -50, duration: lebar ? 40 : 55, ease: "none", repeat: -1 });

        // Muncul bertahap.
        const muncul = gsap.utils.toArray("[data-muncul]");
        gsap.set(muncul, { opacity: 0, y: 28 });
        ScrollTrigger.batch(muncul, {
          start: "top 88%",
          onEnter: (el) => gsap.to(el, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", overwrite: true }),
        });

        // "0 klaim karangan": hitung mundur dari 3.
        gsap.utils.toArray("[data-mundur]").forEach((el) => {
          const o = { v: Number(el.dataset.mundur) };
          el.textContent = String(o.v);
          ScrollTrigger.create({
            trigger: el, start: "top 85%", once: true,
            onEnter: () => gsap.to(o, { v: 0, duration: 1.4, delay: 0.3, ease: "power1.inOut", onUpdate: () => (el.textContent = String(Math.round(o.v))) }),
          });
        });

        // Foto kategori: parallax di dalam bingkai, tilt halus saat hover.
        gsap.utils.toArray(".b-siapa-grid .foto-slot img").forEach((img) => {
          gsap.fromTo(img, { yPercent: -7, scale: 1.16 }, {
            yPercent: 7, scale: 1.16, ease: "none",
            scrollTrigger: { trigger: img.closest(".foto-slot"), start: "top bottom", end: "bottom top", scrub: true },
          });
        });
        const tilt = [];
        if (halus) {
          gsap.utils.toArray("[data-tilt]").forEach((el) => {
            const gerakkan = (e) => {
              const r = el.getBoundingClientRect();
              gsap.to(el, {
                rotationX: ((e.clientY - r.top) / r.height - 0.5) * -6,
                rotationY: ((e.clientX - r.left) / r.width - 0.5) * 6,
                transformPerspective: 800, duration: 0.4, ease: "power2.out",
              });
            };
            const lepas = () => gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "power2.out" });
            el.addEventListener("pointermove", gerakkan);
            el.addEventListener("pointerleave", lepas);
            tilt.push([el, gerakkan, lepas]);
          });
        }

        ScrollTrigger.refresh();
        return () => {
          clearInterval(ganti);
          [...magnet, ...tilt].forEach(([el, a, b]) => {
            el.removeEventListener("pointermove", a);
            el.removeEventListener("pointerleave", b);
          });
        };
      },
    );

    return () => mm.revert();
  }, []);

  return null;
}
