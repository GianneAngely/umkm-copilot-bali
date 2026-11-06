"use client";

import { useState } from "react";
import s from "./fitur.module.css";
import { mintaJson } from "../../../lib/klien";

const LABEL_FORMAT = { feed: "Feed", story: "Story", reels: "Reels" };

function hariIniWita() {
  return new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 10);
}

function tanggalPendek(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

/**
 * Kalender konten 7 hari dengan hari raya Bali.
 * Props: produk { nama, kategori, target }, ringkasan (mis. hasil.deskripsi_singkat),
 * tanggalMulai (opsional, "YYYY-MM-DD", default hari ini WITA).
 */
export default function KalenderKonten({ produk, ringkasan, tanggalMulai }) {
  const [mulai, setMulai] = useState(tanggalMulai || hariIniWita());
  const [memuat, setMemuat] = useState(false);
  const [error, setError] = useState("");
  const [contoh, setContoh] = useState(null);
  const [data, setData] = useState(null);

  async function susun() {
    setMemuat(true);
    setError("");
    setContoh(null);
    try {
      setData(await mintaJson("/api/kalender", { produk, ringkasan, tanggalMulai: mulai }));
    } catch (err) {
      setError(err.message);
      setContoh(err.contoh || null);
    } finally {
      setMemuat(false);
    }
  }

  return (
    <div className={s.kal}>
      <div className={s.kalKepala}>
        <div>
          <p className={s.label}>Kalender konten 7 hari</p>
          <p className={s.bantu}>Rencana posting seminggu, memperhitungkan hari raya Bali dan masa libur.</p>
        </div>
        <div className={s.kalAksi}>
          <label className={s.kalTanggal}>
            <span>Mulai</span>
            <input type="date" value={mulai} onChange={(e) => setMulai(e.target.value)} />
          </label>
          <button type="button" className={s.tombol} disabled={memuat || !produk?.nama || !mulai} onClick={susun}>
            {memuat ? "Menyusun..." : "Susun kalender"}
          </button>
        </div>
      </div>

      <div aria-live="polite">
        {memuat && (
          <p className={s.status} role="status">
            <span className={s.spinner} aria-hidden="true" /> Sedang menyusun rencana 7 hari...
          </p>
        )}
        {error && <p className={s.error} role="alert">{error}</p>}
        {contoh && (
          <button type="button" className={s.tombolGaris} onClick={() => { setData({ mode: "mock", result: contoh }); setError(""); setContoh(null); }}>
            Lihat contoh kalender (Contoh)
          </button>
        )}
      </div>

      {data && (
        <>
          {data.mode === "mock" && (
            <p className={s.catatanContoh}>
              <strong>Mode contoh.</strong> API key belum dipasang, jadi ide di bawah adalah contoh statis.
              Hari raya tetap diambil dari data kalender asli.
            </p>
          )}
          {data.model && <p className={s.model}>AI aktif · {data.model}</p>}
          <ol className={s.kalDaftar}>
            {data.result.hari.map((h) => {
              const acara = data.result.acara.filter((a) =>
                a.tanggal ? a.tanggal === h.tanggal : a.mulai <= h.tanggal && a.selesai >= h.tanggal,
              );
              return (
                <li key={h.tanggal} className={s.kalKartu}>
                  <div className={s.kalTgl}>
                    <span className={s.kalHari}>{h.hari}</span>
                    <span className={s.kalAngka}>{tanggalPendek(h.tanggal)}</span>
                    <span className={s.kalFormat}>{LABEL_FORMAT[h.format] || h.format}</span>
                  </div>
                  <div className={s.kalIsi}>
                    {acara.map((a) => (
                      <span key={a.nama} className={a.jenis === "hari-raya" ? s.kalRaya : s.kalLibur}>
                        {a.nama}
                      </span>
                    ))}
                    <p className={s.kalIde}>{h.ide_posting}</p>
                    <p className={s.kalCaption}>{h.caption_singkat}</p>
                    <p className={s.kalAlasan}>{h.alasan}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </div>
  );
}
