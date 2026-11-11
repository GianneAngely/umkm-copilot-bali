"use client";

import { useEffect, useRef, useState } from "react";
import s from "./fitur.module.css";
import { MeterSkor } from "../Grafik";
import { kompres } from "./FotoKeForm";

const SISI_MAKS = 1600;
const batas = (n, min, max) => Math.min(max, Math.max(min, Number(n) || 0));

// Kotak potong relatif 0-1, dijepit supaya produk tidak terpotong terlalu banyak.
function kotakPotong(crop = {}) {
  const w = batas(crop.w, 0.4, 1);
  const h = batas(crop.h, 0.4, 1);
  return { x: batas(crop.x, 0, 1 - w), y: batas(crop.y, 0, 1 - h), w, h };
}

// Terapkan saran AI ke foto asli di kanvas: potong, luruskan, lalu atur cahaya dan warna.
// Semua angka dijepit lagi di sini supaya hasilnya tidak pernah berlebihan.
function rapikan(bitmap, p) {
  const k = kotakPotong(p.crop);
  const sx = k.x * bitmap.width;
  const sy = k.y * bitmap.height;
  const sw = k.w * bitmap.width;
  const sh = k.h * bitmap.height;

  const skala = Math.min(1, SISI_MAKS / Math.max(sw, sh));
  const w = Math.round(sw * skala);
  const h = Math.round(sh * skala);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  // Rotasi diperbesar sedikit supaya sudut kosong tidak terlihat.
  const sudut = (batas(p.rotasi, -10, 10) * Math.PI) / 180;
  const cos = Math.abs(Math.cos(sudut));
  const sin = Math.abs(Math.sin(sudut));
  const zoom = Math.max((w * cos + h * sin) / w, (w * sin + h * cos) / h);
  ctx.translate(w / 2, h / 2);
  ctx.rotate(sudut);
  ctx.drawImage(bitmap, sx, sy, sw, sh, (-w / 2) * zoom, (-h / 2) * zoom, w * zoom, h * zoom);
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Atur piksel langsung (ctx.filter belum didukung semua peramban HP).
  const terang = 1 + batas(p.kecerahan, -0.3, 0.3);
  const kontras = 1 + batas(p.kontras, -0.3, 0.3);
  const jenuh = 1 + batas(p.saturasi, -0.3, 0.3);
  const hangat = batas(p.kehangatan, -0.3, 0.3) * 60;
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i] * terang;
    let g = d[i + 1] * terang;
    let b = d[i + 2] * terang;
    r = (r - 128) * kontras + 128;
    g = (g - 128) * kontras + 128;
    b = (b - 128) * kontras + 128;
    const l = 0.299 * r + 0.587 * g + 0.114 * b;
    r = l + (r - l) * jenuh + hangat;
    g = l + (g - l) * jenuh + hangat * 0.3;
    b = l + (b - l) * jenuh - hangat;
    d[i] = r;
    d[i + 1] = g;
    d[i + 2] = b;
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function persen(n) {
  const v = Math.round(n * 100);
  return v === 0 ? "tetap" : `${v > 0 ? "+" : ""}${v}%`;
}

/**
 * Foto Studio: AI menilai foto produk dan memberi pengaturan perbaikan, lalu foto asli
 * dirapikan di peramban (potong, luruskan, cahaya, warna). Tidak ada gambar baru yang dibuat.
 * Props: foto (URL opsional, misalnya dari FotoKeForm onFoto), onHasil(dataUrl) untuk PostinganIG.
 */
