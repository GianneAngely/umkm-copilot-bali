"use client";

import { useRef, useState } from "react";
import s from "./fitur.module.css";

const LEBAR_MAKS = 1280;

// Perkecil foto di browser sebelum dikirim: sisi terpanjang paling besar 1280 px, JPEG.
async function kompres(file) {
  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("Foto tidak bisa dibuka. Gunakan foto JPEG atau PNG.");
  }
  const skala = Math.min(1, LEBAR_MAKS / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * skala);
  canvas.height = Math.round(bitmap.height * skala);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise((ok) => canvas.toBlob(ok, "image/jpeg", 0.85));
  if (!blob) throw new Error("Foto gagal diproses. Coba foto lain.");
  return blob;
}

/**
 * Tombol "Isi dari foto": pengguna memotret atau memilih foto produk,
 * AI membaca foto, lalu hasilnya dikirim lewat onIsi({ nama, kategori, keunggulan }).
 * onFoto(objectUrl) opsional, misalnya untuk dipakai ulang di PostinganIG.
 */
export default function FotoKeForm({ onIsi, onFoto }) {
  const kamera = useRef(null);
  const galeri = useRef(null);
  const [pratinjau, setPratinjau] = useState("");
  const [memuat, setMemuat] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(null);

  async function pilih(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setInfo(null);
    setMemuat(true);
    try {
      const blob = await kompres(file);
      const url = URL.createObjectURL(blob);
      if (pratinjau) URL.revokeObjectURL(pratinjau);
      setPratinjau(url);
      onFoto?.(url);

      const body = new FormData();
      body.append("foto", blob, "foto.jpg");
      const res = await fetch("/api/foto", { method: "POST", body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Foto gagal dibaca. Coba lagi.");

      const { nama, kategori, keunggulan, catatan_ketidakpastian } = json.result;
      onIsi?.({ nama, kategori, keunggulan });
      setInfo({ mode: json.mode, catatan: catatan_ketidakpastian });
    } catch (err) {
      setError(err.message);
    } finally {
      setMemuat(false);
    }
  }

  return (
    <div className={s.foto}>
      <div className={s.fotoBaris}>
        {pratinjau ? (
          <img className={s.pratinjau} src={pratinjau} alt="Foto produk yang dipilih" />
        ) : (
          <div className={s.pratinjauKosong} aria-hidden="true">foto</div>
        )}
        <div className={s.fotoAksi}>
          <p className={s.label}>Isi dari foto</p>
          <p className={s.bantu}>AI membaca foto produk lalu mengisi nama, kategori, dan keunggulan.</p>
          <div className={s.tombolBaris}>
            <button type="button" className={s.tombol} disabled={memuat} onClick={() => kamera.current.click()}>
              Ambil foto
            </button>
            <button type="button" className={s.tombolGaris} disabled={memuat} onClick={() => galeri.current.click()}>
              Pilih dari galeri
            </button>
          </div>
        </div>
      </div>

      <input ref={kamera} type="file" accept="image/*" capture="environment" hidden onChange={pilih} />
      <input ref={galeri} type="file" accept="image/jpeg,image/png,image/*" hidden onChange={pilih} />

      <div aria-live="polite">
        {memuat && (
          <p className={s.status} role="status">
            <span className={s.spinner} aria-hidden="true" /> Sedang membaca foto...
          </p>
        )}
        {error && <p className={s.error} role="alert">{error}</p>}
        {info && !memuat && (
          <div className={info.mode === "mock" ? s.catatanContoh : s.catatan}>
            {info.mode === "mock" && <strong>Mode contoh. </strong>}
            {info.mode === "ai" && <strong>Form sudah diisi dari foto. Periksa lagi sebelum lanjut. </strong>}
            {info.catatan}
          </div>
        )}
      </div>
    </div>
  );
}
