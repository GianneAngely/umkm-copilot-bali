"use client";

import { useEffect, useRef, useState } from "react";

const KATEGORI = ["Kuliner", "Kerajinan", "Fashion", "Oleh-oleh", "Lainnya"];
const HISTORY_KEY = "umkm-copilot-riwayat";
const EMPTY = { nama: "", kategori: "Kuliner", keunggulan: "", modal: "", target: "lokal" };

function rupiah(n) {
  return "Rp" + Number(n).toLocaleString("id-ID");
}

const ICONS = {
  copy: <><rect x="8" y="8" width="12" height="12" rx="2.5" /><path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  alert: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5M12 16.5v.01" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5v.01" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  pen: <><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></>,
  form: <><rect x="4" y="3" width="16" height="18" rx="2.5" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  send: <><path d="M20 4L10 14" /><path d="M20 4l-6 16-4-6-6-4z" /></>,
  arrow: <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>,
  store: <><path d="M4 9l1.5-5h13L20 9" /><path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9" /><path d="M5.5 11.5V20h13v-8.5" /><path d="M10 20v-5h4v5" /></>,
  hand: <><path d="M7 12V6.5a1.5 1.5 0 0 1 3 0V11" /><path d="M10 10.5v-6a1.5 1.5 0 0 1 3 0v6" /><path d="M13 10.5V6a1.5 1.5 0 0 1 3 0v6" /><path d="M16 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.5a6 6 0 0 1-4.6-2.2L4 15.5a1.6 1.6 0 0 1 2.4-2.1L7 14" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
};

