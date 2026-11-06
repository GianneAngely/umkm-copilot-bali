"use client";

import { useEffect, useRef, useState } from "react";

const KATEGORI = ["Kuliner", "Kerajinan", "Fashion", "Oleh-oleh", "Lainnya"];
const HISTORY_KEY = "umkm-copilot-riwayat";
const EMPTY = { nama: "", kategori: "Kuliner", keunggulan: "", modal: "", target: "lokal" };

function rupiah(n) {
  return "Rp" + Number(n).toLocaleString("id-ID");
}

function Icon({ name }) {
  const paths = {
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
    check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
    alert: <><path d="M12 4l9 16H3z" /><path d="M12 10v4M12 17.5v.01" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5v.01" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  };
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
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
    <section className={`card ${className}`}>
      <div className="card-head">
        <h3>{title}</h3>
        <CopyButton text={text} />
      </div>
      {children ?? <p className="body">{text}</p>}
    </section>
  );
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

export default function Home() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const resultsRef = useRef(null);

  useEffect(() => setHistory(loadHistory()), []);

  // Di HP hasil muncul di bawah form, jadi geser layar ke hasil begitu tersedia.
  useEffect(() => {
    if (data && window.matchMedia("(max-width: 879px)").matches) {
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

  return (
    <>
      <header className="top">
        <div className="top-inner">
          <h1>UMKM Copilot Bali</h1>
          <p>
            Isi data produk Anda, lalu dapatkan deskripsi, caption promosi, saran harga, dan versi
            Bahasa Inggris yang bisa langsung dipakai.
          </p>
        </div>
      </header>

      <main className="layout">
        <form className="form" onSubmit={submit}>
          <h2 className="form-title">Data produk</h2>
          <label className="field">
            <span className="field-label">Nama produk</span>
            <input name="nama" value={form.nama} onChange={update} required maxLength={100}
              placeholder="Contoh: Pie Susu Bu Made" />
          </label>
          <label className="field">
            <span className="field-label">Kategori</span>
            <select name="kategori" value={form.kategori} onChange={update}>
              {KATEGORI.map((k) => <option key={k}>{k}</option>)}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Bahan atau keunggulan</span>
            <textarea name="keunggulan" value={form.keunggulan} onChange={update} rows={3}
              maxLength={500} placeholder="Contoh: dibuat dari susu sapi segar, tanpa pengawet, renyah tahan 7 hari" />
          </label>
          <label className="field">
            <span className="field-label">
              Harga modal per unit <span className="optional">(opsional)</span>
            </span>
            <span className="money">
              <span className="money-prefix" aria-hidden="true">Rp</span>
              <input name="modal" type="number" min="0" inputMode="numeric" value={form.modal}
                onChange={update} placeholder="Contoh: 15000" />
            </span>
          </label>
          <fieldset className="field">
            <legend className="field-label">Target pasar</legend>
            <div className="choices">
              <label className="choice">
                <input type="radio" name="target" value="lokal" checked={form.target === "lokal"} onChange={update} />
                Pembeli lokal
              </label>
              <label className="choice">
                <input type="radio" name="target" value="turis" checked={form.target === "turis"} onChange={update} />
                Wisatawan
              </label>
            </div>
          </fieldset>
          <button type="submit" className="primary" disabled={loading}>
            {loading && <span className="spinner" aria-hidden="true" />}
            {loading ? "Sedang menyusun..." : "Buat materi pemasaran"}
          </button>
          {error && (
            <div className="error" role="alert">
              <Icon name="alert" />
              <p>{error}</p>
            </div>
          )}

          {history.length > 0 && (
            <div className="history">
              <h4>Riwayat terakhir</h4>
              <ul>
                {history.map((h) => (
                  <li key={h.at}>
                    <button type="button" onClick={() => openHistory(h)}>
                      <Icon name="clock" />
                      <span className="history-name">{h.form.nama}</span>
                      <span className="history-cat">{h.form.kategori}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>

        <div className="results" ref={resultsRef} aria-live="polite" aria-busy={loading}>
          {!r && !loading && (
            <div className="empty">
              <p className="empty-title">Hasil akan muncul di sini setelah Anda menekan tombol.</p>
              <ul>
                <li>Deskripsi produk, versi singkat dan bercerita</li>
                <li>Caption Instagram atau WhatsApp beserta hashtag</li>
                <li>Saran rentang harga jual dan alasannya</li>
                <li>Versi Bahasa Inggris untuk wisatawan</li>
              </ul>
            </div>
          )}
          {!r && loading && (
            <div className="skeleton" role="status">
              <p className="skeleton-note">
                <span className="spinner" aria-hidden="true" />
                Sedang menyusun materi pemasaran. Biasanya hanya beberapa detik.
              </p>
              {[0, 1, 2].map((i) => (
                <div className="card skeleton-card" key={i} aria-hidden="true">
                  <span className="bar bar-title" />
                  <span className="bar" />
                  <span className="bar" />
                  <span className="bar bar-short" />
                </div>
              ))}
            </div>
          )}
          {r && (
            <div className={loading ? "result-stack is-stale" : "result-stack"}>
              {data.mode === "mock" && (
                <p className="notice">
                  <Icon name="info" />
                  <span>
                    <strong>Mode contoh:</strong> API key belum dipasang, jadi hasil di bawah adalah
                    contoh statis.
                  </span>
                </p>
              )}
              <Section title="Deskripsi singkat" text={r.deskripsi_singkat} />
              <Section title="Deskripsi bercerita" text={r.deskripsi_cerita} />
              <Section title="Caption promosi + hashtag" text={captionFull}>
                <p className="body">{r.caption}</p>
                <ul className="tags">
                  {r.hashtags.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </Section>
              <Section title="Saran harga jual" text={hargaText} className="card-price">
                <p className="price">{rupiah(r.harga.min)} – {rupiah(r.harga.max)}</p>
                <p className="body">{r.harga.alasan}</p>
              </Section>
              <Section title="Versi Bahasa Inggris" text={englishText} className="card-english">
                <p className="body" lang="en">{r.english.description}</p>
                <p className="body" lang="en">{r.english.caption}</p>
              </Section>
            </div>
          )}
        </div>
      </main>

      <footer className="foot">
        Teks dibuat dengan bantuan AI (Gemini, Google). Periksa kembali sebelum diunggah.
      </footer>
    </>
  );
}
