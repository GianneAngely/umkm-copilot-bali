"use client";

import { useEffect, useRef, useState } from "react";
import s from "./fitur.module.css";

const UKURAN = {
  feed: { w: 1080, h: 1080, label: "feed Instagram" },
  story: { w: 1080, h: 1920, label: "Story Instagram" },
};

const TEMPLATE = [
  { id: "nota", label: "Nota" },
  { id: "lembar", label: "Lembar foto" },
  { id: "cap", label: "Cap kunyit" },
];

// Warna nota: kertas krem, tinta hijau daun, aksen kunyit.
const W = {
  kertas: "#f4efe3",
  garisKertas: "rgba(23, 59, 47, 0.06)",
  panel: "#fffaf0",
  hijau: "#24503f",
  hijauTua: "#173b2f",
  pudar: "#5f746a",
  kunyit: "#e3a21a",
  kunyitTua: "#8a5a06",
};

function rupiah(n) {
  return "Rp" + Number(n).toLocaleString("id-ID");
}

function teksHarga(harga, hasil) {
  if (typeof harga === "string" && harga) return harga;
  const h = harga && typeof harga === "object" ? harga : hasil?.harga;
  if (!h) return "";
  if (h.min && h.max && h.min !== h.max) return `${rupiah(h.min)} – ${rupiah(h.max)}`;
  return rupiah(h.min || h.max);
}

// Pecah teks jadi baris yang muat di lebar tertentu, paling banyak `maks` baris.
function bungkus(ctx, teks, lebar, maks) {
  const kata = String(teks || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const baris = [];
  let kini = "";
  for (let i = 0; i < kata.length; i++) {
    const coba = kini ? `${kini} ${kata[i]}` : kata[i];
    if (ctx.measureText(coba).width <= lebar || !kini) {
      kini = coba;
      continue;
    }
    baris.push(kini);
    kini = kata[i];
    if (baris.length === maks) {
      kini = "";
      let akhir = baris[maks - 1];
      while (akhir && ctx.measureText(akhir + "…").width > lebar) akhir = akhir.replace(/\s*\S+$/, "");
      baris[maks - 1] = akhir + "…";
      break;
    }
  }
  if (kini) baris.push(kini);
  return baris.slice(0, maks);
}

function garisPutus(ctx, x1, x2, y, warna) {
  ctx.save();
  ctx.strokeStyle = warna;
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 10]);
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
  ctx.restore();
}