function Icon({ name, className = "icon" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
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
    <section className={`card result-card ${className}`}>
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

const STEPS = [
  { icon: "form", title: "Isi data produk", text: "Nama, kategori, keunggulan, dan harga modal kalau ada. Cukup beberapa kalimat." },
  { icon: "pen", title: "AI menyusun tulisan", text: "Deskripsi, caption dengan hashtag, saran harga, dan versi Bahasa Inggris dibuat sekaligus." },
  { icon: "send", title: "Salin, lalu posting", text: "Periksa sebentar, tekan Salin, dan tempel di Instagram, WhatsApp, atau marketplace." },
];

const AUDIENCE = [
  { icon: "store", title: "Warung dan usaha kuliner", text: "Menu baru bisa langsung punya deskripsi dan caption tanpa harus pusing merangkai kata." },
  { icon: "hand", title: "Perajin dan pelaku fashion", text: "Cerita di balik bahan dan proses pembuatan tersampaikan dengan bahasa yang enak dibaca." },
  { icon: "globe", title: "Toko oleh-oleh", text: "Versi Bahasa Inggris siap pakai untuk wisatawan yang mampir ke Bali." },
];

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
    if (data && window.matchMedia("(max-width: 959px)").matches) {
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
      <a className="skip" href="#alat">Langsung ke alat</a>

      <header className="nav">
        <div className="container nav-inner">
          <a className="logo" href="#" aria-label="UMKM Copilot Bali, ke atas">
            <span className="logo-mark" aria-hidden="true">
              <Icon name="pen" className="logo-icon" />
            </span>
            <span className="logo-text">UMKM Copilot</span>
            <span className="badge">Bali • AI</span>
          </a>
          <nav className="nav-links" aria-label="Navigasi utama">
            <a className="nav-link" href="#cara-kerja">Cara kerja</a>
            <a className="btn btn-primary btn-sm" href="#alat">Coba sekarang</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <h1>Jualan lebih gampang, tulisannya biar AI yang bantu.</h1>
              <p className="lead">
                Ceritakan produk Anda dalam beberapa kalimat. UMKM Copilot menyiapkan deskripsi, caption
                promosi, saran harga, dan versi Bahasa Inggris untuk wisatawan, siap disalin dalam sekali klik.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary btn-lg" href="#alat">
                  Coba sekarang
                  <Icon name="arrow" />
                </a>
                <a className="btn btn-ghost btn-lg" href="#cara-kerja">Lihat cara kerjanya</a>
              </div>
              <p className="hero-note">Tidak perlu daftar akun. Langsung isi dan coba.</p>
            </div>

            <div className="preview" aria-label="Contoh hasil">
              <div className="preview-card">
                <div className="preview-head">
                  <span className="preview-product">Kopi Bubuk Kintamani</span>
                  <span className="preview-tag">Contoh hasil</span>
                </div>
                <p className="preview-label">Caption</p>
                <p className="preview-text">
                  Pagi di Bali belum lengkap tanpa secangkir kopi Kintamani. Aromanya harum, asamnya segar,
                  digiling dari biji arabika petani lokal. Pesan lewat WhatsApp, kami kirim hari ini juga.
                </p>
                <div className="preview-tags">
                  <span>#KopiKintamani</span><span>#ProdukLokalBali</span><span>#OlehOlehBali</span>
                </div>
                <div className="preview-row">
                  <div>
                    <p className="preview-label">Saran harga</p>
                    <p className="preview-price">Rp45.000 – Rp55.000</p>
                  </div>
                  <span className="preview-copied"><Icon name="check" /> Tersalin</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="band" id="cara-kerja" aria-labelledby="cara-kerja-title">
          <div className="container">
            <h2 className="section-title" id="cara-kerja-title">Cara kerja</h2>
            <p className="section-lead">Tiga langkah, biasanya selesai dalam satu menit.</p>
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li className="step" key={s.title}>
                  <div className="step-top">
                    <span className="step-icon"><Icon name={s.icon} /></span>
                    <span className="step-num">Langkah {i + 1}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="tool" id="alat" aria-labelledby="alat-title">
          <div className="container">
            <h2 className="section-title" id="alat-title">Buat materi pemasaran</h2>
            <p className="section-lead">Isi formulir di bawah. Hasilnya muncul di sebelah kanan, atau di bawah kalau Anda memakai HP.</p>

            <div className="tool-grid">
              <form className="card form" onSubmit={submit}>
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
                    Harga modal per unit <span className="optional">opsional</span>
                  </span>
                  <span className="money">
                    <span className="money-prefix" aria-hidden="true">Rp</span>
                    <input name="modal" type="number" min="0" inputMode="numeric" value={form.modal}
                      onChange={update} placeholder="15000" />
                  </span>
                </label>
                <fieldset className="field">
                  <legend className="field-label">Target pasar</legend>
                  <div className="segmented">
                    <label>
                      <input type="radio" name="target" value="lokal" checked={form.target === "lokal"} onChange={update} />
                      <span>Lokal</span>
                    </label>
                    <label>
                      <input type="radio" name="target" value="turis" checked={form.target === "turis"} onChange={update} />
                      <span>Turis</span>
                    </label>
                  </div>
                </fieldset>
                <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
                  {loading && <span className="spinner" aria-hidden="true" />}
                  {loading ? "Sedang menyusun..." : "Buat materi pemasaran"}
                </button>
                {error && (
                  <div className="error" role="alert">
                    <Icon name="alert" />
                    <div>
                      <p className="error-title">Belum berhasil</p>
                      <p>{error}</p>
                    </div>
                  </div>
                )}

                {history.length > 0 && (
                  <div className="history">
                    <h3 className="history-title">Riwayat terakhir</h3>
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
                    <div className="empty-art" aria-hidden="true">
                      <span /><span /><span />
                    </div>
                    <p className="empty-title">Hasil akan muncul di sini</p>
                    <p className="empty-text">Setelah Anda menekan tombol, kami siapkan:</p>
                    <ul className="empty-list">
                      <li><Icon name="check" />Deskripsi produk, versi singkat dan bercerita</li>
                      <li><Icon name="check" />Caption Instagram atau WhatsApp beserta hashtag</li>
                      <li><Icon name="check" />Saran rentang harga jual dan alasannya</li>
                      <li><Icon name="check" />Versi Bahasa Inggris untuk wisatawan</li>
                    </ul>
                  </div>
                )}
                {!r && loading && (
                  <div className="result-stack" role="status">
                    <p className="loading-note">
                      <span className="spinner" aria-hidden="true" />
                      Sedang menyusun materi pemasaran, biasanya hanya beberapa detik.
                    </p>
                    {[0, 1, 2].map((i) => (
                      <div className="card result-card skeleton" key={i} aria-hidden="true">
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
                    <div className="results-head">
                      <h3>Hasil untuk Anda</h3>
                      {data.mode === "mock" && <span className="mode-badge">Mode contoh</span>}
                    </div>
                    {data.mode === "mock" && (
                      <p className="notice">
                        <Icon name="info" />
                        <span>
                          API key belum dipasang, jadi hasil di bawah adalah contoh statis.
                        </span>
                      </p>
                    )}
                    <Section title="Deskripsi singkat" text={r.deskripsi_singkat} />
                    <Section title="Deskripsi bercerita" text={r.deskripsi_cerita} />
                    <Section title="Caption + hashtag" text={captionFull}>
                      <p className="body">{r.caption}</p>
                      <ul className="chips">
                        {r.hashtags.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </Section>
                    <Section title="Saran harga jual" text={hargaText}>
                      <p className="price">{rupiah(r.harga.min)} – {rupiah(r.harga.max)}</p>
                      <p className="body muted">{r.harga.alasan}</p>
                    </Section>
                    <Section title="English version" text={englishText} className="card-english">
                      <p className="body" lang="en">{r.english.description}</p>
                      <p className="body" lang="en">{r.english.caption}</p>
                    </Section>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="band" aria-labelledby="siapa-title">
          <div className="container">
            <h2 className="section-title" id="siapa-title">Untuk siapa</h2>
            <p className="section-lead">Dibuat untuk pelaku usaha kecil di Bali yang ingin tampil rapi di media sosial dan marketplace.</p>
            <ul className="audience">
              {AUDIENCE.map((a) => (
                <li key={a.title}>
                  <span className="step-icon"><Icon name={a.icon} /></span>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="container foot-inner">
          <p className="foot-disclosure">
            Teks dibuat dengan bantuan AI (Google Gemini). Periksa kembali sebelum diunggah.
          </p>
          <p className="foot-meta">
            © 2026 Gianne Angely · AI Web Innovation Challenge, Bali Digifest 2026
          </p>
        </div>
      </footer>
    </>
  );
}
