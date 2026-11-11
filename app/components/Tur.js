"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import s from "./Tur.module.css";

const KUNCI = "wicara-tur-dilihat";

// Setiap langkah menunjuk elemen dengan atribut data-tur yang sama dengan id.
// klik: tur lanjut sendiri saat bagian yang terang ditekan.
// tunggu: tunggu elemen muncul (hasil baru ada setelah tombol ditekan).
const LANGKAH = [
  { id: "foto", judul: "Isi dari foto (boleh dilewati)", teks: "Punya foto produk? Tekan Ambil foto atau Pilih foto, atau seret fotonya ke kotak ini. Formulir akan terisi sendiri." },
  { id: "nama", judul: "Nama produk", teks: "Ketik nama produkmu di sini. Contohnya: Pie Susu Bu Made." },
  { id: "kategori", judul: "Kategori", teks: "Pilih jenis produkmu, misalnya Kuliner atau Kerajinan." },
  { id: "keunggulan", judul: "Bahan atau keunggulan", teks: "Tulis bahan atau kelebihan produkmu. Makin jelas, makin bagus hasilnya." },
  { id: "target", judul: "Pembelinya siapa?", teks: "Pilih yang paling sering membeli: warga lokal atau wisatawan." },
  { id: "buat", judul: "Buat tulisannya", teks: "Tekan tombol ini. Langkah kerja AI tampil satu per satu sampai hasilnya jadi.", klik: true },
  { id: "hasil", judul: "Hasilnya sudah jadi", teks: "Di sini terlihat model AI yang dipakai dan lama prosesnya. Tekan Salin semua, lalu tempel di Instagram, WhatsApp, atau marketplace.", tunggu: true },
  { id: "suntingan", judul: "Lembar suntingan", teks: "Tekan Draf Anda untuk melihat klaim kosong yang dicoret pena merah dan fakta Anda yang distabilo. Angkanya dihitung langsung dari isian dan hasil.", tunggu: true },
  { id: "studio", judul: "Foto Studio", teks: "Foto seadanya dari HP diubah AI jadi foto katalog. Geser slider untuk membandingkan sebelum dan sesudah. Hasilnya langsung dipakai di gambar postingan.", tunggu: true },
  { id: "ig", judul: "Gambar postingan Instagram", teks: "Gambar feed dan story sudah jadi. Pilih template, lalu unduh PNG-nya.", tunggu: true },
  { id: "kalender", judul: "Kalender 7 hari", teks: "Tekan Susun kalender. AI menyusun rencana posting seminggu, termasuk hari raya Bali.", tunggu: true },
  { id: "balas", judul: "Balasan chat pembeli", teks: "Lima template balasan WhatsApp untuk pertanyaan yang paling sering: harga, stok, ongkir, dan lainnya. Tekan Salin balasan lalu tempel di chat.", tunggu: true },
  { id: "riwayat", judul: "Riwayat", teks: "Tulisan yang pernah dibuat tersimpan di sini. Tekan untuk membukanya lagi." },
];

const JARAK = 12;
const TEPI = 16;

// Elemen target yang benar-benar tampil (menu riwayat ada di samping dan di bawah, pilih yang terlihat).
function cariTarget(id) {
  for (const el of document.querySelectorAll(`[data-tur="${id}"]`)) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return el;
  }
  return null;
}

function bacaDilihat() {
  try {
    return localStorage.getItem(KUNCI) === "1";
  } catch {
    return false;
  }
}

function tandaiDilihat() {
  try {
    localStorage.setItem(KUNCI, "1");
  } catch {}
}

/**
 * Tur coach-mark untuk halaman /app. Merender tombol "Lihat tutorial" di tempatnya dipasang,
 * dan lapisan tur lewat portal ke body. Mulai otomatis saat pertama kali dibuka.
 */
