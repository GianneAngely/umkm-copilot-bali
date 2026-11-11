"use client";

import { useState } from "react";
import s from "./fitur.module.css";
import { mintaJson } from "../../../lib/klien";

// Bagian [isi sendiri: ...] diberi stabilo supaya penjual ingat melengkapinya.
function Teks({ isi }) {
  return String(isi)
    .split(/(\[[^\]]+\])/g)
    .map((b, i) => (/^\[[^\]]+\]$/.test(b) ? <mark key={i} className={s.chatIsi}>{b}</mark> : b));
}

function SalinBalasan({ teks }) {
  const [tersalin, setTersalin] = useState(false);
  async function salin() {
    try {
      await navigator.clipboard.writeText(teks);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 1500);
    } catch {}
  }
  return (
    <button type="button" className={s.tombolGaris} onClick={salin}>
      {tersalin ? "Tersalin" : "Salin balasan"}
    </button>
  );
}

/**
 * Template balasan WhatsApp untuk lima pertanyaan pembeli yang paling sering.
 * Props: produk { nama, kategori, keunggulan, target }, hasil (hasil /api/generate, dipakai harga dan deskripsi_singkat).
 */
export default function BalasChat({ produk, hasil }) {
  const [memuat, setMemuat] = useState(false);
  const [error, setError] = useState("");
  const [contoh, setContoh] = useState(null);
  const [data, setData] = useState(null);

  async function susun() {
    setMemuat(true);
    setError("");
    setContoh(null);
    try {
      setData(
        await mintaJson("/api/balasan", {
          produk,
          hasil: { harga: hasil?.harga, deskripsi_singkat: hasil?.deskripsi_singkat },
        }),
      );
    } catch (err) {
      setError(err.message);
      setContoh(err.contoh || null);
    } finally {
      setMemuat(false);
    }
  }

  return (
    <div className={s.chat}>
      <div className={s.kalKepala}>
        <div>
          <p className={s.label}>Balas chat pembeli</p>
          <p className={s.bantu}>Lima template balasan WhatsApp. Bagian yang distabilo perlu Anda isi sendiri.</p>
        </div>
        <button type="button" className={s.tombol} disabled={memuat || !produk?.nama} onClick={susun}>
          {memuat ? "Menyusun..." : data ? "Susun ulang" : "Susun balasan"}
        </button>
      </div>

      <div aria-live="polite">
        {memuat && (
          <p className={s.status} role="status">
            <span className={s.spinner} aria-hidden="true" /> Sedang menyusun balasan...
          </p>
        )}
        {error && <p className={s.error} role="alert">{error}</p>}
        {contoh && (
          <button type="button" className={s.tombolGaris} onClick={() => { setData({ mode: "mock", result: contoh }); setError(""); setContoh(null); }}>
            Lihat contoh balasan (Contoh)
          </button>
        )}
      </div>

      {data && (
        <>
          {data.mode === "mock" && (
            <p className={s.catatanContoh}>
              <strong>Mode contoh.</strong> API key belum dipasang, jadi balasan di bawah adalah template statis.
            </p>
          )}
          <ul className={s.chatDaftar}>
            {data.result.balasan.map((b) => (
              <li key={b.id} className={s.chatKartu}>
                <p className={s.chatJenis}>{b.label}</p>
                <div className={s.chatLayar} aria-label={`Pratinjau chat: ${b.label}`}>
                  <p className={s.gelembungMasuk} lang={b.id === "turis_en" ? "en" : undefined}>{b.pertanyaan}</p>
                  <p className={s.gelembungKeluar} lang={b.id === "turis_en" ? "en" : undefined}><Teks isi={b.balasan} /></p>
                </div>
                <SalinBalasan teks={b.balasan} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
