import Image from "next/image";
import Link from "next/link";
import BerandaGerak from "./components/BerandaGerak";
import FiturAkordion from "./components/FiturAkordion";
import StrukHero from "./components/StrukHero";

function Label({ no, nama, terang = false }) {
  return (
    <p className={terang ? "lbl lbl-terang" : "lbl"}>
      <span>{String(no).padStart(2, "0")}</span> / <b>{nama}</b>
    </p>
  );
}

const TITIK = [
  ["ISI", "NAMA · KATEGORI · KEUNGGULAN"],
  ["HASIL", "DESKRIPSI · CAPTION · HARGA · EN"],
  ["BAHASA", "INDONESIA ⇄ INGGRIS"],
];

// [teks akhir, label, pembanding, nilai hitung, desimal, awalan, akhiran]
const ANGKA = [
  ["448.734", "UMKM di Bali", "data 2025", 448734, 0, "", ""],
  ["69%", "sudah punya NIB", "310.526 usaha", 69, 0, "", "%"],
  ["±34%", "sudah masuk digital", "akhir 2024", 34, 0, "±", "%"],
  ["6,33 jt", "wisman ke Bali", "sepanjang 2024", 6.33, 2, "", " jt"],
];

const LANGKAH = [
  ["Tulis nota", "nama · kategori · keunggulan · modal"],
  ["AI menyunting", "klaim kosong dicoret, fakta distabilo"],
  ["Empat tulisan jadi", "deskripsi · caption · harga · English"],
  ["Periksa sebentar", "baca ulang, sesuaikan gaya toko"],
  ["Salin dan posting", "Instagram · WhatsApp · marketplace"],
];

const PERCAYA = [
  ["Instruksi dikunci di server", "Model gemini-3.8-flash, jawaban wajib berbentuk JSON tetap dan dicek ulang di server. API key tidak pernah sampai ke peramban."],
  ["Nol klaim karangan", "AI dilarang menambah sertifikat, penghargaan, atau lokasi toko. Kata yang berasal dari isian Anda diberi stabilo supaya mudah dicek."],
  ["Data tidak disimpan", "Tidak ada database. Isian hanya diteruskan ke Gemini untuk diproses, dan riwayat lima nota tersimpan di peramban Anda sendiri."],
];

