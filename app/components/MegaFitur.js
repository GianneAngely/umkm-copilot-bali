"use client";

import { useEffect, useId, useRef, useState } from "react";
import { BAWAH_FITUR, IKON_FITUR, KOLOM_FITUR } from "../data/fitur";

function Ikon({ nama }) {
  return (
    <span className="mf-ikon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{IKON_FITUR[nama]}</svg>
    </span>
  );
}

/**
 * Mega menu "Semua fitur". Di layar lebar panel turun di bawah pemicu, di HP menjadi lembar layar penuh.
 * onPilih(id) opsional: kalau ada (di /app), item menjadi tombol; kalau tidak, tautan ke /app#id.
 */
export default function MegaFitur({ label = "Fitur", className = "", onPilih }) {
  const [buka, setBuka] = useState(false);
  const wadah = useRef(null);
  const pemicu = useRef(null);
  const panel = useRef(null);
  const id = useId();

  useEffect(() => {
    if (!buka) return;
    const luar = (e) => !wadah.current?.contains(e.target) && setBuka(false);
    const tombol = (e) => {
      if (e.key === "Escape") {
        setBuka(false);
        pemicu.current?.focus();
      }
    };
    document.addEventListener("pointerdown", luar);
    document.addEventListener("keydown", tombol);
    requestAnimationFrame(() => panel.current?.querySelector(".mf-item")?.focus());
    const hp = window.matchMedia("(max-width: 719px)").matches;
    if (hp) document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("pointerdown", luar);
      document.removeEventListener("keydown", tombol);
      document.documentElement.style.overflow = "";
    };
  }, [buka]);

  // Fokus keluar dari panel dengan Tab: panel ditutup.
  function fokusKeluar(e) {
    if (!wadah.current?.contains(e.relatedTarget)) setBuka(false);
  }

  function Item({ f, kecil }) {
    const isi = (
      <>
        <Ikon nama={f.ikon} />
        <span className="mf-teks">
          <b>{f.nama}{f.baru && <em className="mf-baru">Baru</em>}</b>
          {!kecil && <small>{f.ket}</small>}
        </span>
      </>
    );
    const tutup = () => setBuka(false);
    return onPilih ? (
      <button type="button" className="mf-item" onClick={() => { tutup(); onPilih(f.id); }}>{isi}</button>
    ) : (
      <a className="mf-item" href={`/app#${f.id}`} onClick={tutup}>{isi}</a>
    );
  }

  return (
    <div className={`mf ${className}`} ref={wadah} onBlur={fokusKeluar}>
      <button ref={pemicu} type="button" className="mf-pemicu" aria-expanded={buka} aria-controls={id} onClick={() => setBuka(!buka)}>
        {label}
        <svg className="mf-panah" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <div id={id} ref={panel} className="mf-panel" hidden={!buka} role="region" aria-label="Semua fitur Wicara">
        <div className="mf-kepala-hp">
          <p>Semua fitur</p>
          <button type="button" className="mf-tutup" onClick={() => { setBuka(false); pemicu.current?.focus(); }} aria-label="Tutup daftar fitur">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div className="mf-kolom">
          {KOLOM_FITUR.map((k) => (
            <section key={k.judul}>
              <h3>{k.judul}</h3>
              <ul>
                {k.item.map((f) => <li key={f.id}><Item f={f} /></li>)}
              </ul>
            </section>
          ))}
        </div>
        <ul className="mf-bawah">
          {BAWAH_FITUR.map((f) => <li key={f.id}><Item f={f} kecil /></li>)}
        </ul>
      </div>
    </div>
  );
}
