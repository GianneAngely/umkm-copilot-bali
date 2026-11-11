"use client";

import { useEffect, useRef, useState } from "react";
import { BatangSuntingan, MeterTeks } from "./Grafik";

// Semua di berkas ini murni tampilan: membandingkan isian dengan hasil di sisi klien.
// API, skema hasil, dan rantai model tidak disentuh.

// Klaim kosong yang tidak bisa dibuktikan. Kata ini dicoret di draf kalau tidak ikut ke hasil,
// dan dihitung sebagai "klaim ditambahkan" kalau muncul di hasil padahal tidak ada di isian.
const KLAIM = [
  "nomor satu", "no. 1", "no 1", "100%", "pokoknya", "dijamin", "terbaik", "terenak", "terlezat", "termurah",
  "terlaris", "ternikmat", "terpercaya", "paling", "enak", "lezat", "murah", "mantap", "mantul", "juara",
  "sempurna", "istimewa", "premium", "viral", "legendaris", "best", "cheapest", "finest", "number one",
];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const POLA_KLAIM = new RegExp(`(?<![\\p{L}\\d])(${KLAIM.map(esc).join("|")})(?![\\p{L}\\d])`, "giu");

function cariKlaim(teks) {
  return [...String(teks || "").matchAll(POLA_KLAIM)].map((m) => m[0].toLowerCase());
}

export function detik(ms) {
  return (ms / 1000).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " detik";
}

// Draf dipecah jadi baris; tiap potongan diberi jenis: fakta (dipakai di hasil), klaim (dicoret), atau biasa.
export function analisis(form, r) {
  if (!form || !r) return null;
  const teksHasil = [r.deskripsi_singkat, r.deskripsi_cerita, r.caption, r.harga?.alasan, r.english?.description, r.english?.caption].join("\n");
  const kecil = teksHasil.toLowerCase();
  const dipakai = (t) => t.length >= 3 && kecil.includes(t.toLowerCase());

  const potongKlaim = (teks) => {
    const out = [];
    let akhir = 0;
    for (const m of String(teks).matchAll(POLA_KLAIM)) {
      const k = m[0].toLowerCase();
      if (m.index > akhir) out.push({ t: teks.slice(akhir, m.index) });
      out.push({ t: m[0], jenis: kecil.includes(k) ? undefined : "klaim" });
      akhir = m.index + m[0].length;
    }
    if (akhir < teks.length) out.push({ t: teks.slice(akhir) });
    return out;
  };

  // Satu frasa: bagian di luar klaim distabilo kalau frasanya (tanpa klaim) muncul di hasil.
  let fakta = 0;
  const frasa = (teks) => {
    const potong = potongKlaim(teks);
    const inti = potong.filter((p) => !p.jenis).map((p) => p.t).join(" ").replace(/\s+/g, " ").trim();
    const pakai = dipakai(teks.trim()) || dipakai(inti);
    if (pakai) fakta++;
    // Spasi di tepi potongan tidak ikut distabilo.
    return potong.flatMap((p) => {
      if (p.jenis || !pakai || !p.t.trim()) return [p.jenis ? p : { t: p.t }];
      const [, kiri, inti, kanan] = p.t.match(/^(\s*)([\s\S]*?)(\s*)$/);
      return [kiri && { t: kiri }, { t: inti, jenis: "fakta" }, kanan && { t: kanan }].filter(Boolean);
    });
  };

  const baris = [];
  baris.push({ label: "Nama", isi: frasa(form.nama || "") });
  const unggul = String(form.keunggulan || "");
  if (unggul.trim()) {
    const isi = [];
    for (const [i, bagian] of unggul.split(/(,|;|\n|\.\s|\sdan\s)/i).entries()) {
      if (i % 2 === 1) isi.push({ t: bagian });
      else if (bagian) isi.push(...frasa(bagian));
    }
    baris.push({ label: "Keunggulan", isi });
  }
  const modal = Number(form.modal);
  if (modal > 0) {
    const titik = Math.round(modal).toLocaleString("id-ID");
    const pakai = kecil.includes(titik);
    if (pakai) fakta++;
    baris.push({ label: "Modal", isi: [{ t: "Rp" + titik, jenis: pakai ? "fakta" : undefined }] });
  }
  baris.push({ label: "Pembeli", isi: [{ t: form.target === "turis" ? "wisatawan" : "warga lokal" }] });

  const diIsian = new Set(cariKlaim([form.nama, form.keunggulan].join(" ")));
  const klaimDicoret = baris.flatMap((b) => b.isi).filter((p) => p.jenis === "klaim").length;
  const klaimBaru = [...new Set(cariKlaim(teksHasil))].filter((k) => !diIsian.has(k));
  return { baris, fakta, klaimDicoret, klaimBaru };
}