export default function FotoStudio({ foto, onHasil }) {
  const kamera = useRef(null);
  const galeri = useRef(null);
  const [memuat, setMemuat] = useState(false);
  const [error, setError] = useState("");
  const [contoh, setContoh] = useState(null);
  const [asli, setAsli] = useState(null); // { blob, url }
  const [hasil, setHasil] = useState(null); // { url, saran, mode, potong, rasio }
  const [geser, setGeser] = useState(50);

  useEffect(() => () => asli && URL.revokeObjectURL(asli.url), [asli]);

  async function terapkan(blob, saran, mode) {
    const bitmap = await createImageBitmap(blob);
    const canvas = rapikan(bitmap, saran.perbaikan);
    const rasio = bitmap.width / bitmap.height;
    bitmap.close();
    const url = canvas.toDataURL("image/jpeg", 0.92);
    setHasil({ url, saran, mode, potong: kotakPotong(saran.perbaikan.crop), rasio });
    setGeser(50);
    onHasil?.(url);
  }

  async function proses(sumber) {
    setError("");
    setContoh(null);
    setHasil(null);
    setMemuat(true);
    try {
      const blob = await kompres(sumber);
      setAsli({ blob, url: URL.createObjectURL(blob) });
      const body = new FormData();
      body.append("foto", blob, "foto.jpg");
      const res = await fetch("/api/studio", { method: "POST", body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setContoh(json.contoh ? { blob, saran: json.contoh } : null);
        throw new Error(json.error || "Foto gagal dinilai. Coba lagi.");
      }
      await terapkan(blob, json.result, json.mode);
    } catch (err) {
      setError(err.message);
    } finally {
      setMemuat(false);
    }
  }

  async function pilih(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) await proses(file);
  }

  async function pakaiFotoForm() {
    try {
      await proses(await (await fetch(foto)).blob());
    } catch {
      setError("Foto dari formulir tidak bisa dibuka. Pilih ulang fotonya.");
    }
  }

  function unduh() {
    const a = document.createElement("a");
    a.href = hasil.url;
    a.download = "foto-produk-rapi.jpg";
    a.click();
  }

  const saran = hasil?.saran;
  const k = hasil?.potong;
  // Bagian kanan garis geser memperlihatkan hasil di posisi potongnya; yang dibuang diredupkan.
  const potongKiri = k ? batas(((geser / 100 - k.x) / k.w) * 100, 0, 100) : 0;

  return (
    <div className={s.studio}>
      <div className={s.kalKepala}>
        <div>
          <p className={s.label}>Foto studio</p>
          <p className={s.bantu}>AI menilai foto produk Anda, lalu foto itu dirapikan: dipotong, diluruskan, dan diatur cahaya serta warnanya.</p>
        </div>
        <div className={s.tombolBaris}>
          {foto && (
            <button type="button" className={s.tombol} disabled={memuat} onClick={pakaiFotoForm}>
              Rapikan foto ini
            </button>
          )}
          <button type="button" className={foto ? s.tombolGaris : s.tombol} disabled={memuat} onClick={() => kamera.current.click()}>
            Ambil foto
          </button>
          <button type="button" className={s.tombolGaris} disabled={memuat} onClick={() => galeri.current.click()}>
            Pilih dari galeri
          </button>
        </div>
      </div>
      <input ref={kamera} type="file" accept="image/*" capture="environment" hidden onChange={pilih} />
      <input ref={galeri} type="file" accept="image/jpeg,image/png,image/*" hidden onChange={pilih} />

      <div aria-live="polite">
        {memuat && (
          <p className={s.status} role="status">
            <span className={s.spinner} aria-hidden="true" /> AI sedang menilai foto...
          </p>
        )}
        {error && <p className={s.error} role="alert">{error}</p>}
        {contoh && (
          <button type="button" className={s.tombolGaris} onClick={() => { terapkan(contoh.blob, contoh.saran, "mock"); setError(""); setContoh(null); }}>
            Rapikan dengan pengaturan contoh (Contoh)
          </button>
        )}
      </div>

      {hasil && asli && (
        <div className={s.studioIsi}>
          <figure
            className={s.studioBanding}
            style={{ aspectRatio: `${hasil.rasio}`, width: `min(100%, calc(70vh * ${hasil.rasio}))` }}
          >
            <img src={asli.url} alt="Foto asli" className={s.studioGambar} />
            <span className={s.studioRedup} style={{ clipPath: `inset(0 0 0 ${geser}%)` }} aria-hidden="true" />
            <img
              src={hasil.url}
              alt="Foto setelah dirapikan"
              className={s.studioHasil}
              style={{
                left: `${k.x * 100}%`,
                top: `${k.y * 100}%`,
                width: `${k.w * 100}%`,
                height: `${k.h * 100}%`,
                clipPath: `inset(0 0 0 ${potongKiri}%)`,
              }}
            />
            <span className={s.studioGaris} style={{ left: `${geser}%` }} aria-hidden="true" />
            <span className={`${s.studioTag} ${s.studioTagKiri}`}>Sebelum</span>
            <span className={`${s.studioTag} ${s.studioTagKanan}`}>Sesudah</span>
            <input
              type="range"
              min="0"
              max="100"
              value={geser}
              onChange={(e) => setGeser(Number(e.target.value))}
              className={s.studioSlider}
              aria-label="Geser untuk membandingkan sebelum dan sesudah"
            />
          </figure>
          <p className={s.studioLabel}>Foto asli Anda, dirapikan otomatis sesuai saran AI</p>

          <div className={s.studioKartu}>
            {hasil.mode === "mock" && (
              <p className={s.catatanContoh}>
                <strong>Mode contoh.</strong> Foto belum dinilai AI; yang diterapkan adalah pengaturan contoh.
              </p>
            )}
            <div className={s.studioSkor}>
              <MeterSkor nilai={saran.nilai} />
              <p>Nilai foto asli Anda sebagai foto katalog, menurut penilaian AI.</p>
            </div>
            {saran.masalah.length > 0 && (
              <>
                <p className={s.label}>Perlu dibenahi</p>
                <ul className={s.studioDaftar}>{saran.masalah.map((m, i) => <li key={i}>{m}</li>)}</ul>
              </>
            )}
            <p className={s.label}>Sudah dirapikan</p>
            <p className={s.studioAtur}>
              Cahaya {persen(saran.perbaikan.kecerahan)} · kontras {persen(saran.perbaikan.kontras)} · warna{" "}
              {persen(saran.perbaikan.saturasi)} · hangat {persen(saran.perbaikan.kehangatan)}
              {Math.abs(saran.perbaikan.rotasi) >= 0.5 && <> · diluruskan {saran.perbaikan.rotasi.toFixed(1)}°</>}
            </p>
            {saran.tips_foto_ulang.length > 0 && (
              <>
                <p className={s.label}>Tips memotret ulang</p>
                <ul className={s.studioDaftar}>{saran.tips_foto_ulang.map((t, i) => <li key={i}>{t}</li>)}</ul>
              </>
            )}
            <button type="button" className={s.tombol} onClick={unduh}>Unduh foto</button>
          </div>
        </div>
      )}
    </div>
  );
}
