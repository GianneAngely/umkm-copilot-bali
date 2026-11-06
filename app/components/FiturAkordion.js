"use client";

import { useEffect, useRef, useState } from "react";

const IKON = {
  doc: <path d="M6 4h9l3 3v13H6z M9 10h6 M9 14h6" />,
  tag: <path d="M5 9h14 M5 15h14 M10 4 8 20 M16 4l-2 16" />,
  harga: <path d="M4 12l8-8h8v8l-8 8z M15.5 8.5h.01" />,
  globe: <><circle cx="12" cy="12" r="8" /><path d="M4 12h16 M12 4a12 12 0 0 1 0 16 M12 4a12 12 0 0 0 0 16" /></>,
};

const FITUR = [
  {
    ikon: "doc", judul: "Deskripsi jujur", ket: "singkat + bercerita",
    teks: <>Dua versi: singkat untuk kolom marketplace, bercerita untuk Instagram. Klaim seperti <span className="coret-statis">enak murah</span> dicoret, fakta Anda seperti <mark>susu sapi asli</mark> dipakai apa adanya.</>,
    tag: "MARKETPLACE · INSTAGRAM · STABILO FAKTA",
  },
  {
    ikon: "tag", judul: "Caption + hashtag", ket: "8–12 tagar khas Bali",
    teks: "Caption siap tempel di Instagram atau WhatsApp, lengkap dengan ajakan membeli dan hashtag campuran umum dan khas Bali.",
    tag: "INSTAGRAM · WHATSAPP · #OLEHOLEHBALI",
  },
  {
    ikon: "harga", judul: "Saran harga", ket: "modal × margin + alasan",
    teks: "Rentang harga jual dihitung dari modal dan target pembeli. Alasannya ditulis singkat supaya Anda bisa menimbang sendiri.",
    tag: "MODAL · TARGET PEMBELI · ALASAN",
  },
  {
    ikon: "globe", judul: "Versi Inggris", ket: "untuk wisatawan",
    teks: "Deskripsi dan caption dalam Bahasa Inggris, ditulis ulang untuk wisatawan dan bukan terjemahan kata per kata.",
    tag: "INDONESIA ⇄ INGGRIS",
  },
];

// Akordion yang berganti sendiri pelan selama terlihat dan belum disentuh.
export default function FiturAkordion() {
  const [buka, setBuka] = useState(0);
  const [disentuh, setDisentuh] = useState(false);
  const akar = useRef(null);

  useEffect(() => {
    if (disentuh || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let terlihat = false;
    const io = new IntersectionObserver(([e]) => (terlihat = e.isIntersecting), { threshold: 0.3 });
    io.observe(akar.current);
    const t = setInterval(() => terlihat && !document.hidden && setBuka((b) => (b + 1) % FITUR.length), 4800);
    return () => { clearInterval(t); io.disconnect(); };
  }, [disentuh]);

  const sentuh = () => setDisentuh(true);

  return (
    <ul className="ak" ref={akar} onPointerEnter={sentuh} onFocus={sentuh}>
      {FITUR.map((f, i) => {
        const terbuka = buka === i;
        return (
          <li key={f.judul} className={terbuka ? "ak-item buka" : "ak-item"}>
            <h3>
              <button type="button" className="ak-tombol" aria-expanded={terbuka} aria-controls={`ak-${i}`} id={`ak-t-${i}`}
                onClick={() => { sentuh(); setBuka(terbuka ? -1 : i); }}>
                <span className="ak-ikon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{IKON[f.ikon]}</svg>
                </span>
                <span className="ak-judul">{f.judul}</span>
                <span className="titik" aria-hidden="true" />
                <span className="ak-ket">{f.ket}</span>
              </button>
            </h3>
            <div className="ak-isi" id={`ak-${i}`} role="region" aria-labelledby={`ak-t-${i}`} aria-hidden={!terbuka}>
              <div>
                <p>{f.teks}</p>
                <p className="ak-tag">{f.tag}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