function Penghitung({ a }) {
  return (
    <p className="ls-hitung">
      <span><b>{a.fakta}</b> fakta dari isian dipakai</span>
      <span aria-hidden="true">·</span>
      <span className={a.klaimBaru.length ? "ls-buruk" : ""}><b>{a.klaimBaru.length}</b> klaim ditambahkan</span>
      <span className="ls-info" tabIndex={0} aria-describedby="ls-tip">
        <span aria-hidden="true">i</span>
        <span role="tooltip" id="ls-tip">
          Fakta dipakai: bagian isian Anda yang muncul lagi di hasil, ditandai stabilo. Klaim ditambahkan: kata seperti
          &ldquo;terbaik&rdquo; atau &ldquo;nomor satu&rdquo; yang muncul di hasil padahal tidak Anda tulis. Angka ini dihitung
          di peramban Anda, bukan dari pengakuan AI.
          {a.klaimBaru.length > 0 && <> Ditemukan: {a.klaimBaru.join(", ")}.</>}
        </span>
      </span>
    </p>
  );
}

/**
 * Lembar suntingan: Draf Anda (pena merah mencoret klaim, stabilo menyapu fakta) ⇄ Hasil Wicara.
 * putar: berubah setiap ada hasil baru dari tombol Sunting, memutar animasi lalu pindah ke Hasil.
 */
