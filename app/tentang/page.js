import Link from "next/link";
import FotoSlot from "../components/FotoSlot";
import Icon from "../components/Icon";

export const metadata = { title: "Tentang" };

const KREDIT = [
  ["Pedagang sate di pasar kuliner Bali", "G Y", "https://www.pexels.com/photo/31246481/"],
  ["Lapak kunyit, limau, dan teri di pasar Bali", "Stijn Dijkstra", "https://www.pexels.com/photo/38330312/"],
  ["Lauk makanan jalanan Bali", "Kevin Yung", "https://www.pexels.com/photo/36892251/"],
  ["Pengrajin ukir kayu di Ubud", "Smaart", "https://www.pexels.com/photo/32064709/"],
  ["Penenun di depan kain tenun tangan", "Andreas Suwardy", "https://www.pexels.com/photo/40524482/"],
  ["Jaja Bali dalam takir daun pisang", "Evert jan Hoek", "https://www.pexels.com/photo/36858325/"],
];

export default function TentangPage() {
  return (
    <>
      <section className="halaman-kepala">
        <div className="wrap duo-57 rata-bawah">
          <div className="kepala">
            <span className="cap">TENTANG</span>
            <h1 className="judul-1">Dibuat karena tulisan sering jadi penghalang jualan.</h1>
          </div>
          <p className="kepala-lead">
            UMKM Copilot Bali adalah entri AI Web Innovation Challenge, Bali Digifest 2026, kategori UMKM dan Bisnis.
          </p>
        </div>
      </section>

      <section className="bagian" aria-labelledby="latar-judul">
        <div className="wrap duo-57">
          <FotoSlot nama="hero-umkm" rasio="4 / 3" sizes="(min-width: 1024px) 480px, 92vw" />
          <div className="kolom-teks">
            <div className="kepala">
              <span className="cap">NOTA No. 01</span>
              <h2 id="latar-judul">Latar belakang</h2>
            </div>
            <p className="paragraf">
              Banyak warung, perajin, dan toko oleh-oleh di Bali punya produk yang bagus, tetapi tidak sempat atau tidak
              terbiasa menulis deskripsi produk, caption promosi, apalagi versi Bahasa Inggris untuk wisatawan. Akibatnya
              produk kalah terlihat di marketplace dan media sosial.
            </p>
            <p className="paragraf">
              UMKM Copilot memakai AI untuk menyunting tulisan seadanya menjadi materi pemasaran yang jujur. Klaim
              kosong dicoret, fakta dari pedagang dipakai apa adanya, dan hasilnya bisa langsung disalin.
            </p>
          </div>
        </div>
      </section>

      <section className="bagian" aria-labelledby="orang-judul">
        <div className="wrap">
          <div className="kepala">
            <span className="cap">NOTA No. 02</span>
            <h2 id="orang-judul">Pembuat dan lomba</h2>
          </div>
          <ul className="grid-3">
            <li className="kartu">
              <p className="langkah-no">PEMBUAT</p>
              <h3>Gianne Angely</h3>
              <p>Mahasiswa Teknik Informatika, Universitas Dhyana Pura, Bali.</p>
            </li>
            <li className="kartu">
              <p className="langkah-no">LOMBA</p>
              <h3>AI Web Innovation Challenge</h3>
              <p>Bagian dari Bali Digifest 2026, diselenggarakan Pemerintah Provinsi Bali bersama Primakara University. Tema: Build with AI, Solve for Bali.</p>
            </li>
            <li className="kartu">
              <p className="langkah-no">TEKNOLOGI</p>
              <h3>Next.js dan Google Gemini</h3>
              <p>Teks disusun oleh Gemini dari sisi server. Penulisan kode aplikasi dibantu Claude Code dan ditinjau oleh pembuat.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="bagian" aria-labelledby="kredit-judul">
        <div className="wrap duo-57">
          <div className="kepala">
            <span className="cap">NOTA No. 03</span>
            <h2 id="kredit-judul">Kredit foto</h2>
            <p className="kepala-lead">Semua foto di situs ini diambil dari Pexels dengan lisensi Pexels. Terima kasih kepada para fotografer.</p>
          </div>
          <ul className="kartu kredit">
            {KREDIT.map(([isi, nama, url]) => (
              <li key={url}>
                <span>{isi}</span>
                <a href={url} target="_blank" rel="noopener noreferrer">{nama} <span className="kredit-sumber">Pexels</span></a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cta-akhir" aria-labelledby="akhir-judul">
        <div className="wrap cta-akhir-isi">
          <div>
            <h2 id="akhir-judul">Coba sendiri.</h2>
            <p>Lima isian, empat tulisan, tanpa daftar akun.</p>
          </div>
          <div className="cta-akhir-aksi">
            <Link className="btn btn-terang btn-lg" href="/studio">Buka Studio <Icon name="arrow" /></Link>
            <Link className="btn btn-garis-terang btn-lg" href="/cara-kerja">Cara kerja</Link>
          </div>
        </div>
      </section>
    </>
  );
}
