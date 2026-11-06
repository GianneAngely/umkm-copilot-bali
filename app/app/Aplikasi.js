"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon";
import { Stabilo, buatFakta, hitungFakta } from "../components/Stabilo";
import { CopyButton, Section, rupiah } from "../components/Struk";
import { CONTOH } from "../data/contoh";
import FotoKeForm from "../components/fitur/FotoKeForm";
import KalenderKonten from "../components/fitur/KalenderKonten";
import PostinganIG from "../components/fitur/PostinganIG";
import Tur from "../components/Tur";
import { mintaJson } from "../../lib/klien";

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

const IKON = {
  nota: <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z M9 8h6 M9 12h6" />,
  riwayat: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></>,
  contoh: <><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></>,
  rumah: <path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" />,
};

function Garis({ nama }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {IKON[nama]}
    </svg>
  );
}

const MENU = [
  ["nota", "Tulisan baru"],
  ["riwayat", "Riwayat"],
  ["contoh", "Contoh produk"],
];

export default function Aplikasi() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contohGalat, setContohGalat] = useState(null);
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [faktaForm, setFaktaForm] = useState(null);
  const [tampil, setTampil] = useState("nota");
  const [foto, setFoto] = useState("");
  const [alat, setAlat] = useState("ig");
  const resultsRef = useRef(null);
  const namaRef = useRef(null);

  useEffect(() => setHistory(loadHistory()), []);

  // Nama produk dari formulir di beranda (?nama=) hanya mengisi kolom, tidak langsung mengirim.
  useEffect(() => {
    const nama = new URLSearchParams(window.location.search).get("nama");
    if (nama) setForm((f) => ({ ...f, nama: nama.slice(0, 100) }));
  }, []);

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
    setContohGalat(null);
    try {
      const json = await mintaJson("/api/generate", form);
      setData(json);
      const others = history.filter((h) => h.form.nama !== form.nama);
      const next = [{ form, ...json, at: Date.now() }, ...others].slice(0, 5);
      setHistory(next);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {}
    } catch (err) {
      setError(err.message);
      setContohGalat(err.contoh || null);
    } finally {
      setLoading(false);
    }
  }

  function openHistory(item) {
    setForm(item.form);
    setData({ mode: item.mode, result: item.result });
  }

  // Tampilan saja: pindah menu, membuka riwayat, atau memuat contoh ke formulir.
  function bukaRiwayat(item) {
    openHistory(item);
    setTampil("nota");
  }

  function muatContoh(c) {
    setForm({ ...c.form });
    setError("");
    setTampil("nota");
    requestAnimationFrame(() => namaRef.current?.focus());
  }

  // Isian dari foto hanya mengisi kolom yang dikenali, pengguna tetap menekan tombol sendiri.
  function isiDariFoto(isi) {
    if (!isi) return;
    setForm((f) => ({
      ...f,
      nama: isi.nama ? String(isi.nama).slice(0, 100) : f.nama,
      kategori: KATEGORI.includes(isi.kategori) ? isi.kategori : f.kategori,
      keunggulan: isi.keunggulan ? String(isi.keunggulan).slice(0, 500) : f.keunggulan,
    }));
  }

  function notaBaru() {
    setTampil("nota");
    requestAnimationFrame(() => namaRef.current?.focus());
  }

  const r = data?.result;
  const captionFull = r ? `${r.caption}\n\n${r.hashtags.join(" ")}` : "";
  const hargaText = r ? `${rupiah(r.harga.min)} – ${rupiah(r.harga.max)}\n${r.harga.alasan}` : "";
  const englishText = r ? `${r.english.description}\n\n${r.english.caption}` : "";
  const semuaText = r
    ? [`DESKRIPSI SINGKAT\n${r.deskripsi_singkat}`, `DESKRIPSI BERCERITA\n${r.deskripsi_cerita}`, `CAPTION\n${captionFull}`, `SARAN HARGA\n${hargaText}`, `ENGLISH\n${englishText}`].join("\n\n")
    : "";

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
        : ["siap", "Siap menerima tulisan"];

  const judul = { nota: "Tulisan baru", riwayat: "Riwayat tulisan", contoh: "Contoh produk" }[tampil];

  return (
    <div className="aplikasi">
      <aside className="sisi" aria-label="Menu aplikasi">
        <Link className="merek" href="/" aria-label="Wicara, ke beranda">Wicara<i aria-hidden="true" /></Link>
        <nav className="sisi-menu">
          {MENU.map(([id, label]) => (
            <button key={id} type="button" className="sisi-item" aria-current={tampil === id ? "page" : undefined} data-tur={id === "riwayat" ? "riwayat" : undefined}
              onClick={() => (id === "nota" ? notaBaru() : setTampil(id))}>
              <Garis nama={id} />
              <span>{label}</span>
              {id === "riwayat" && history.length > 0 && <small>{history.length}</small>}
            </button>
          ))}
        </nav>
        <div className="sisi-bawah">
          <Link className="sisi-item" href="/"><Garis nama="rumah" /><span>Ke beranda</span></Link>
        </div>
      </aside>

      <div className="kerja">
        <header className="kerja-atas">
          <div>
            <p className="kerja-label">WICARA · MEJA TULIS</p>
            <h1>{judul}</h1>
          </div>
          <div className="kerja-alat">
            <p className={`status status-${status[0]}`} role="status"><i aria-hidden="true" />{status[1]}</p>
            <Tur />
          </div>
        </header>

        {tampil === "riwayat" && (
          <section className="panel-daftar" aria-label="Riwayat tulisan">
            {history.length > 0 ? (
              <ul className="daftar-nota">
                {history.map((h) => (
                  <li key={h.at}>
                    <button type="button" onClick={() => bukaRiwayat(h)}>
                      <span className="dn-nama">{h.form.nama}</span>
                      <span className="titik" aria-hidden="true" />
                      <span className="dn-meta">{h.form.kategori} · {waktu(h.at)}</span>
                      <span className="dn-buka">Buka →</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="kosong-app">
                <p className="ka-judul">Belum ada tulisan.</p>
                <p>Lima tulisan terakhir akan tersimpan di peramban ini setelah Anda menekan Sunting dan tulis.</p>
                <button type="button" className="btn-hijau" onClick={notaBaru}>Tulis copy pertama</button>
              </div>
            )}
          </section>
        )}

        {tampil === "contoh" && (
          <section className="panel-daftar" aria-label="Contoh produk">
            <p className="panel-catat">Pilih contoh untuk mengisi formulir. Tulisannya baru disusun setelah Anda menekan Sunting dan tulis.</p>
            <ul className="kartu-contoh">
              {CONTOH.map((c) => (
                <li key={c.id}>
                  <p className="kc-kat">{c.form.kategori.toUpperCase()}</p>
                  <h2>{c.form.nama}</h2>
                  <p className="kc-isi">{c.form.keunggulan}</p>
                  <p className="kc-meta">Modal {rupiah(c.form.modal)} · {c.form.target === "turis" ? "wisatawan" : "warga lokal"}</p>
                  <button type="button" className="btn-garis" onClick={() => muatContoh(c)}>Pakai contoh ini ↗</button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {tampil === "nota" && (
          <div className="kerja-grid">
            <div className="kolom-form">
            <div className="isi-foto" data-tur="foto">
              <FotoKeForm onIsi={isiDariFoto} onFoto={setFoto} />
            </div>
            <form className="kertas-form" onSubmit={submit}>
              <p className="kf-kepala"><span>DRAF COPY</span><span>5 ISIAN</span></p>
              <label className="field" data-tur="nama">
                <span className="field-label">Nama produk</span>
                <input ref={namaRef} name="nama" value={form.nama} onChange={update} required maxLength={100}
                  placeholder="Contoh: Pie Susu Bu Made" />
              </label>
              <div className="duo">
                <label className="field" data-tur="kategori">
                  <span className="field-label">Kategori</span>
                  <select name="kategori" value={form.kategori} onChange={update}>
                    {KATEGORI.map((k) => <option key={k}>{k}</option>)}
                  </select>
                </label>
                <label className="field">
                  <span className="field-label">Modal per unit</span>
                  <span className="money">
                    <span className="money-prefix" aria-hidden="true">Rp</span>
                    <input name="modal" type="number" min="0" inputMode="numeric" value={form.modal}
                      onChange={update} placeholder="opsional" />
                  </span>
                </label>
              </div>
              <label className="field" data-tur="keunggulan">
                <span className="field-label">Bahan atau keunggulan</span>
                <textarea name="keunggulan" value={form.keunggulan} onChange={update} rows={4}
                  maxLength={500} placeholder="Contoh: susu sapi asli, tanpa pengawet, tahan 7 hari" />
              </label>
              <fieldset className="field" data-tur="target">
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
              <button type="submit" className="btn-hijau btn-blok" disabled={loading} data-tur="buat">
                {loading && <span className="spinner" aria-hidden="true" />}
                {loading ? "Sedang menyunting..." : "Sunting dan tulis ↗"}
              </button>
              {error && (
                <div className="galat" role="alert">
                  <Icon name="alert" />
                  <div>
                    <p className="galat-judul">Belum berhasil</p>
                    <p>{error}</p>
                    {contohGalat && (
                      <button type="button" className="btn-garis btn-kecil" onClick={() => { setData({ mode: "mock", result: contohGalat }); setError(""); setContohGalat(null); }}>
                        Lihat contoh hasil (Contoh)
                      </button>
                    )}
                  </div>
                </div>
              )}
              <p className="kf-catat">Isi data produk saja. Jangan tulis nama orang, nomor telepon, atau alamat.</p>
            </form>
            </div>

            <div className="hasil" ref={resultsRef} aria-live="polite" aria-busy={loading}>
              {!r && !loading && (
                <div className="kertas-hasil kosong-app">
                  <p className="kf-kepala"><span>STRUK PROMOSI</span><span>BELUM DICETAK</span></p>
                  <p className="ka-judul">Struknya tercetak di sini.</p>
                  <ol className="ka-langkah">
                    <li><span>01</span>Isi nama dan keunggulan produk</li>
                    <li><span>02</span>Tekan Sunting dan tulis</li>
                    <li><span>03</span>Salin per bagian, atau sekaligus</li>
                  </ol>
                  <p className="ka-pilih">Belum ada ide? Klik salah satu contoh:</p>
                  <ul className="ka-nota">
                    {CONTOH.map((c) => (
                      <li key={c.id}>
                        <button type="button" onClick={() => muatContoh(c)}>
                          <span className="kn-kat">{c.form.kategori.toUpperCase()}</span>
                          <b>{c.form.nama}</b>
                          <span className="kn-isi">{c.form.keunggulan}</span>
                          <span className="kn-muat">Pakai contoh ini →</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!r && loading && (
                <div className="kertas-hasil cetak" role="status">
                  <p className="kf-kepala"><span>STRUK PROMOSI</span><span>MENCETAK</span></p>
                  <p className="cetak-catat"><span className="spinner" aria-hidden="true" />Pena merah sedang menyunting tulisan Anda...</p>
                  <div className="pena-sunting" aria-hidden="true">
                    {[form.nama, ...String(form.keunggulan || "").split(/[,;\n]/)].map((b) => b.trim()).filter(Boolean).slice(0, 4).map((b, i) => (
                      <p key={i} style={{ "--i": i }}><span>{b}</span><i /></p>
                    ))}
                    <svg className="pena-ikon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></svg>
                  </div>
                  {[0, 1, 2].map((i) => <span key={i} className="cetak-baris" style={{ "--i": i }} />)}
                </div>
              )}
              {r && (
                <div className={loading ? "tumpuk is-stale" : "tumpuk"}>
                  <div className="hasil-atas" data-tur="hasil">
                    <p className="hasil-fakta"><mark className="stabilo">{jumlahFakta} fakta</mark> dari isian Anda dipakai</p>
                    <CopyButton text={semuaText} label="Salin semua" className="copy-utama" />
                  </div>
                  {data.mode === "mock" && (
                    <p className="notice">MODE CONTOH · API key belum dipasang, jadi hasil di bawah adalah contoh statis.</p>
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

                  <section className="alat-lanjut" aria-label="Alat lanjutan">
                    <div className="alat-tab" role="tablist" aria-label="Alat lanjutan">
                      <button type="button" role="tab" id="tab-ig" aria-controls="panel-ig" aria-selected={alat === "ig"} onClick={() => setAlat("ig")} data-tur="ig">Postingan IG</button>
                      <button type="button" role="tab" id="tab-kal" aria-controls="panel-kal" aria-selected={alat === "kal"} onClick={() => setAlat("kal")} data-tur="kalender">Kalender 7 hari</button>
                    </div>
                    <div className="alat-panel" role="tabpanel" id="panel-ig" aria-labelledby="tab-ig" hidden={alat !== "ig"}>
                      <PostinganIG hasil={r} foto={foto} namaProduk={faktaForm?.nama || form.nama} />
                    </div>
                    <div className="alat-panel" role="tabpanel" id="panel-kal" aria-labelledby="tab-kal" hidden={alat !== "kal"}>
                      <KalenderKonten
                        produk={{ nama: faktaForm?.nama || form.nama, kategori: faktaForm?.kategori || form.kategori, target: faktaForm?.target || form.target }}
                        ringkasan={r.deskripsi_singkat} />
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <nav className="tab-bawah" aria-label="Menu aplikasi">
        {MENU.map(([id, label]) => (
          <button key={id} type="button" aria-current={tampil === id ? "page" : undefined} data-tur={id === "riwayat" ? "riwayat" : undefined}
            onClick={() => (id === "nota" ? notaBaru() : setTampil(id))}>
            <Garis nama={id} />
            <span>{id === "contoh" ? "Contoh" : id === "nota" ? "Tulis" : label}</span>
          </button>
        ))}
        <Link href="/"><Garis nama="rumah" /><span>Beranda</span></Link>
      </nav>
    </div>
  );
}