export function LembarSuntingan({ form, r, fakta, Stabilo, putar }) {
  const a = analisis(form, r);
  const [mode, setMode] = useState("draf");
  const [main, setMain] = useState(0);
  const disentuh = useRef(false);

  useEffect(() => {
    if (!putar) {
      setMode("hasil");
      return;
    }
    disentuh.current = false;
    setMode("draf");
    setMain((n) => n + 1);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => !disentuh.current && setMode("hasil"), 3600);
    return () => clearTimeout(t);
  }, [putar]);

  if (!a) return null;
  const pilih = (m) => {
    disentuh.current = true;
    if (m === "draf") setMain((n) => n + 1);
    setMode(m);
  };
  let urut = 0;

  return (
    <section className="lembar" aria-label="Lembar suntingan" data-tur="suntingan">
      <div className="ls-kepala">
        <div>
          <p className="ls-label">LEMBAR SUNTINGAN</p>
          <h2>{mode === "draf" ? "Draf Anda, setelah dicek" : "Hasil Wicara"}</h2>
        </div>
        <div className="ls-toggle" role="radiogroup" aria-label="Tampilan lembar">
          <button type="button" role="radio" aria-checked={mode === "draf"} onClick={() => pilih("draf")}>Draf Anda</button>
          <button type="button" role="radio" aria-checked={mode === "hasil"} onClick={() => pilih("hasil")}>Hasil Wicara</button>
          <i className={mode === "hasil" ? "ls-geser kanan" : "ls-geser"} aria-hidden="true" />
        </div>
      </div>

      {mode === "draf" ? (
        <div className="ls-draf" key={main}>
          {a.baris.map((b) => (
            <p key={b.label} className="ls-baris">
              <span className="ls-kunci">{b.label}</span>
              <span className="ls-isi">
                {b.isi.map((p, i) =>
                  p.jenis === "klaim" ? (
                    <span key={i} className="ls-coret" style={{ "--d": `${0.35 + urut++ * 0.32}s` }}>{p.t}<i aria-hidden="true" /><span className="sr"> (dicoret)</span></span>
                  ) : p.jenis === "fakta" ? (
                    <mark key={i} className="ls-sapu" style={{ "--d": `${0.35 + urut++ * 0.32}s` }}>{p.t}</mark>
                  ) : (
                    <span key={i}>{p.t}</span>
                  ),
                )}
              </span>
            </p>
          ))}
          <svg className="ls-pena" style={{ "--n": urut }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></svg>
        </div>
      ) : (
        <div className="ls-hasil">
          <p className="ls-baris">
            <span className="ls-kunci">Deskripsi</span>
            <span className="ls-isi">{Stabilo ? <Stabilo text={r.deskripsi_singkat} fakta={fakta} /> : r.deskripsi_singkat}</span>
          </p>
          <p className="ls-baris">
            <span className="ls-kunci">Caption</span>
            <span className="ls-isi">{Stabilo ? <Stabilo text={r.caption} fakta={fakta} /> : r.caption}</span>
          </p>
        </div>
      )}

      <div className="ls-grafik">
        <BatangSuntingan fakta={a.fakta} klaim={a.klaimDicoret} />
        <div className="ls-meter">
          <MeterTeks label="Panjang caption" nilai={`${r.caption}\n\n${(r.hashtags || []).join(" ")}`.length} batas={2200} satuan="karakter" />
          <MeterTeks label="Jumlah tagar" nilai={(r.hashtags || []).length} batas={30} satuan="tagar" />
          <p className="ls-meter-catat">Batas dari Instagram: caption 2.200 karakter, tagar 30 per postingan.</p>
        </div>
      </div>

      <div className="ls-kaki">
        <Penghitung a={a} />
        <p className="ls-legenda">
          <span><mark>stabilo</mark> fakta Anda</span>
          <span><span className="ls-coret statis">coretan</span> klaim kosong{a.klaimDicoret ? ` (${a.klaimDicoret})` : ""}</span>
        </p>
      </div>
    </section>
  );
}

export const LANGKAH_AI = ["Membaca isian", "Mengecek klaim", "Menulis 4 tulisan", "Menerjemahkan"];
const JEDA = [0, 1300, 2900, 4800];

/**
 * Stepper alur AI. Selama request jalan, langkah menyala bergantian (waktu dari klien);
 * langkah terakhir menunggu sampai hasil datang, lalu semua dicentang.
 */
export function StepperAI({ mulai, selesai, ringkas }) {
  const [kini, setKini] = useState(0);
  useEffect(() => {
    if (!mulai || selesai) return;
    const id = setInterval(() => setKini(performance.now() - mulai), 100);
    return () => clearInterval(id);
  }, [mulai, selesai]);

  const lama = selesai ? selesai - mulai : kini;
  const aktif = selesai ? LANGKAH_AI.length : JEDA.filter((j) => lama >= j).length - 1;

  return (
    <ol className={ringkas ? "stepper ringkas" : "stepper"} aria-label="Langkah AI">
      {LANGKAH_AI.map((l, i) => {
        const st = i < aktif ? "beres" : i === aktif ? "jalan" : "antre";
        return (
          <li key={l} className={st} aria-current={st === "jalan" ? "step" : undefined}>
            <span className="st-tanda" aria-hidden="true">
              {st === "beres" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              ) : (
                i + 1
              )}
            </span>
            <span className="st-teks">{l}</span>
            <span className="sr">{st === "beres" ? " selesai" : st === "jalan" ? " sedang berjalan" : " menunggu"}</span>
          </li>
        );
      })}
      {!ringkas && <li className="st-waktu" aria-hidden="true">{detik(lama)}</li>}
    </ol>
  );
}
