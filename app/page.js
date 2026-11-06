"use client";

import { useEffect, useRef, useState } from "react";
import Kolase from "./components/Kolase";
import PenaSunting from "./components/PenaSunting";
import { Stabilo, buatFakta, hitungFakta } from "./components/Stabilo";

const KATEGORI = ["Kuliner", "Kerajinan", "Fashion", "Oleh-oleh", "Lainnya"];
const HISTORY_KEY = "umkm-copilot-riwayat";
const EMPTY = { nama: "", kategori: "Kuliner", keunggulan: "", modal: "", target: "lokal" };

function rupiah(n) {
  return "Rp" + Number(n).toLocaleString("id-ID");
}

const ICONS = {
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  alert: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5M12 16.5v.01" /></>,
  arrow: <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>,
};

function Icon({ name }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button type="button" className={copied ? "copy is-copied" : "copy"} onClick={copy}>
      <Icon name={copied ? "check" : "copy"} />
      {copied ? "Tersalin" : "Salin"}
    </button>
  );
}

function Section({ title, text, className = "", children }) {
  return (
    <section className={`kertas struk ${className}`}>
      <div className="struk-head">
        <h3>{title}</h3>
        <CopyButton text={text} />
      </div>
      {children ?? <p className="body">{text}</p>}
    </section>
  );
}