// Panel struk dengan tepi bawah bergerigi.
function panelStruk(ctx, x, y, w, h) {
  const gigi = 26;
  ctx.save();
  ctx.shadowColor = "rgba(31, 66, 39, 0.18)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = W.panel;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h);
  const n = Math.round(w / gigi);
  for (let i = n; i > 0; i--) {
    ctx.lineTo(x + ((i - 0.5) * w) / n, y + h + 14);
    ctx.lineTo(x + ((i - 1) * w) / n, y + h);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Gambar foto dengan mode "cover" di dalam kotak.
function fotoCover(ctx, img, x, y, w, h, radius = 0) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.clip();
  if (img) {
    const skala = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const iw = img.naturalWidth * skala;
    const ih = img.naturalHeight * skala;
    ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
  } else {
    ctx.fillStyle = "#e6dcc6";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "rgba(47, 93, 52, 0.12)";
    ctx.lineWidth = 2;
    for (let i = -h; i < w; i += 28) {
      ctx.beginPath();
      ctx.moveTo(x + i, y + h);
      ctx.lineTo(x + i + h, y);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function cap(ctx, cx, cy, r, atas, bawah, font) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.16);
  ctx.fillStyle = W.kunyit;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = W.hijauTua;
  ctx.lineWidth = 4;
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.arc(0, 0, r - 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = W.hijauTua;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `500 ${Math.round(r * 0.17)}px ${font.mono}`;
  ctx.fillText(atas, 0, -r * 0.3);
  let ukuran = Math.round(r * 0.34);
  ctx.font = `800 ${ukuran}px ${font.display}`;
  while (ctx.measureText(bawah).width > r * 1.6 && ukuran > 20) {
    ukuran -= 2;
    ctx.font = `800 ${ukuran}px ${font.display}`;
  }
  ctx.fillText(bawah, 0, r * 0.12);
  ctx.restore();
}

function gambar(ctx, ukuran, template, data, img, font) {
  const { w, h } = UKURAN[ukuran];
  const story = ukuran === "story";
  ctx.clearRect(0, 0, w, h);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  // Latar
  ctx.fillStyle = template === "cap" ? W.hijau : W.kertas;
  ctx.fillRect(0, 0, w, h);
  if (template !== "cap") {
    ctx.fillStyle = W.garisKertas;
    for (let y = 44; y < h; y += 44) ctx.fillRect(0, y, w, 2);
  }

  const m = story ? 80 : 60;
  const px = m;
  const pw = w - m * 2;
  const pad = story ? 56 : 44;
  const x = px + pad;
  const lebar = pw - pad * 2;
  const bawah = story ? 170 : m + 14;
  const tinggiKepala = story ? 88 : 66;

  // Ukur teks dulu: foto mendapat sisa ruang, dan panel "lembar" mengikuti tinggi isi.
  const namaUkuran = story ? 84 : 58;
  ctx.font = `800 ${namaUkuran}px ${font.display}`;
  const namaBaris = bungkus(ctx, data.nama, lebar, 2);
  const capUkuran = story ? 38 : 30;
  ctx.font = `400 ${capUkuran}px ${font.display}`;
  const capBaris = bungkus(ctx, data.caption, lebar, story ? 5 : 2);
  const tagUkuran = story ? 30 : 24;
  ctx.font = `500 ${tagUkuran}px ${font.mono}`;
  const tagBaris = bungkus(ctx, data.hashtags, lebar, 2);
  const tinggiTeks =
    namaBaris.length * namaUkuran * 1.08 + 18 +
    capBaris.length * capUkuran * 1.4 + 26 +
    (story ? 130 : 96) +
    tagBaris.length * tagUkuran * 1.45 + 10;

  let py = story ? 150 : m;
  let ph = h - py - bawah;
  if (template === "lembar") {
    ph = Math.round(pad * 2 + tinggiKepala + tinggiTeks);
    py = h - bawah - ph;
    fotoCover(ctx, img, 0, 0, w, py + (story ? 120 : 80));
  }

  if (template === "cap") {
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-0.015);
    ctx.translate(-w / 2, -h / 2);
  }
  panelStruk(ctx, px, py, pw, ph);
  let y = py + pad;

  // Kepala nota
  ctx.fillStyle = W.pudar;
  ctx.font = `500 ${story ? 30 : 24}px ${font.mono}`;
  ctx.fillText("NOTA PRODUK · UMKM BALI", x, y + 20);
  ctx.textAlign = "right";
  ctx.fillText("No. 001", x + lebar, y + 20);
  ctx.textAlign = "left";
  y += story ? 52 : 40;
  garisPutus(ctx, x, x + lebar, y, W.pudar);
  y += story ? 36 : 26;

  const sisa = py + ph - pad - y - tinggiTeks;

  if (template !== "lembar" && sisa > 120) {
    const fh = Math.min(sisa - 24, story ? 900 : 420);
    fotoCover(ctx, img, x, y, lebar, fh, 10);
    y += fh + 30;
  }

  // Nama produk
  ctx.fillStyle = W.hijauTua;
  ctx.font = `800 ${namaUkuran}px ${font.display}`;
  for (const b of namaBaris) {
    y += namaUkuran * 0.92;
    ctx.fillText(b, x, y);
    y += namaUkuran * 0.16;
  }
  y += 18;

  // Potongan caption
  ctx.fillStyle = W.hijau;
  ctx.font = `400 ${capUkuran}px ${font.display}`;
  for (const b of capBaris) {
    y += capUkuran * 1.1;
    ctx.fillText(b, x, y);
    y += capUkuran * 0.3;
  }
  y += 20;

  // Harga
  garisPutus(ctx, x, x + lebar, y, W.pudar);
  const harga = data.harga;
  if (template !== "cap" && harga) {
    y += story ? 80 : 62;
    ctx.fillStyle = W.pudar;
    ctx.font = `500 ${story ? 30 : 24}px ${font.mono}`;
    ctx.fillText("HARGA", x, y - 6);
    ctx.textAlign = "right";
    let hu = story ? 60 : 46;
    ctx.font = `800 ${hu}px ${font.display}`;
    while (ctx.measureText(harga).width > lebar * 0.75 && hu > 24) {
      hu -= 2;
      ctx.font = `800 ${hu}px ${font.display}`;
    }
    ctx.fillStyle = W.hijauTua;
    ctx.fillText(harga, x + lebar, y);
    ctx.textAlign = "left";
    // Garis bawah kunyit
    ctx.fillStyle = W.kunyit;
    ctx.fillRect(x + lebar - ctx.measureText(harga).width, y + 12, ctx.measureText(harga).width, 8);
    y += story ? 50 : 34;
  } else {
    y += story ? 40 : 28;
  }

  // Hashtag
  ctx.fillStyle = W.kunyitTua;
  ctx.font = `500 ${tagUkuran}px ${font.mono}`;
  for (const b of tagBaris) {
    y += tagUkuran * 1.1;
    ctx.fillText(b, x, y);
    y += tagUkuran * 0.35;
  }

  if (template === "cap") {
    ctx.restore();
    if (harga) {
      const r = story ? 170 : 130;
      cap(ctx, w - r - 28, py + tinggiKepala + r + 20, r, "MULAI", harga.split(" – ")[0], font);
    }
  }

  // Kaki untuk story: ruang di bawah panel
  if (story) {
    ctx.fillStyle = template === "cap" ? W.kertas : W.hijau;
    ctx.textAlign = "center";
    ctx.font = `500 30px ${font.mono}`;
    ctx.fillText("Pesan lewat DM atau WhatsApp", w / 2, h - 70);
    ctx.textAlign = "left";
  }
}

function bacaFont() {
  const css = getComputedStyle(document.documentElement);
  return {
    display: css.getPropertyValue("--font-display").trim() || "system-ui, sans-serif",
    mono: css.getPropertyValue("--font-mono").trim() || "ui-monospace, monospace",
  };
}

function muatGambar(src) {
  return new Promise((ok) => {
    if (!src) return ok(null);
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = () => ok(null);
    img.src = src;
  });
}

function slug(teks) {
  return String(teks || "produk").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "produk";
}

/**
 * Pratinjau dan unduhan postingan Instagram (feed dan story) bergaya nota.
 * Props: hasil (hasil /api/generate), foto (URL opsional), namaProduk, harga (opsional;
 * string siap tampil atau { min, max }, default hasil.harga).
 */
export default function PostinganIG({ hasil, foto, namaProduk, harga }) {
  const [template, setTemplate] = useState("nota");
  const [siap, setSiap] = useState(false);
  const [diunduh, setDiunduh] = useState("");
  const kanvas = { feed: useRef(null), story: useRef(null) };

  const data = {
    nama: namaProduk || "",
    caption: String(hasil?.caption || "").split(/\n\s*\n/)[0],
    hashtags: (hasil?.hashtags || []).slice(0, 6).join(" "),
    harga: teksHarga(harga, hasil),
  };
  const kunci = JSON.stringify(data) + template + (foto || "");

  useEffect(() => {
    let batal = false;
    setSiap(false);
    (async () => {
      const font = bacaFont();
      // Tunggu font self-host termuat supaya kanvas tidak memakai font cadangan.
      await Promise.all([
        document.fonts.load(`800 40px ${font.display}`),
        document.fonts.load(`400 40px ${font.display}`),
        document.fonts.load(`500 40px ${font.mono}`),
      ]).catch(() => {});
      await document.fonts.ready;
      const img = await muatGambar(foto);
      if (batal) return;
      for (const ukuran of Object.keys(UKURAN)) {
        const c = kanvas[ukuran].current;
        if (c) gambar(c.getContext("2d"), ukuran, template, data, img, font);
      }
      setSiap(true);
    })();
    return () => {
      batal = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kunci]);

  function unduh(ukuran) {
    kanvas[ukuran].current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `postingan-${slug(namaProduk)}-${ukuran}.png`;
      a.click();
      setDiunduh(ukuran);
      setTimeout(() => setDiunduh(""), 1600);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  }

  if (!hasil) return null;

  return (
    <div className={s.ig}>
      <div className={s.igKepala}>
        <div>
          <p className={s.label}>Postingan Instagram</p>
          <p className={s.bantu}>Gambar untuk feed dan Story Instagram langsung jadi dari caption dan harga di atas. Berkasnya berformat PNG.</p>
        </div>
        <div className={s.pilihan} role="radiogroup" aria-label="Template">
          {TEMPLATE.map((t) => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={template === t.id}
              className={template === t.id ? s.pilihAktif : s.pilih}
              onClick={() => setTemplate(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className={s.igKanvas}>
        {Object.entries(UKURAN).map(([ukuran, u]) => (
          <figure key={ukuran} className={ukuran === "story" ? s.igStory : s.igFeed}>
            <canvas
              ref={kanvas[ukuran]}
              width={u.w}
              height={u.h}
              className={s.kanvas}
              role="img"
              aria-label={`Pratinjau postingan ${u.label} untuk ${namaProduk || "produk"}`}
            />
            <figcaption>
              <button type="button" className={`${s.tombolGaris} ${diunduh === ukuran ? s.terunduh : ""}`} disabled={!siap} onClick={() => unduh(ukuran)}>
                {diunduh === ukuran ? "✓ Terunduh" : `Unduh untuk ${u.label}`}
              </button>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
