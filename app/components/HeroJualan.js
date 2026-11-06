import Image from "next/image";
import Link from "next/link";
import Icon from "./Icon";

// Hero: kata JUALAN raksasa bertipe tipis, dengan tumpukan kartu foto produk miring di tengahnya.
// Foto pertama tampil tanpa JS; pergantian kartu diatur BerandaGerak.
export const KARTU = [
  ["oleh-oleh", "50% 45%", "Jaja Bali"],
  ["kuliner", "50% 45%", "Lauk warung"],
  ["kerajinan", "55% 50%", "Ukiran kayu"],
  ["pasar", "50% 55%", "Bumbu pasar"],
];

const BULAT = ["kuliner", "kerajinan", "oleh-oleh"];

export default function HeroJualan() {
  return (
    <section className="v-hero" aria-labelledby="hero-judul">
      <div className="wrap">
        <div className="v-panggung">
          <p className="v-pil v-pil-kiri" aria-hidden="true" data-apung>Tulisan jualan<br />yang jujur</p>
          <p className="v-pil v-pil-kanan" aria-hidden="true" data-apung>Siap posting<br />dalam semenit</p>

          <h1 id="hero-judul" className="sr">UMKM Copilot Bali: tulisan jualan yang jujur, dari satu nota.</h1>
          <div className="v-kata">
            <span className="v-bagian" aria-hidden="true">{"JUAL".split("").map((h, i) => <span className="v-huruf" key={i}>{h}</span>)}</span>
            <div className="v-tumpuk" data-v-tumpuk>
              <div className="v-kartu v-kartu-belakang" aria-hidden="true" />
              <div className="v-kartu v-kartu-depan">
                {KARTU.map(([nama, fokus], i) => (
                  <Image key={nama} src={`/foto/${nama}.jpg`} alt="" fill priority={i === 0}
                    sizes="(min-width: 1024px) 220px, 30vw" className={i === 0 ? "on" : ""} style={{ objectFit: "cover", objectPosition: fokus }} />
                ))}
                <span className="v-label" data-v-label>{KARTU[0][2]}</span>
                <Link className="v-panah" href="/contoh" aria-label="Lihat contoh hasil"><Icon name="arrow" /></Link>
              </div>
            </div>
            <span className="v-bagian" aria-hidden="true">{"AN".split("").map((h, i) => <span className="v-huruf" key={i}>{h}</span>)}</span>
          </div>
        </div>

        <div className="v-bawah">
          <div className="v-kiri">
            <Link className="v-tautan" href="/cara-kerja"><Icon name="arrow" /> Cara kerjanya</Link>
            <p className="v-lead">Tulis nama produk Anda. Deskripsi, caption, saran harga, dan versi Inggris disusun dari satu nota, tanpa klaim tambahan.</p>
            <form className="b-hero-form v-form" action="/studio" method="get">
              <label className="sr" htmlFor="hero-nama">Nama produk</label>
              <input id="hero-nama" name="nama" maxLength={100} placeholder="Nama produk Anda…" autoComplete="off" />
              <button type="submit" className="btn btn-hero" data-magnet>Tulis sekarang <Icon name="arrow" /></button>
            </form>
          </div>
          <div className="v-kanan">
            <p className="v-kanan-judul">Contoh produk</p>
            <div className="v-bulat">
              {BULAT.map((n) => (
                <span key={n} className="v-bulat-foto">
                  <Image src={`/foto/${n}.jpg`} alt="" fill sizes="56px" style={{ objectFit: "cover" }} />
                </span>
              ))}
              <Link className="v-bulat-plus" href="/contoh" aria-label="Lihat semua contoh"><Icon name="plus" /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
