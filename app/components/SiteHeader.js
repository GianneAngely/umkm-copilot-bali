"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "./Icon";

const MENU = [
  ["#masalah", "Masalah"],
  ["#cara-kerja", "Cara kerja"],
  ["#fitur", "Fitur"],
  ["#contoh", "Contoh"],
];

export default function SiteHeader() {
  const [menyusut, setMenyusut] = useState(false);
  const [buka, setBuka] = useState(false);

  // Navbar menyusut setelah halaman digulir.
  useEffect(() => {
    const cek = () => setMenyusut(window.scrollY > 24);
    cek();
    window.addEventListener("scroll", cek, { passive: true });
    return () => window.removeEventListener("scroll", cek);
  }, []);

  useEffect(() => {
    if (!buka) return;
    const esc = (e) => e.key === "Escape" && setBuka(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [buka]);

  return (
    <header className={`nav${menyusut ? " is-gulir" : ""}${buka ? " is-buka" : ""}`}>
      <a className="skip" href="#isi">Langsung ke isi</a>
      <div className="wrap nav-bar">
        <Link className="merek" href="/" aria-label="Wicara, ke atas">Wicara<i aria-hidden="true" /></Link>
        <nav className="nav-links" aria-label="Navigasi utama">
          {MENU.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <div className="nav-kanan">
          <Link className="nav-cta" href="/app">Buka app <span className="panah">→</span></Link>
          <button type="button" className="nav-toggle" aria-expanded={buka} aria-controls="menu-hp"
            aria-label={buka ? "Tutup menu" : "Buka menu"} onClick={() => setBuka(!buka)}>
            <Icon name={buka ? "close" : "menu"} />
          </button>
        </div>
      </div>
      <nav id="menu-hp" className="menu-hp" aria-label="Navigasi utama" hidden={!buka}>
        {MENU.map(([href, label]) => <a key={href} href={href} onClick={() => setBuka(false)}>{label}</a>)}
        <Link className="btn-hijau" href="/app">Buka app <span className="panah">→</span></Link>
      </nav>
    </header>
  );
}
