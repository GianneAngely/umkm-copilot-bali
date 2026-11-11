"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon";
import { Stabilo, buatFakta } from "../components/Stabilo";
import { LembarSuntingan, StepperAI } from "../components/Suntingan";
import { CopyButton, Section, rupiah } from "../components/Struk";
import { CONTOH } from "../data/contoh";
import FotoKeForm from "../components/fitur/FotoKeForm";
import KalenderKonten from "../components/fitur/KalenderKonten";
import PostinganIG from "../components/fitur/PostinganIG";
import BalasChat from "../components/fitur/BalasChat";
import FotoStudio from "../components/fitur/FotoStudio";
import Tur from "../components/Tur";
import { mintaJson } from "../../lib/klien";

const KATEGORI = ["Kuliner", "Kerajinan", "Fashion", "Oleh-oleh", "Lainnya"];
const HISTORY_KEY = "umkm-copilot-riwayat";
const EMPTY = { nama: "", kategori: "Kuliner", keunggulan: "", modal: "", target: "lokal" };
const FOTO_KATEGORI = { Kuliner: "/foto/kuliner.jpg", Kerajinan: "/foto/kerajinan.jpg", Fashion: "/foto/fesyen.jpg", "Oleh-oleh": "/foto/oleh-oleh.jpg", Lainnya: "/foto/pasar.jpg" };
const DAPAT = [
  ["01", "Deskripsi", "singkat dan bercerita"],
  ["02", "Caption", "plus hashtag"],
  ["03", "Saran harga", "dari modal Anda"],
  ["04", "Versi Inggris", "untuk wisatawan"],
  ["05", "Gambar IG", "feed dan story"],
  ["06", "Kalender 7 hari", "dengan hari raya Bali"],
];

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
  const [fotoStudio, setFotoStudio] = useState("");
  const [proses, setProses] = useState({ mulai: 0, selesai: 0 });
  const [putar, setPutar] = useState(0);
  const resultsRef = useRef(null);
  const namaRef = useRef(null);

  useEffect(() => setHistory(loadHistory()), []);

  // Belum ada foto produk asli: gambar memakai foto suasana Pexels per kategori.
  function fotoProduk(f) {
    return FOTO_KATEGORI[f?.kategori] || FOTO_KATEGORI.Lainnya;
  }

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
    const mulai = performance.now();
    setProses({ mulai, selesai: 0 });
    // Bawa stepper ke layar kalau kolom hasil sedang di luar pandangan.
    requestAnimationFrame(() => {
      const el = resultsRef.current;
      if (el && (el.getBoundingClientRect().top < 0 || el.getBoundingClientRect().top > innerHeight * 0.6)) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    try {
      const json = await mintaJson("/api/generate", form);
      setProses({ mulai, selesai: performance.now() });
      setPutar((n) => n + 1);
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
    setProses({ mulai: 0, selesai: 0 });
    setPutar(0);
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

  const status = loading
    ? ["sibuk", "Sedang menyunting"]
    : data?.mode === "mock"
      ? ["contoh", "Mode contoh"]
      : data?.mode === "ai"
        ? ["aktif", "AI aktif"]
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
                      <img className="dn-foto" src={fotoProduk(h.form)} alt="" loading="lazy" />
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
                  <span className="kc-foto"><img src={FOTO_KATEGORI[c.form.kategori]} alt="" loading="lazy" /><small>foto suasana</small></span>
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
              <FotoKeForm onIsi={isiDariFoto} onFoto={(u) => { setFoto(u); setFotoStudio(""); }} />
            </div>
            <form className="kertas-form" onSubmit={submit}>
              <p className="kf-kepala"><span>DRAF COPY</span><span>atau ketik sendiri</span></p>
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
                  maxLength={500} placeholder="Tulis apa adanya. Contoh: pie susu enak murah, susu sapi asli, tahan 7 hari" />
                <span className="field-bantu">Klaim seperti &ldquo;enak&rdquo; atau &ldquo;terbaik&rdquo; boleh ditulis. Nanti dicoret kalau tidak ada buktinya.</span>
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
              <button type="submit" className="btn-hijau btn-blok btn-sunting" disabled={loading} data-tur="buat">
                {loading ? <><span className="spinner" aria-hidden="true" />AI sedang menyunting...</> : <>Sunting dan tulis <span aria-hidden="true">↗</span></>}
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
                <div className="kertas-hasil kosong-app kosong-v2">
                  <p className="kf-kepala"><span>HASIL</span><span>BELUM ADA</span></p>
                  <p className="ka-judul">Satu draf, enam hasil siap pakai.</p>
                  <p className="ka-sub">Wicara mencoret klaim kosong di draf Anda, menandai fakta dengan stabilo, lalu menulis semuanya dari fakta itu.</p>
                  <ul className="dapat">
                    {DAPAT.map(([n, t, k]) => (
                      <li key={n}><span>{n}</span><b>{t}</b><small>{k}</small></li>
                    ))}
                  </ul>
                  <p className="ka-pilih">Coba langsung dengan contoh produk:</p>
                  <ul className="contoh-foto">
                    {CONTOH.map((c) => (
                      <li key={c.id}>
                        <button type="button" onClick={() => muatContoh(c)}>
                          <span className="cf-gambar">
                            <img src={FOTO_KATEGORI[c.form.kategori]} alt="" /><small className="cf-suasana">foto suasana</small>
                            <span className="kn-kat">{c.form.kategori.toUpperCase()}</span>
                          </span>
                          <span className="cf-isi">
                            <b>{c.form.nama}</b>
                            <span className="kn-isi">{c.form.keunggulan}</span>
                            <span className="kn-muat">Pakai contoh ini →</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="cf-kredit">Foto suasana per kategori dari Pexels, bukan foto produk contoh.</p>
                </div>
              )}
              {loading && (
                <div className="memuat" role="status">
                  <div className="kertas-hasil kartu-proses">
                    <p className="kf-kepala"><span>WICARA SEDANG BEKERJA</span><span>AI MENYUNTING</span></p>
                    <StepperAI mulai={proses.mulai} selesai={null} />
                    <div className="pena-sunting" aria-hidden="true">
                      {[form.nama, ...String(form.keunggulan || "").split(/[,;\n]/)].map((b) => b.trim()).filter(Boolean).slice(0, 4).map((b, i) => (
                        <p key={i} style={{ "--i": i }}><span>{b}</span><i /></p>
                      ))}
                      <svg className="pena-ikon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></svg>
                    </div>
                  </div>
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="skel" aria-hidden="true" style={{ "--i": i }}>
                      <span className="skel-judul" /><span /><span /><span className="pendek" />
                    </div>
                  ))}
                </div>
              )}
              {r && !loading && (
                <div className="tumpuk">
                  <div className="ringkasan" data-tur="hasil">
                    <div className="rk-kiri">
                      <p className="rk-meta">
                        <span className={data.mode === "ai" ? "lencana-model" : "lencana-model contoh"}>
                          <i aria-hidden="true" />
                          {proses.selesai
                            ? `Selesai dalam ${((proses.selesai - proses.mulai) / 1000).toLocaleString("id-ID", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} detik`
                            : data.mode === "ai" ? "Hasil tersimpan" : "Mode contoh"}
                        </span>
                        {proses.selesai && data.mode !== "ai" && <span className="rk-waktu">mode contoh</span>}
                      </p>
                      <StepperAI mulai={1} selesai={2} ringkas />
                    </div>
                    <CopyButton text={semuaText} label="Salin semua" className="copy-utama" />
                  </div>
                  {data.mode === "mock" && (
                    <p className="notice">MODE CONTOH · AI tidak dipanggil, jadi hasil di bawah adalah contoh statis.</p>
                  )}
                  <LembarSuntingan form={faktaForm || form} r={r} fakta={fakta} Stabilo={Stabilo} putar={putar} />

                  <h2 className="sub-hasil"><span>4 tulisan siap salin</span><small>Stabilo kuning = fakta dari isian Anda</small></h2>
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

                  <h2 className="sub-hasil"><span>Siap diunggah</span><small>Dibuat dari tulisan di atas</small></h2>
                  <section className="kartu-fitur" aria-label="Foto Studio" data-tur="studio">
                    <FotoStudio foto={foto} onHasil={setFotoStudio} />
                  </section>
                  <section className="kartu-fitur" aria-label="Postingan Instagram" data-tur="ig">
                    {!foto && !fotoStudio && <p className="ig-catat">Pratinjau memakai foto suasana kategori. Unggah foto produk Anda di kartu Isi dari foto, gambarnya langsung berganti.</p>}
                    <PostinganIG hasil={r} foto={fotoStudio || foto || fotoProduk(faktaForm || form)} namaProduk={faktaForm?.nama || form.nama} />
                  </section>
                  <section className="kartu-fitur" aria-label="Kalender konten 7 hari" data-tur="kalender">
                    <KalenderKonten
                      produk={{ nama: faktaForm?.nama || form.nama, kategori: faktaForm?.kategori || form.kategori, target: faktaForm?.target || form.target }}
                      ringkasan={r.deskripsi_singkat} />
                  </section>
                  <section className="kartu-fitur" aria-label="Balasan chat pembeli" data-tur="balas">
                    <BalasChat
                      produk={{ nama: faktaForm?.nama || form.nama, kategori: faktaForm?.kategori || form.kategori, keunggulan: faktaForm?.keunggulan ?? form.keunggulan, target: faktaForm?.target || form.target }}
                      hasil={r} />
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
