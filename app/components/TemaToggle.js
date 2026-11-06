"use client";

import { useEffect, useState } from "react";

// Tema awal sudah dipasang skrip di <head> (lihat layout.js), jadi di sini cukup dibaca.
export default function TemaToggle() {
  const [gelap, setGelap] = useState(false);

  useEffect(() => setGelap(document.documentElement.dataset.theme === "dark"), []);

  function ganti() {
    const baru = gelap ? "light" : "dark";
    document.documentElement.dataset.theme = baru;
    try {
      localStorage.setItem("tema", baru);
    } catch {}
    setGelap(!gelap);
  }

  return (
    <button type="button" className="tema-toggle" onClick={ganti} aria-pressed={gelap} aria-label="Mode gelap">
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {gelap ? (
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        ) : (
          <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>
        )}
      </svg>
    </button>
  );
}
