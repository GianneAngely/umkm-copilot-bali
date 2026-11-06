import Image from "next/image";
import Link from "next/link";
import CeritaSticky from "./components/CeritaSticky";
import FotoSlot from "./components/FotoSlot";
import Icon from "./components/Icon";
import { Jendela, LayarStudio, Stiker } from "./components/Jendela";
import Reveal from "./components/Reveal";

const ANGKA = [
  ["448.734", "UMKM di Bali", "data 2025"],
  ["69%", "sudah punya NIB", "310.526 usaha"],
  ["±34%", "sudah masuk digital", "akhir 2024"],
  ["6,33 jt", "wisman datang ke Bali", "sepanjang 2024"],
];

const PERCAYA = [
  {
    judul: "Instruksi dikunci di server",
    panel: (
      <div className="ui-panel">
        <p className="ui-baris"><span>Model</span><b>gemini-3.8-flash</b></p>
        <p className="ui-baris"><span>Bentuk jawaban</span><b>JSON terkunci</b></p>
        <p className="ui-baris"><span>Dicek ulang</span><b>Zod di server</b></p>
        <p className="ui-baris"><span>API key</span><b className="ui-ok"><i />tidak sampai ke peramban</b></p>
      </div>
    ),
  },
  {
    judul: "Nol klaim karangan",
    panel: (
      <div className="ui-panel ui-angka">
        <p className="ui-besar">0</p>
        <p>klaim baru yang ditambahkan AI. Sertifikat, penghargaan, dan lokasi toko dilarang dikarang.</p>
        <p className="ui-coret"><del>terbaik se-Bali</del> <del>paling murah</del></p>
      </div>
    ),
  },
  {
    judul: "Data tidak disimpan",
    panel: (
      <div className="ui-panel">
        <p className="ui-baris"><span>Database</span><b>tidak ada</b></p>
        <p className="ui-baris"><span>Isian dikirim ke</span><b>Gemini, untuk diproses</b></p>
        <p className="ui-baris"><span>Riwayat</span><b>5 nota, di peramban Anda</b></p>
        <p className="ui-catat">Isi data produk saja, jangan nama orang atau nomor telepon.</p>
      </div>
    ),
  },
];

const SIAPA = [
  ["kuliner", "Kuliner", "Warung, kue, sambal, kopi."],
  ["kerajinan", "Kerajinan", "Anyaman, ukiran, perak."],
  ["fesyen", "Fesyen", "Tenun, songket, kebaya."],
  ["oleh-oleh", "Oleh-oleh", "Pie susu, pai, camilan."],
];

export default function Beranda() {
  return (
    <>
      <section className="b-hero" aria-labelledby="hero-judul">
        <Image src="/foto/hero-umkm.jpg" alt="" fill priority sizes="100vw" className="b-hero-foto" />
        <div className="b-hero-tirai" aria-hidden="true" />
        <div className="b-hero-isi">
          <p className="b-hero-cap">UMKM Copilot · Bali</p>
          <h1 id="hero-judul">Tulisan jualan yang jujur, dari satu nota.</h1>
          <p className="b-hero-sub">Tulis nama produk Anda. Deskripsi, caption, saran harga, dan versi Inggris disusun dalam hitungan detik.</p>
          <form className="b-hero-form" action="/studio" method="get">
            <label className="sr" htmlFor="hero-nama">Nama produk</label>
            <input id="hero-nama" name="nama" maxLength={100} placeholder="Nama produk Anda…" autoComplete="off" />
            <button type="submit" className="btn btn-hero">Tulis sekarang <Icon name="arrow" /></button>
          </form>
          <p className="b-hero-catat">Gratis, tanpa daftar akun.</p>
        </div>
        <p className="b-hero-kredit">Foto: G Y / Pexels</p>
      </section>

      <section className="b-pamer" aria-label="Tampilan Studio">
        <p className="b-merek" aria-hidden="true">UMKM Copilot</p>
        <Reveal className="b-pamer-jendela">
          <Jendela>
            <LayarStudio />
          </Jendela>
          <Stiker />
        </Reveal>
      </section>

      <section className="b-angka" aria-labelledby="angka-judul">
        <div className="wrap b-angka-grid">
          <div>
            <h2 id="angka-judul" className="b-judul-kecil">Bali penuh usaha kecil. Sebagian besar belum terbaca di internet.</h2>
            <p className="b-sumber">Sumber: Dinas Koperasi dan UKM Provinsi Bali via RadarBisnis; BPS Provinsi Bali via Antara.</p>
          </div>
          <dl className="b-angka-daftar">
            {ANGKA.map(([n, label, banding]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd><span className="b-n">{n}</span><span className="b-banding">{banding}</span></dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="b-cerita" aria-labelledby="cerita-judul">
        <div className="wrap">
          <div className="b-kepala">
            <h2 id="cerita-judul">Satu nota, empat tulisan.</h2>
            <p>Yang dicoret pena merah adalah klaim kosong. Yang distabilo kuning adalah fakta dari isian Anda.</p>
          </div>
          <CeritaSticky />
        </div>
      </section>

      <section className="b-gelap" aria-labelledby="percaya-judul">
        <div className="wrap">
          <div className="b-kepala">
            <h2 id="percaya-judul">Kenapa bisa dipercaya</h2>
            <p>Tiga hal yang dikunci sejak awal, supaya tulisan Anda tetap jujur dan data Anda tidak ke mana-mana.</p>
          </div>
          <ul className="b-gelap-grid">
            {PERCAYA.map((p) => (
              <Reveal as="li" key={p.judul}>
                {p.panel}
                <h3>{p.judul}</h3>
              </Reveal>
            ))}
          </ul>
          <Link className="b-tautan" href="/cara-kerja">Selengkapnya di Cara kerja <Icon name="arrow" /></Link>
        </div>
      </section>

      <section className="b-siapa" aria-labelledby="siapa-judul">
        <div className="wrap">
          <div className="b-kepala">
            <h2 id="siapa-judul">Untuk usaha kecil yang menjual barang nyata</h2>
          </div>
          <ul className="b-siapa-grid">
            {SIAPA.map(([foto, judul, contoh]) => (
              <li key={foto}>
                <FotoSlot nama={foto} rasio="4 / 5" sizes="(min-width: 1100px) 290px, (min-width: 640px) 45vw, 92vw" />
                <h3>{judul}</h3>
                <p>{contoh}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="b-akhir" aria-labelledby="akhir-judul">
        <div className="wrap b-akhir-isi">
          <h2 id="akhir-judul">Mulai dari satu nota.</h2>
          <div className="b-akhir-aksi">
            <Link className="btn btn-utama btn-besar" href="/studio">Buka Studio <Icon name="arrow" /></Link>
            <Link className="btn btn-garis btn-besar" href="/contoh">Lihat contoh</Link>
          </div>
        </div>
      </section>
    </>
  );
}
