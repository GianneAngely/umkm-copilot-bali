"use client";

import { useEffect, useState } from "react";

const KATEGORI = ["Kuliner", "Kerajinan", "Fashion", "Oleh-oleh", "Lainnya"];
const HISTORY_KEY = "umkm-copilot-riwayat";
const EMPTY = { nama: "", kategori: "Kuliner", keunggulan: "", modal: "", target: "lokal" };

function rupiah(n) {
  return "Rp" + Number(n).toLocaleString("id-ID");
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button type="button" className="copy" onClick={copy}>
      {copied ? "Tersalin" : "Salin"}
    </button>
  );
}

function Section({ title, text, children }) {
  return (
    <section className="card">
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

  useEffect(() => setHistory(loadHistory()), []);

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
      const next = [{ form, ...json, at: Date.now() }, ...history].slice(0, 5);
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
    <main>
      <header className="top">
        <h1>UMKM Copilot Bali</h1>
        <p>
          Isi data produk Anda, lalu dapatkan deskripsi, caption promosi, saran harga, dan versi
          Bahasa Inggris yang bisa langsung dipakai.
        </p>
      </header>

      <div className="layout">
        <form className="form" onSubmit={submit}>
          <label>
            Nama produk
            <input name="nama" value={form.nama} onChange={update} required maxLength={100}
              placeholder="Contoh: Pie Susu Bu Made" />
          </label>
          <label>
            Kategori
            <select name="kategori" value={form.kategori} onChange={update}>
              {KATEGORI.map((k) => <option key={k}>{k}</option>)}
            </select>
          </label>
          <label>
            Bahan atau keunggulan
            <textarea name="keunggulan" value={form.keunggulan} onChange={update} rows={3}
              maxLength={500} placeholder="Contoh: dibuat dari susu sapi segar, tanpa pengawet, renyah tahan 7 hari" />
          </label>
          <label>
            Harga modal per unit (opsional)
            <input name="modal" type="number" min="0" inputMode="numeric" value={form.modal}
              onChange={update} placeholder="Contoh: 15000" />
          </label>
          <fieldset>
            <legend>Target pasar</legend>
            <label className="radio">
              <input type="radio" name="target" value="lokal" checked={form.target === "lokal"} onChange={update} />
              Pembeli lokal
            </label>
            <label className="radio">
              <input type="radio" name="target" value="turis" checked={form.target === "turis"} onChange={update} />
              Wisatawan
            </label>
          </fieldset>
          <button type="submit" className="primary" disabled={loading}>
            {loading ? "Sedang menyusun..." : "Buat materi pemasaran"}
          </button>
          {error && <p className="error" role="alert">{error}</p>}

          {history.length > 0 && (
            <div className="history">
              <h4>Riwayat terakhir</h4>
              <ul>
                {history.map((h) => (
                  <li key={h.at}>
                    <button type="button" onClick={() => openHistory(h)}>{h.form.nama}</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>

        <div className="results" aria-live="polite">
          {!r && !loading && (
            <p className="empty">Hasil akan muncul di sini setelah Anda menekan tombol.</p>
          )}
          {r && (
            <>
              {data.mode === "mock" && (
                <p className="notice">
                  Mode contoh: API key belum dipasang, jadi hasil di bawah adalah contoh statis.
                </p>
              )}
              <Section title="Deskripsi singkat" text={r.deskripsi_singkat} />
              <Section title="Deskripsi bercerita" text={r.deskripsi_cerita} />
              <Section title="Caption promosi + hashtag" text={captionFull}>
                <p className="body">{r.caption}</p>
                <p className="tags">{r.hashtags.join(" ")}</p>
              </Section>
              <Section title="Saran harga jual" text={hargaText}>
                <p className="price">{rupiah(r.harga.min)} – {rupiah(r.harga.max)}</p>
                <p className="body">{r.harga.alasan}</p>
              </Section>
              <Section title="Versi Bahasa Inggris" text={englishText}>
                <p className="body">{r.english.description}</p>
                <p className="body">{r.english.caption}</p>
              </Section>
            </>
          )}
        </div>
      </div>

      <footer className="foot">
        Teks dibuat dengan bantuan AI (Claude, Anthropic). Periksa kembali sebelum diunggah.
      </footer>
    </main>
  );
}