export default function Tur() {
  const [aktif, setAktif] = useState(false);
  const [i, setI] = useState(0);
  const [kotak, setKotak] = useState(null);
  const [tip, setTip] = useState({ top: 0, left: 0, posisi: "bawah", panahX: 0 });
  const [kondisi, setKondisi] = useState("");
  const tipRef = useRef(null);
  const pemicuRef = useRef(null);
  const langkah = LANGKAH[i];

  const mulai = useCallback(() => {
    setI(0);
    setAktif(true);
  }, []);

  const tutup = useCallback(() => {
    tandaiDilihat();
    setAktif(false);
    setKotak(null);
    requestAnimationFrame(() => pemicuRef.current?.focus());
  }, []);

  const lanjut = useCallback(() => {
    setI((n) => {
      if (n >= LANGKAH.length - 1) {
        tutup();
        return n;
      }
      return n + 1;
    });
  }, [tutup]);
  const kembali = useCallback(() => setI((n) => Math.max(0, n - 1)), []);

  // Mulai sendiri saat kunjungan pertama, setelah formulir tampil.
  useEffect(() => {
    if (bacaDilihat()) return;
    const t = setTimeout(() => {
      if (cariTarget("nama")) mulai();
    }, 700);
    return () => clearTimeout(t);
  }, [mulai]);

  // Gulir ke target saat langkah berganti.
  useEffect(() => {
    if (!aktif) return;
    const el = cariTarget(langkah.id);
    if (el) {
      const halus = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ block: "center", behavior: halus ? "smooth" : "auto" });
    }
    requestAnimationFrame(() => tipRef.current?.querySelector("[data-utama]")?.focus({ preventScroll: true }));
  }, [aktif, i, langkah.id]);

  // Ikuti posisi target setiap frame (halaman bisa digulir, hasil bisa muncul belakangan).
  useLayoutEffect(() => {
    if (!aktif) return;
    let frame;
    let sebelum = "";
    const ukur = () => {
      const el = cariTarget(langkah.id);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let k = "";
      if (!el && langkah.tunggu) {
        k = document.querySelector('[aria-busy="true"]') ? "menyusun" : document.querySelector(".galat") ? "galat" : "menunggu";
      } else if (!el) {
        k = "hilang";
      }
      const r = el?.getBoundingClientRect();
      const tinggiTip = tipRef.current?.offsetHeight || 0;
      const kunci = (r ? `${r.top}|${r.left}|${r.width}|${r.height}` : k) + `|${vw}|${vh}|${tinggiTip}`;
      if (kunci !== sebelum) {
        sebelum = kunci;
        setKondisi(k);
        const tw = Math.min(360, vw - TEPI * 2);
        const th = tipRef.current?.offsetHeight || 200;
        if (!r) {
          setKotak(null);
          setTip({ top: Math.max(TEPI, (vh - th) / 2), left: (vw - tw) / 2, posisi: "tengah", panahX: 0, lebar: tw });
        } else {
          const pad = 6;
          const kt = { top: r.top - pad, left: r.left - pad, width: r.width + pad * 2, height: r.height + pad * 2 };
          setKotak(kt);
          const ruangBawah = vh - (kt.top + kt.height);
          const ruangAtas = kt.top;
          let posisi = "bawah";
          let top = kt.top + kt.height + JARAK;
          if (ruangBawah < th + JARAK + TEPI && ruangAtas >= th + JARAK + TEPI) {
            posisi = "atas";
            top = kt.top - JARAK - th;
          } else if (ruangBawah < th + JARAK + TEPI) {
            // Target setinggi layar: tempel tooltip di bawah layar.
            posisi = "tempel";
            top = vh - th - TEPI;
          }
          const tengah = r.left + r.width / 2;
          const left = Math.min(Math.max(TEPI, tengah - tw / 2), vw - TEPI - tw);
          const panahX = Math.min(Math.max(20, tengah - left), tw - 20);
          setTip({ top, left, posisi, panahX, lebar: tw });
        }
      }
      frame = requestAnimationFrame(ukur);
    };
    frame = requestAnimationFrame(ukur);
    return () => cancelAnimationFrame(frame);
  }, [aktif, langkah.id, langkah.tunggu]);

  // Langkah interaktif: menekan bagian yang terang melanjutkan tur.
  useEffect(() => {
    if (!aktif || !langkah.klik) return;
    const tekan = (e) => {
      const el = cariTarget(langkah.id);
      if (!el || !el.contains(e.target)) return;
      // Tombol kirim formulir hanya dihitung kalau isian sudah valid.
      if (el.type === "submit" && el.form && !el.form.checkValidity()) return;
      setTimeout(lanjut, 0);
    };
    document.addEventListener("click", tekan, true);
    return () => document.removeEventListener("click", tekan, true);
  }, [aktif, langkah.id, langkah.klik, lanjut]);

  // Keyboard: Esc menutup, panah pindah langkah, Tab berputar di dalam tur.
  useEffect(() => {
    if (!aktif) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        tutup();
        return;
      }
      const ketik = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || "");
      if (!ketik && e.key === "ArrowRight") {
        e.preventDefault();
        lanjut();
      } else if (!ketik && e.key === "ArrowLeft") {
        e.preventDefault();
        kembali();
      } else if (e.key === "Tab") {
        // Fokus berputar di antara bagian yang terang dan tombol tooltip.
        const target = cariTarget(langkah.id);
        const sel = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select,textarea,[tabindex]:not([tabindex="-1"])';
        const daftar = [
          ...(target ? (target.matches(sel) ? [target] : [...target.querySelectorAll(sel)]) : []),
          ...(tipRef.current ? [...tipRef.current.querySelectorAll(sel)] : []),
        ].filter((el) => el.getClientRects().length > 0);
        if (!daftar.length) return;
        const idx = daftar.indexOf(document.activeElement);
        e.preventDefault();
        const next = e.shiftKey ? (idx <= 0 ? daftar.length - 1 : idx - 1) : (idx + 1) % daftar.length;
        daftar[next].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aktif, langkah.id, lanjut, kembali, tutup]);

  const pesanKondisi = {
    menunggu: "Isi nama produk lalu tekan tombol Sunting dan tulis dulu. Hasilnya akan muncul di sini.",
    menyusun: "Sebentar, AI sedang menyusun tulisannya...",
    galat: "Belum berhasil. Coba tekan tombol Sunting dan tulis sekali lagi.",
    hilang: "Bagian ini belum tampil di layar. Buka Tulisan baru dan buat hasil dulu, atau tekan Lanjut.",
  }[kondisi];

  const lapisan = aktif && (
    <div className={s.tur} role="presentation">
      {kotak ? (
        <>
          {/* Empat penghalang di sekitar lubang: area gelap tidak bisa ditekan, area terang bisa. */}
          <div className={s.halang} style={{ top: 0, left: 0, right: 0, height: Math.max(0, kotak.top) }} />
          <div className={s.halang} style={{ top: kotak.top + kotak.height, left: 0, right: 0, bottom: 0 }} />
          <div className={s.halang} style={{ top: kotak.top, left: 0, width: Math.max(0, kotak.left), height: kotak.height }} />
          <div className={s.halang} style={{ top: kotak.top, left: kotak.left + kotak.width, right: 0, height: kotak.height }} />
          <div className={`${s.lubang} ${langkah.klik ? s.denyut : ""}`} style={kotak} aria-hidden="true" />
        </>
      ) : (
        <div className={s.gelap} />
      )}

      <div
        ref={tipRef}
        className={`${s.tip} ${s[tip.posisi] || ""}`}
        style={{ top: tip.top, left: tip.left, width: tip.lebar, "--panah-x": `${tip.panahX}px` }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tur-judul"
        aria-describedby="tur-teks"
      >
        <p className={s.hitung}>
          Tutorial · {i + 1}/{LANGKAH.length}
        </p>
        <div aria-live="polite">
          <h2 id="tur-judul" className={s.judul}>{langkah.judul}</h2>
          <p id="tur-teks" className={s.teks}>{pesanKondisi || langkah.teks}</p>
          {langkah.klik && kotak && (
            <p className={s.penunjuk}>
              <span aria-hidden="true">{tip.posisi === "atas" ? "↓" : "↑"}</span> Tekan bagian yang terang
            </p>
          )}
        </div>
        <div className={s.aksi}>
          <button type="button" className={s.lewati} onClick={tutup}>Lewati</button>
          <span className={s.kanan}>
            {i > 0 && <button type="button" className={s.kembali} onClick={kembali}>Kembali</button>}
            <button type="button" className={s.lanjut} onClick={lanjut} data-utama>
              {i === LANGKAH.length - 1 ? "Selesai" : "Lanjut"}
            </button>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button ref={pemicuRef} type="button" className={s.pemicu} onClick={mulai}>
        <span aria-hidden="true">?</span> Lihat tutorial
      </button>
      {lapisan && createPortal(lapisan, document.body)}
    </>
  );
}
