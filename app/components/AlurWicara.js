"use client";

import { useEffect, useRef, useState } from "react";

// Diagram alur Wicara: titik data terus mengalir di garis, node menyala sesuai langkah aktif.
// Semua angka diambil dari kode (lib/gemini.js, lib/generate.js, app/app/Aplikasi.js).
const LANGKAH = [
  {
    judul: "Pedagang menulis draf",
    teks: "Lima isian singkat, atau foto produk yang dibaca AI untuk mengisi nama, kategori, dan keunggulan.",
    angka: [["5", "isian draf"], ["1", "foto cukup"]],
  },
  {
    judul: "Server mengunci instruksi",
    teks: "Isian divalidasi di server. Instruksi untuk AI disimpan di sana dan tidak bisa diubah dari peramban.",
    angka: [["0", "API key di peramban"], ["1", "skema JSON tetap"]],
  },
  {
    judul: "Claude menulis, Gemini cadangan",
    teks: "Model utama Claude Haiku 5.5 dari Anthropic. Kalau Claude bermasalah, permintaan pindah ke rantai model Google Gemini.",
    angka: [["5", "model berantai"], ["1", "skema yang sama"]],
  },
  {
    judul: "Pena merah dan stabilo",
    teks: "Jawaban dicek ulang dengan Zod. Di layar, kata yang berasal dari isian Anda diberi stabilo supaya mudah diperiksa.",
    angka: [["0", "klaim tambahan diizinkan"], ["5", "bagian dicek"]],
  },
  {
    judul: "Siap dipakai",
    teks: "Empat tulisan siap salin, gambar postingan Instagram, dan rencana posting seminggu yang memperhitungkan hari raya Bali.",
    angka: [["4", "tulisan"], ["7", "hari kalender"]],
  },
];

const NODE = [
  { x: 150, y: 20, w: 220, h: 56, label: "Draf copy", sub: "isian · foto" },
  { x: 150, y: 128, w: 220, h: 56, label: "Server Wicara", sub: "validasi · instruksi terkunci" },
  { x: 150, y: 236, w: 220, h: 56, label: "Claude", sub: "Haiku 5.5 ⇢ cadangan Gemini" },
  { x: 150, y: 344, w: 220, h: 56, label: "Pena & stabilo", sub: "cek fakta · Zod" },
];
const HASIL = [
  { x: 20, label: "4 struk" },
  { x: 190, label: "Postingan IG" },
  { x: 360, label: "Kalender 7 hari" },
];

export default function AlurWicara() {
  const [aktif, setAktif] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setAktif(Number(e.target.dataset.i))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="aw">
      <div className="aw-diagram">
        <svg viewBox="0 0 520 540" role="img" aria-label="Alur Wicara: draf copy, server Wicara, Claude dengan cadangan Gemini, pena merah dan stabilo, lalu empat struk, postingan IG, dan kalender tujuh hari">
          {NODE.slice(0, 3).map((n, i) => (
            <g key={"g" + i}>
              <line x1="260" y1={n.y + n.h} x2="260" y2={NODE[i + 1].y} className="aw-garis" />
              <line x1="260" y1={n.y + n.h} x2="260" y2={NODE[i + 1].y} className="aw-alir" />
            </g>
          ))}
          {HASIL.map((h) => (
            <g key={"h" + h.x}>
              <path d={`M260 400 V430 H${h.x + 70} V460`} className="aw-garis" />
              <path d={`M260 400 V430 H${h.x + 70} V460`} className="aw-alir" />
            </g>
          ))}
          {NODE.map((n, i) => (
            <g key={n.label} className={`aw-node${aktif === i ? " nyala" : ""}`}>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="8" />
              <text x={n.x + 16} y={n.y + 25} className="aw-label">{n.label}</text>
              <text x={n.x + 16} y={n.y + 43} className="aw-sub">{n.sub}</text>
              <circle cx={n.x + n.w - 18} cy={n.y + 18} r="4" className="aw-lampu" />
            </g>
          ))}
          {HASIL.map((h) => (
            <g key={h.label} className={`aw-node aw-hasil${aktif === 4 ? " nyala" : ""}`}>
              <rect x={h.x} y="460" width="140" height="48" rx="8" />
              <text x={h.x + 70} y="489" textAnchor="middle" className="aw-label kecil">{h.label}</text>
            </g>
          ))}
        </svg>
      </div>
      <ol className="aw-langkah">
        {LANGKAH.map((l, i) => (
          <li key={l.judul} ref={(el) => (refs.current[i] = el)} data-i={i} className={aktif === i ? "aktif" : ""}>
            <p className="aw-no">{String(i + 1).padStart(2, "0")}</p>
            <h3>{l.judul}</h3>
            <p className="aw-teks">{l.teks}</p>
            <dl className="aw-angka">
              {l.angka.map(([n, k]) => <div key={k}><dt>{n}</dt><dd>{k}</dd></div>)}
            </dl>
          </li>
        ))}
      </ol>
    </div>
  );
}
