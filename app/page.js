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
  chevron: <path d="M6 9l6 6 6-6" />,
  kunci: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  coret: <><path d="M4 12h16" /><path d="M6 7h8M6 17h11" /></>,
  peramban: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01" /></>,
};

function Icon({ name }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
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
    <section className={`kartu struk ${className}`}>
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

function Kepala({ no, id, judul, lead }) {
  return (
    <div className="kepala">
      <Cap no={no} />
      <h2 id={id}>{judul}</h2>
      {lead && <p className="kepala-lead">{lead}</p>}
    </div>
  );
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

const PERCAYA = [
  { icon: "kunci", judul: "Google Gemini, instruksi dikunci di server",
    teks: "Aturan penulisan disimpan di server dan tidak bisa diubah dari peramban. API key tidak pernah sampai ke HP Anda." },
  { icon: "coret", judul: "Hanya fakta dari isian Anda",
    teks: "AI dilarang mengarang sertifikat, penghargaan, atau lokasi. Kata yang berasal dari isian Anda diberi stabilo supaya mudah dicek." },
  { icon: "peramban", judul: "Tidak disimpan di server kami",
    teks: "Isian hanya dikirim ke Gemini untuk diproses. Riwayat lima nota terakhir tersimpan di peramban Anda sendiri." },
];

const FAQ = [
  ["Apakah gratis?", "Ya. UMKM Copilot bisa dipakai tanpa biaya."],
  ["Perlu daftar akun?", "Tidak. Buka halaman, isi nota, langsung jadi."],
  ["Hasilnya boleh diubah?", "Boleh, dan sebaiknya begitu. Salin hasilnya, sesuaikan dengan gaya toko Anda, lalu periksa lagi sebelum diunggah."],
  ["Apakah data saya aman?", "Isian dikirim ke Google Gemini hanya untuk menyusun tulisan dan tidak disimpan di server kami. Riwayat ada di peramban Anda dan hilang kalau data peramban dihapus."],
  ["Bisa bahasa selain Indonesia?", "Saat ini hasilnya dalam Bahasa Indonesia, ditambah satu versi Bahasa Inggris untuk wisatawan."],
];

export default function Home() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [faktaForm, setFaktaForm] = useState(null);
  const [menyusut, setMenyusut] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => setHistory(loadHistory()), []);

  // Navbar menyusut jadi pil setelah halaman digulir.
  useEffect(() => {
    const cek = () => setMenyusut(window.scrollY > 24);
    cek();
    window.addEventListener("scroll", cek, { passive: true });
    return () => window.removeEventListener("scroll", cek);
  }, []);

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

      <header className={menyusut ? "nav is-pil" : "nav"}>
        <div className="nav-bar">
          <a className="logo" href="#" aria-label="UMKM Copilot Bali, ke atas">
            <i className="logo-mark" aria-hidden="true" />
            <span className="logo-text">UMKM Copilot</span>
            <span className="logo-cap">BALI · AI</span>
          </a>
          <nav className="nav-links" aria-label="Navigasi utama">
            <a className="nav-link" href="#cara-kerja">Cara kerja</a>
            <a className="nav-link" href="#faq">FAQ</a>
            <a className="btn btn-utama btn-sm" href="#alat">Coba sekarang</a>
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
                <a className="btn btn-utama btn-lg" href="#alat">Tulis nota sekarang <Icon name="arrow" /></a>
                <a className="btn btn-garis btn-lg" href="#cara-kerja">Lihat cara kerja</a>
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

        <section className="bagian" id="cara-kerja" aria-labelledby="cara-judul">
          <div className="wrap">
            <Kepala no={2} id="cara-judul" judul="Dari coretan ke nota promosi" />
            <ol className="grid-3">
              <li className="kartu langkah">
                <p className="langkah-no">Langkah 1</p>
                <div className="langkah-vis"><p>pie susu enak murah, tahan 7 hari</p></div>
                <h3>Tulis seadanya</h3>
                <p>Lima isian singkat tentang produk Anda.</p>
              </li>
              <li className="kartu langkah">
                <p className="langkah-no">Langkah 2</p>
                <div className="langkah-vis"><p>pie susu <del>enak murah</del>, <mark className="stabilo">tahan 7 hari</mark></p></div>
                <h3>Pena merah menyunting</h3>
                <p>Klaim kosong dicoret, fakta Anda disorot.</p>
              </li>
              <li className="kartu langkah">
                <p className="langkah-no">Langkah 3</p>
                <div className="langkah-vis struk-mini">
                  <span>DESKRIPSI</span><span>CAPTION</span><span>HARGA</span><span>ENGLISH</span>
                </div>
                <h3>Cetak, salin, posting</h3>
                <p>Empat tulisan siap ditempel di Instagram, WhatsApp, atau marketplace.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="bagian alat" id="alat" aria-labelledby="alat-judul">
          <div className="wrap">
            <Kepala no={3} id="alat-judul" judul="Tulis nota Anda"
              lead="Isi data produk di nota. Hasilnya muncul di sebelah kanan, atau di bawah kalau Anda memakai HP." />

            <div className="alat-grid">
              <form className="kartu nota-form" onSubmit={submit}>
                <p className="nota-judul"><span>NOTA PRODUK</span><span>5 ISIAN</span></p>
                <label className="field">
                  <span className="field-label">Nama produk</span>
                  <input name="nama" value={form.nama} onChange={update} required maxLength={100}
                    placeholder="Contoh: Pie Susu Bu Made" />
                </label>
                <div className="duo">
                  <label className="field">
                    <span className="field-label">Kategori</span>
                    <select name="kategori" value={form.kategori} onChange={update}>
                      {KATEGORI.map((k) => <option key={k}>{k}</option>)}
                    </select>
                  </label>
                  <label className="field">
                    <span className="field-label">Modal per unit <span className="optional">opsional</span></span>
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
                    maxLength={500} placeholder="Contoh: susu sapi asli, tanpa pengawet, tahan 7 hari" />
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
                <button type="submit" className="btn btn-utama btn-lg btn-block" disabled={loading}>
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
                    <h3 className="riwayat-judul">NOTA SEBELUMNYA</h3>
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
                  <div className="kartu kosong">
                    <p className="nota-judul"><span>STRUK PROMOSI</span><span>BELUM DICETAK</span></p>
                    <p className="kosong-judul">Struk akan tercetak di sini</p>
                    <p className="kosong-teks">Isi nota, lalu tekan Sunting dan cetak. Anda akan mendapat:</p>
                    <ul className="kosong-stub">
                      <li><b>DESKRIPSI</b>versi singkat dan bercerita</li>
                      <li><b>CAPTION</b>siap posting, dengan hashtag</li>
                      <li><b>HARGA</b>rentang harga jual dan alasannya</li>
                      <li><b>ENGLISH</b>untuk wisatawan</li>
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
                    <Section title="SARAN HARGA JUAL" text={hargaText}>
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

        <section className="bagian" aria-labelledby="percaya-judul">
          <div className="wrap">
            <Kepala no={4} id="percaya-judul" judul="Kenapa bisa dipercaya" />
            <ul className="grid-3">
              {PERCAYA.map((p) => (
                <li className="kartu percaya" key={p.judul}>
                  <span className="percaya-ikon"><Icon name={p.icon} /></span>
                  <h3>{p.judul}</h3>
                  <p>{p.teks}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bagian" id="faq" aria-labelledby="faq-judul">
          <div className="wrap faq-grid">
            <Kepala no={5} id="faq-judul" judul="Pertanyaan yang sering muncul"
              lead="Belum terjawab? Coba saja dulu, tidak perlu daftar." />
            <div className="kartu faq">
              {FAQ.map(([q, a]) => (
                <details key={q}>
                  <summary>{q}<Icon name="chevron" /></summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot-grid">
          <div className="foot-merek">
            <a className="logo" href="#" aria-label="UMKM Copilot Bali, ke atas">
              <i className="logo-mark" aria-hidden="true" />
              <span className="logo-text">UMKM Copilot</span>
            </a>
            <p>Asisten menulis untuk UMKM Bali: deskripsi produk, caption, saran harga, dan versi Inggris dari satu nota.</p>
          </div>
          <nav className="foot-links" aria-label="Tautan footer">
            <a href="#cara-kerja">Cara kerja</a>
            <a href="#alat">Coba</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="foot-info">
            <p className="foot-disclosure">Teks dibuat dengan bantuan AI (Google Gemini). Periksa kembali sebelum diunggah.</p>
            <p>Dibuat oleh Gianne Angely, Universitas Dhyana Pura.</p>
            <p className="foot-meta">© 2026 · AI Web Innovation Challenge, Bali Digifest 2026</p>
          </div>
        </div>
      </footer>
    </>
  );
}
