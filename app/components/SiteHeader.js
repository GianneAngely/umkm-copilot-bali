"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import TemaToggle from "./TemaToggle";

const MENU = [
  ["/", "Beranda"],
  ["/studio", "Studio"],
  ["/contoh", "Contoh"],
  ["/cara-kerja", "Cara kerja"],
  ["/tentang", "Tentang"],
];

export default function SiteHeader() {
  const path = usePathname();
  const [menyusut, setMenyusut] = useState(false);
  const [buka, setBuka] = useState(false);

  // Navbar menyusut jadi pil setelah halaman digulir.
  useEffect(() => {
    const cek = () => setMenyusut(window.scrollY > 24);
    cek();
    window.addEventListener("scroll", cek, { passive: true });
    return () => window.removeEventListener("scroll", cek);
  }, []);

  // Menu HP tertutup saat pindah halaman atau menekan Escape.
  useEffect(() => setBuka(false), [path]);
  useEffect(() => {
    if (!buka) return;
    const esc = (e) => e.key === "Escape" && setBuka(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [buka]);

  return (
    <header className={`nav nav-p${menyusut ? " is-gulir" : ""}${buka ? " is-buka" : ""}`}>
      <a className="skip" href="#isi">Langsung ke isi</a>
      <div className="nav-bar">
        <Link className="logo" href="/" aria-label="UMKM Copilot Bali, beranda">
          <i className="logo-mark" aria-hidden="true">U</i>
          <span className="logo-text">UMKM COPILOT</span>
        </Link>
        <nav className="nav-links" aria-label="Navigasi utama">
          {MENU.map(([href, label]) => (
            <Link key={href} href={href} className="nav-link" aria-current={path === href ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="nav-kanan">
          <TemaToggle />
          <Link className="btn btn-utama btn-sm nav-cta" href="/studio">BUKA STUDIO ↗</Link>
          <button type="button" className="nav-toggle" aria-expanded={buka} aria-controls="menu-hp"
            aria-label={buka ? "Tutup menu" : "Buka menu"} onClick={() => setBuka(!buka)}>
            <Icon name={buka ? "close" : "menu"} />
          </button>
        </div>
      </div>
      <nav id="menu-hp" className="menu-hp" aria-label="Navigasi utama" hidden={!buka}>
        {MENU.map(([href, label]) => (
          <Link key={href} href={href} aria-current={path === href ? "page" : undefined}>{label}</Link>
        ))}
        <Link className="btn btn-utama btn-lg" href="/studio">Buka Studio</Link>
      </nav>
    </header>
  );
}
