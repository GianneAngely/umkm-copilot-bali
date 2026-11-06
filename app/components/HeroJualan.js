import Image from "next/image";
import Link from "next/link";
import Icon from "./Icon";

// Hero: judul tebal biru di kiri, tumpukan kartu foto produk miring di kanan dengan kata
// JUALAN tipis sebagai latar. Foto pertama tampil tanpa JS; pergantian diatur BerandaGerak.
export const KARTU = [
  ["oleh-oleh", "50% 45%", "Jaja Bali"],
  ["kuliner", "50% 45%", "Lauk warung"],
  ["kerajinan", "55% 50%", "Ukiran kayu"],
  ["pasar", "50% 55%", "Bumbu pasar"],
];

const BULAT = ["kuliner", "kerajinan", "oleh-oleh"];

function Kontur({ className }) {
  return (
    <svg className={className} viewBox="0 0 240 240" aria-hidden="true">
      {[30, 52, 74, 96, 118].map((r, i) => (
        <ellipse key={r} cx="120" cy="120" rx={r * 1.08} ry={r} transform={`rotate(${i * 7} 120 120)`} />
      ))}
    </svg>
  );
}

export default function HeroJualan() {
  return (
    <section className="g-hero" aria-labelledby="hero-judul">
      <Kontur className="g-kontur g-kontur-a" />
      <Kontur className="g-kontur g-kontur-b" />
      <div className="wrap g-hero-grid">
        <div className="g-kiri">
          <p className="g-eyelet"><i aria-hidden="true" />Asisten menulis untuk UMKM Bali</p>
          <h1 id="hero-judul" className="g-judul">
            <span className="g-baris"><span className="g-kata">Jualan</span> <span className="g-kata">rapi,</span></span>
            <span className="g-baris"><span className="g-kata">tetap</span> <span className="g-kata g-garis-bawah">jujur.<svg viewBox="0 0 220 18" aria-hidden="true" preserveAspectRatio="none"><path d="M3 12 C 60 4, 150 4, 217 10" /></svg></span></span>
          </h1>
          <p className="g-sub">Isi satu nota tentang produk Anda. Deskripsi, caption, saran harga, dan versi Inggris tersusun dalam semenit, tanpa klaim tambahan.</p>
          <form className="g-isian" action="/studio" method="get">
            <span className="g-isian-ikon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></svg>
            </span>
            <label className="sr" htmlFor="hero-nama">Nama produk</label>
            <input id="hero-nama" name="nama" maxLength={100} placeholder="Nama produk Anda, misalnya Pie Susu Bu Made…" autoComplete="off" />
            <button type="submit" className="g-isian-tombol" aria-label="Tulis sekarang" data-magnet><Icon name="arrow" /></button>
          </form>
          <div className="g-contoh">
            <div className="v-bulat">
              {BULAT.map((n) => (
                <span key={n} className="v-bulat-foto">
                  <Image src={`/foto/${n}.jpg`} alt="" fill sizes="48px" style={{ objectFit: "cover" }} />
                </span>
              ))}
              <Link className="v-bulat-plus" href="/contoh" aria-label="Lihat semua contoh"><Icon name="plus" /></Link>
            </div>
            <p>Gratis, tanpa daftar akun. <Link href="/contoh">Lihat contoh hasil</Link></p>
          </div>
        </div>

        <div className="g-kanan">
          <p className="g-latar" aria-hidden="true">{"JUALAN".split("").map((h, i) => <span className="v-huruf" key={i}>{h}</span>)}</p>
          <p className="v-pil v-pil-kiri" aria-hidden="true" data-apung>Tulisan jualan<br />yang jujur</p>
          <p className="v-pil v-pil-kanan" aria-hidden="true" data-apung>Siap posting<br />dalam semenit</p>
          <div className="v-tumpuk" data-v-tumpuk>
            <div className="v-kartu v-kartu-belakang" aria-hidden="true" />
            <div className="v-kartu v-kartu-depan">
              {KARTU.map(([nama, fokus], i) => (
                <Image key={nama} src={`/foto/${nama}.jpg`} alt="" fill priority={i === 0}
                  sizes="(min-width: 1024px) 340px, 60vw" className={i === 0 ? "on" : ""} style={{ objectFit: "cover", objectPosition: fokus }} />
              ))}
              <span className="v-label" data-v-label>{KARTU[0][2]}</span>
              <Link className="v-panah" href="/contoh" aria-label="Lihat contoh hasil"><Icon name="arrow" /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
