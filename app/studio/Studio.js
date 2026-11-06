"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon";
import PenaSunting from "../components/PenaSunting";
import { Stabilo, buatFakta, hitungFakta } from "../components/Stabilo";
import { Section, rupiah } from "../components/Struk";

const KATEGORI = ["Kuliner", "Kerajinan", "Fashion", "Oleh-oleh", "Lainnya"];
const HISTORY_KEY = "umkm-copilot-riwayat";
const EMPTY = { nama: "", kategori: "Kuliner", keunggulan: "", modal: "", target: "lokal" };

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function waktu(at) {
  return new Date(at).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function Studio() {
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
    if (window.matchMedia("(max-width: 1099px)").matches) {
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

  const status = loading
    ? ["sibuk", "Sedang menyunting"]
    : data?.mode === "mock"
      ? ["contoh", "Mode contoh"]
      : data?.mode === "ai"
        ? ["aktif", "AI aktif · Gemini"]
        : ["siap", "Siap menerima nota"];

  return (
    <div className="studio">
      <div className="studio-bar">
        <div className="studio-judul">
          <p className="cap">STUDIO</p>
          <h1>Meja tulis</h1>
        </div>
        <p className={`status status-${status[0]}`} role="status"><i aria-hidden="true" />{status[1]}</p>
      </div>

      <div className="studio-grid">
        <aside className="studio-samping" aria-labelledby="riwayat-judul">
          <div className="kartu samping-kartu">
            <h2 className="samping-judul" id="riwayat-judul">NOTA SEBELUMNYA</h2>
            {history.length > 0 ? (
              <ul className="riwayat">
                {history.map((h) => (
                  <li key={h.at}>
                    <button type="button" onClick={() => openHistory(h)}
                      aria-current={data?.result === h.result ? "true" : undefined}>
                      <span className="riwayat-nama">{h.form.nama}</span>
                      <span className="riwayat-kat">{h.form.kategori} · {waktu(h.at)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="samping-kosong">Belum ada. Lima nota terakhir akan tersimpan di peramban ini.</p>
            )}
          </div>
          <div className="kartu samping-kartu samping-arti">
            <h2 className="samping-judul">ARTI WARNA</h2>
            <ul className="legend legend-tumpuk">
              <li><i className="sw-merah" />coretan pena merah</li>
              <li><i className="sw-stabilo" />fakta dari isian Anda</li>
              <li><i className="sw-hijau" />siap dipakai</li>
            </ul>
            <Link className="samping-link" href="/cara-kerja">Cara kerja dan privasi <Icon name="arrow" /></Link>
          </div>
        </aside>

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
            <textarea name="keunggulan" value={form.keunggulan} onChange={update} rows={4}
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
          <p className="nota-catatan">Isi data produk saja. Jangan tulis nama orang, nomor telepon, atau alamat.</p>
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
  );
}