function Cap({ no }) {
  return <span className="cap">NOTA No. {String(no).padStart(2, "0")}</span>;
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

const JUDUL = [
  ["Coretan"], ["jualan"], ["Anda,"], ["disunting", "merah"], ["jadi"], ["nota"],
  ["siap", "hijau"], ["pajang.", "hijau"],
];

export default function Home() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [faktaForm, setFaktaForm] = useState(null);
  const resultsRef = useRef(null);

  useEffect(() => setHistory(loadHistory()), []);

  // Simpan isian yang menghasilkan struk ini untuk stabilo, lalu di HP geser ke hasil.
  useEffect(() => {
    if (!data) return;
    setFaktaForm(form);
    if (window.matchMedia("(max-width: 959px)").matches) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [data]);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Terjadi kesalahan.");
      setData(json);
      const others = history.filter((h) => h.form.nama !== form.nama);
      const next = [{ form, ...json, at: Date.now() }, ...others].slice(0, 5);
      setHistory(next);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {}
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openHistory(item) {
    setForm(item.form);
    setData({ mode: item.mode, result: item.result });
  }

  const r = data?.result;
  const captionFull = r ? `${r.caption}\n\n${r.hashtags.join(" ")}` : "";
  const hargaText = r ? `${rupiah(r.harga.min)} – ${rupiah(r.harga.max)}\n${r.harga.alasan}` : "";
  const englishText = r ? `${r.english.description}\n\n${r.english.caption}` : "";

  const fakta = buatFakta(faktaForm);
  const jumlahFakta = r
    ? hitungFakta([r.deskripsi_singkat, r.deskripsi_cerita, r.caption, r.harga.alasan, englishText], fakta)
    : 0;

  return (
    <>
      <a className="skip" href="#alat">Langsung ke formulir</a>

      <header className="nav">
        <div className="wrap pill">
          <a className="logo" href="#" aria-label="UMKM Copilot Bali, ke atas">
            <i className="logo-mark" aria-hidden="true" />
            <span className="logo-text">UMKM Copilot</span>
            <span className="logo-cap">BALI · AI</span>
          </a>
          <nav className="nav-links" aria-label="Navigasi utama">
            <a className="nav-link" href="#cara-kerja">Cara kerja</a>
            <a className="btn btn-tinta btn-sm" href="#alat">Coba sekarang</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-teks">
              <Cap no={1} />
              <h1>
                {JUDUL.map(([kata, warna], i) => (
                  <span key={i} className={`kata ${warna || ""}`} style={{ "--i": i }}>{kata} </span>
                ))}
              </h1>
              <p className="sub">
                Tulis seadanya. Pena merah mencoret klaim kosong, menyorot fakta dari Anda, lalu mencetak
                deskripsi, caption, harga, dan versi Inggris.
              </p>
              <div className="cta">
                <a className="btn btn-tinta btn-lg" href="#alat">Tulis nota sekarang <Icon name="arrow" /></a>
                <span className="cta-note">tanpa daftar akun</span>
              </div>
              <ul className="legend" aria-label="Arti warna">
                <li><i className="sw-merah" />coretan pena merah</li>
                <li><i className="sw-stabilo" />fakta dari isian Anda</li>
                <li><i className="sw-hijau" />siap dipakai</li>
              </ul>
            </div>
            <Kolase />
          </div>
        </section>

        <section className="cara" id="cara-kerja" aria-labelledby="cara-judul">
          <div className="wrap">
            <div className="kepala">
              <Cap no={2} />
              <h2 id="cara-judul">Dari coretan ke nota promosi</h2>
            </div>
            <ol className="langkah">
              <li className="kertas">
                <p className="langkah-no">1</p>
                <div className="langkah-vis tangan">pie susu enak murah,<br />tahan 7 hari</div>
                <h3>Tulis seadanya</h3>
                <p>Lima isian, boleh singkat.</p>
              </li>
              <li className="kertas">
                <p className="langkah-no">2</p>
                <div className="langkah-vis tangan">pie susu <del>enak murah</del>,<br /><mark className="stabilo">tahan 7 hari</mark></div>
                <h3>Pena merah menyunting</h3>
                <p>Klaim kosong dicoret, fakta Anda disorot.</p>
              </li>
              <li className="kertas">
                <p className="langkah-no">3</p>
                <div className="langkah-vis struk-mini">
                  <span>DESKRIPSI</span><span>CAPTION</span><span>HARGA</span><span>ENGLISH</span>
                  <b><Icon name="check" />Tersalin</b>
                </div>
                <h3>Cetak, salin, posting</h3>
                <p>Empat struk siap ditempel.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="alat" id="alat" aria-labelledby="alat-judul">
          <div className="wrap">
            <div className="kepala kepala-terang">
              <Cap no={3} />
              <h2 id="alat-judul">Tulis nota Anda</h2>
            </div>

            <div className="alat-grid">
              <form className="kertas nota-form" onSubmit={submit}>
                <p className="nota-judul">NOTA PRODUK</p>
                <label className="field">
                  <span className="field-label">Nama produk</span>
                  <input name="nama" value={form.nama} onChange={update} required maxLength={100}
                    placeholder="Pie Susu Bu Made" />
                </label>
                <div className="duo">
                  <label className="field">
                    <span className="field-label">Kategori</span>
                    <select name="kategori" value={form.kategori} onChange={update}>
                      {KATEGORI.map((k) => <option key={k}>{k}</option>)}
                    </select>
                  </label>
                  <label className="field">
                    <span className="field-label">Modal per biji <span className="optional">boleh kosong</span></span>
                    <span className="money">
                      <span className="money-prefix" aria-hidden="true">Rp</span>
                      <input name="modal" type="number" min="0" inputMode="numeric" value={form.modal}
                        onChange={update} placeholder="15000" />
                    </span>
                  </label>
                </div>
                <label className="field">
                  <span className="field-label">Bahan atau keunggulan</span>
                  <textarea name="keunggulan" value={form.keunggulan} onChange={update} rows={3}
                    maxLength={500} placeholder="susu sapi asli, tanpa pengawet, tahan 7 hari" />
                </label>
                <fieldset className="field">
                  <legend className="field-label">Pembelinya kebanyakan</legend>
                  <div className="segmented">
                    <label>
                      <input type="radio" name="target" value="lokal" checked={form.target === "lokal"} onChange={update} />
                      <span>Warga lokal</span>
                    </label>
                    <label>
                      <input type="radio" name="target" value="turis" checked={form.target === "turis"} onChange={update} />
                      <span>Wisatawan</span>
                    </label>
                  </div>
                </fieldset>
                <button type="submit" className="btn btn-tinta btn-lg btn-block" disabled={loading}>
                  {loading && <span className="spinner" aria-hidden="true" />}
                  {loading ? "Sedang menyunting..." : "Sunting dan cetak"}
                </button>
                {error && (
                  <div className="galat" role="alert">
                    <Icon name="alert" />
                    <div>
                      <p className="galat-judul">Belum berhasil</p>
                      <p>{error}</p>
                    </div>
                  </div>
                )}

                {history.length > 0 && (
                  <div className="riwayat">
                    <h3 className="riwayat-judul">Nota sebelumnya</h3>
                    <ul>
                      {history.map((h) => (
                        <li key={h.at}>
                          <button type="button" onClick={() => openHistory(h)}>
                            <span className="riwayat-nama">{h.form.nama}</span>
                            <span className="riwayat-kat">{h.form.kategori}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </form>

              <div className="results" ref={resultsRef} aria-live="polite" aria-busy={loading}>
                {!r && !loading && (
                  <div className="kertas kosong">
                    <p className="kosong-judul">Struk akan tercetak di sini</p>
                    <p className="kosong-teks">Isi nota di sebelah, lalu tekan Sunting dan cetak.</p>
                    <ul className="kosong-stub">
                      <li>DESKRIPSI</li><li>CAPTION</li><li>HARGA</li><li>ENGLISH</li>
                    </ul>
                  </div>
                )}
                {!r && loading && <PenaSunting form={form} />}
                {r && (
                  <div className={loading ? "tumpuk is-stale" : "tumpuk"}>
                    <div className="hasil-head">
                      <p className="hasil-fakta">
                        <mark className="stabilo">{jumlahFakta} fakta</mark> dari isian Anda dipakai
                      </p>
                      {data.mode === "mock" && <span className="mode-cap">MODE CONTOH</span>}
                    </div>
                    {data.mode === "mock" && (
                      <p className="notice">API key belum dipasang, jadi hasil di bawah adalah contoh statis.</p>
                    )}
                    <Section title="DESKRIPSI SINGKAT" text={r.deskripsi_singkat}>
                      <p className="body"><Stabilo text={r.deskripsi_singkat} fakta={fakta} /></p>
                    </Section>
                    <Section title="DESKRIPSI BERCERITA" text={r.deskripsi_cerita}>
                      <p className="body"><Stabilo text={r.deskripsi_cerita} fakta={fakta} /></p>
                    </Section>
                    <Section title="CAPTION + HASHTAG" text={captionFull}>
                      <p className="body"><Stabilo text={r.caption} fakta={fakta} /></p>
                      <ul className="chips">
                        {r.hashtags.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </Section>
                    <Section title="SARAN HARGA JUAL" text={hargaText} className="struk-harga">
                      <p className="price">{rupiah(r.harga.min)} – {rupiah(r.harga.max)}</p>
                      <p className="body"><Stabilo text={r.harga.alasan} fakta={fakta} /></p>
                    </Section>
                    <Section title="ENGLISH" text={englishText}>
                      <p className="body" lang="en"><Stabilo text={r.english.description} fakta={fakta} /></p>
                      <p className="body" lang="en"><Stabilo text={r.english.caption} fakta={fakta} /></p>
                    </Section>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot-inner">
          <p className="foot-disclosure">
            Teks dibuat dengan bantuan AI (Google Gemini). Periksa kembali sebelum diunggah.
          </p>
          <p className="foot-meta">© 2026 Gianne Angely · AI Web Innovation Challenge, Bali Digifest 2026</p>
        </div>
      </footer>
    </>
  );
}