export default function Beranda() {
  return (
    <>
      <section className="ph" aria-labelledby="hero-judul">
        <div className="wrap ph-grid">
          <div className="ph-kiri">
            <p className="ph-eyebrow" data-intro><i aria-hidden="true" /><b>UMKM COPILOT</b> · ASISTEN MENULIS UMKM BALI</p>
            <h1 id="hero-judul" className="ph-judul" data-intro>
              Tulis jualan secepat <span className="ph-kunci">ngetik nota</span>.
            </h1>
            <p className="ph-lead" data-intro>
              Isi nama produk, keunggulan, dan modal seadanya. AI menyunting jadi deskripsi, caption, saran harga, dan
              versi Inggris. Klaim kosong dicoret, fakta Anda dipakai apa adanya.
            </p>
            <form className="ph-form" action="/studio" method="get" data-intro>
              <label className="sr" htmlFor="hero-nama">Nama produk</label>
              <input id="hero-nama" name="nama" maxLength={100} placeholder="Misalnya: Pie Susu Bu Made" autoComplete="off" />
              <button type="submit" className="btn-koral">▸ TULIS SEKARANG</button>
            </form>
            <Link className="ph-tautan" href="/cara-kerja" data-intro>ATAU LIHAT CARA KERJA →</Link>
            <dl className="titik-daftar" data-intro>
              {TITIK.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          </div>
          <StrukHero />
        </div>
        <p className="sobek" aria-hidden="true">· · · · · SOBEK DI SINI · · · · ·</p>
      </section>

      <section className="pb" id="masalah" aria-labelledby="masalah-judul">
        <div className="wrap">
          <Label no={1} nama="MASALAH" />
          <div className="pb-kepala pb-kanan" data-muncul>
            <h2 id="masalah-judul">Banyak yang berjualan, sedikit yang terbaca di internet.</h2>
            <p>Bali punya hampir setengah juta UMKM dan jutaan wisatawan setiap tahun. Hambatannya sering bukan produk, melainkan tulisan.</p>
          </div>
          <div className="masalah-grid">
            <figure className="masalah-foto" data-muncul>
              <Image src="/foto/pasar.jpg" alt="Kunyit, jeruk limau, dan ikan teri kering di lapak pasar Bali" fill
                sizes="(min-width: 1024px) 420px, 92vw" style={{ objectFit: "cover", objectPosition: "50% 55%" }} />
              <figcaption>Lapak pasar di Bali · Foto: Stijn Dijkstra / Pexels</figcaption>
            </figure>
            <div>
              <dl className="angka-nota" data-muncul>
                {ANGKA.map(([n, label, banding, nilai, desimal, awalan, akhiran]) => (
                  <div key={label}>
                    <dt>{label}<small>{banding}</small></dt>
                    <dd data-hitung={nilai} data-desimal={desimal} data-awalan={awalan} data-akhiran={akhiran}>{n}</dd>
                  </div>
                ))}
              </dl>
              <div className="titik-blok" data-muncul role="img" aria-label="Dari setiap 100 UMKM di Bali, sekitar 34 sudah masuk digital">
                <div className="titik-grid" aria-hidden="true">
                  {Array.from({ length: 100 }, (_, i) => <i key={i} className={i < 34 ? "titik-isi" : ""} />)}
                </div>
                <p><b>34 dari 100</b> usaha sudah hadir di marketplace atau media sosial. Sisanya masih menunggu pembeli lewat.</p>
              </div>
              <p className="pb-sumber">Sumber: Dinas Koperasi dan UKM Provinsi Bali via RadarBisnis; BPS Provinsi Bali via Antara.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb pb-navy" id="cara-kerja-ringkas" aria-labelledby="cara-judul">
        <div className="wrap pb-tengah">
          <Label no={2} nama="CARA KERJA" terang />
          <div className="pb-kepala" data-muncul>
            <h2 id="cara-judul">Nyusun tulisannya semudah ngisi nota.</h2>
            <p>Lima isian singkat, sisanya disunting dan ditulis. Anda tinggal membaca, lalu menyalin.</p>
          </div>
          <ol className="langkah-nota">
            {LANGKAH.map(([judul, ket], i) => (
              <li key={judul} data-muncul>
                <span className="ln-no">{String(i + 1).padStart(2, "0")}</span>
                <b>{judul}</b>
                <span className="ln-titik" aria-hidden="true" />
                <span className="ln-ket">{ket}</span>
              </li>
            ))}
          </ol>
          <Link className="pil-garis" href="/cara-kerja">▸ DETAIL ALUR, PRIVASI, DAN BATASAN</Link>
        </div>
      </section>

      <section className="pb" id="fitur" aria-labelledby="fitur-judul">
        <div className="wrap">
          <Label no={3} nama="FITUR" />
          <div className="pb-kepala" data-muncul>
            <h2 id="fitur-judul">Empat tulisan jualan, dari satu nota.</h2>
            <p>Yang distabilo kuning selalu berasal dari isian Anda. Yang tidak bisa dibuktikan, dicoret.</p>
          </div>
          <FiturAkordion />
        </div>
      </section>

      <section className="pb pb-navy" id="percaya" aria-labelledby="percaya-judul">
        <div className="wrap">
          <Label no={4} nama="KENAPA BISA DIPERCAYA" terang />
          <div className="pb-kepala" data-muncul>
            <h2 id="percaya-judul">Tiga hal yang dikunci sejak awal.</h2>
          </div>
          <ol className="percaya-grid">
            {PERCAYA.map(([judul, teks], i) => (
              <li key={judul} data-muncul>
                <span className="ln-no">{String(i + 1).padStart(2, "0")}</span>
                <h3>{judul}</h3>
                <p>{teks}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="pb pb-akhir" aria-labelledby="akhir-judul">
        <div className="wrap pb-tengah" data-muncul>
          <h2 id="akhir-judul">Mulai dari satu nota, <span className="ph-kunci">gratis</span>.</h2>
          <p>Tanpa daftar akun. Hasilnya langsung bisa disalin ke Instagram, WhatsApp, atau marketplace.</p>
          <div className="akhir-aksi">
            <Link className="btn-koral" href="/studio">▸ BUKA STUDIO</Link>
            <Link className="ph-tautan" href="/contoh">ATAU LIHAT CONTOH HASIL →</Link>
          </div>
        </div>
      </section>
      <BerandaGerak />
    </>
  );
}
