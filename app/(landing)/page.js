import Image from "next/image";
import Link from "next/link";
import BerandaGerak from "../components/BerandaGerak";
import FiturAkordion from "../components/FiturAkordion";
import GaleriNota from "../components/GaleriNota";
import StrukHero from "../components/StrukHero";

function Pemisah({ no, nama }) {
  return (
    <p className="pemisah" data-pemisah>
      <i aria-hidden="true" />
      <span><b>{String(no).padStart(2, "0")}</b> / {nama}</span>
      <i aria-hidden="true" />
    </p>
  );
}

const BUKU = [
  ["Isi", "nama · kategori · keunggulan"],
  ["Hasil", "deskripsi · caption · harga · EN"],
  ["Bahasa", "Indonesia ⇄ Inggris"],
];

// [teks akhir, label, pembanding, nilai hitung, desimal, awalan, akhiran]
const ANGKA = [
  ["448.734", "UMKM di Bali", "data 2025", 448734, 0, "", ""],
  ["69%", "sudah punya NIB", "310.526 usaha", 69, 0, "", "%"],
  ["±34%", "sudah masuk digital", "akhir 2024", 34, 0, "±", "%"],
  ["6,33 jt", "wisatawan mancanegara", "sepanjang 2024", 6.33, 2, "", " jt"],
];

const SIAPA = [
  ["kuliner", "Kuliner", "50% 45%", "Lauk makanan jalanan Bali"],
  ["kerajinan", "Kerajinan", "55% 50%", "Pengrajin ukir kayu di Ubud"],
  ["fesyen", "Fesyen", "50% 70%", "Penenun di alat tenun"],
  ["oleh-oleh", "Oleh-oleh", "50% 45%", "Jaja Bali dalam takir daun pisang"],
];

const ALUR = [
  ["Tulis nota", "nama · kategori · keunggulan · modal"],
  ["AI menyunting", "klaim kosong dicoret, fakta distabilo"],
  ["Empat tulisan jadi", "deskripsi · caption · harga · English"],
  ["Periksa sebentar", "baca ulang, sesuaikan gaya toko"],
  ["Salin dan posting", "Instagram · WhatsApp · marketplace"],
];

const PERCAYA = [
  ["Instruksi dikunci di server", "Model gemini-3.8-flash, jawaban wajib berbentuk JSON tetap dan dicek ulang di server. API key tidak pernah sampai ke peramban."],
  ["Nol klaim karangan", "AI dilarang menambah sertifikat, penghargaan, atau lokasi toko. Kata dari isian Anda diberi stabilo supaya mudah dicek."],
  ["Data tidak disimpan", "Tidak ada database. Isian diteruskan ke Gemini untuk diproses, dan riwayat lima nota tersimpan di peramban Anda sendiri."],
];

const FAQ = [
  ["Apakah gratis?", "Ya. UMKM Copilot bisa dipakai tanpa biaya dan tanpa daftar akun."],
  ["Hasilnya boleh diubah?", "Boleh, dan sebaiknya begitu. Salin hasilnya, sesuaikan dengan gaya toko Anda, lalu periksa lagi sebelum diunggah."],
  ["Apakah data saya aman?", "Isian dikirim ke Google Gemini hanya untuk menyusun tulisan dan tidak disimpan di server kami. Karena memakai layanan gratis Gemini, isi data produk saja, jangan nama orang, nomor telepon, atau alamat."],
  ["Apa batasannya?", "Saran harga adalah perkiraan dari modal dan kategori, bukan riset pasar. Hasil AI tetap perlu dibaca ulang, dan foto produk belum bisa dibaca."],
];

export default function Beranda() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-judul">
        <div className="wrap hero-grid">
          <div className="hero-kiri">
            <p className="kicker" data-intro><i aria-hidden="true" /><b>UMKM Copilot</b><span className="kicker-ekor">· Asisten menulis UMKM Bali</span></p>
            <h1 id="hero-judul" className="hero-judul">
              {"Tulisan jualan yang".split(" ").map((k, i) => <span className="hk" key={i}>{k} </span>)}
              <span className="hk"><span className="kunci">rapi dan jujur
                <svg viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true"><path d="M3 9 C 80 3, 200 3, 297 8" /></svg>
              </span>.</span>
            </h1>
            <p className="hero-sub" data-intro>
              Tulis seadanya seperti mengisi nota. Pena merah mencoret klaim kosong, stabilo menandai fakta Anda, lalu
              deskripsi, caption, saran harga, dan versi Inggris siap disalin.
            </p>
            <form className="hero-form" action="/app" method="get" data-intro>
              <label className="sr" htmlFor="hero-nama">Nama produk</label>
              <input id="hero-nama" name="nama" maxLength={100} placeholder="Misalnya: Pie Susu Bu Made" autoComplete="off" />
              <button type="submit" className="btn-kunyit" data-magnet>Tulis sekarang ↗</button>
            </form>
            <a className="tautan-garis" href="#cara-kerja" data-intro>Atau lihat cara kerja →</a>
            <dl className="buku" data-buku>
              {BUKU.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><span className="titik" aria-hidden="true" /><dd>{v}</dd></div>
              ))}
            </dl>
          </div>
          <StrukHero />
        </div>
      </section>
      <div className="sobek" aria-hidden="true" />
      <p className="sobek-label" aria-hidden="true">· · · sobek di sini · · ·</p>

      <section className="sec rata-kanan" id="masalah" aria-labelledby="masalah-judul">
        <div className="wrap">
          <Pemisah no={1} nama="Masalah" />
          <h2 id="masalah-judul" data-muncul>Banyak yang berjualan, sedikit yang terbaca di internet.</h2>
          <p className="intro" data-muncul>Bali punya hampir setengah juta UMKM dan jutaan wisatawan tiap tahun. Hambatannya sering bukan produk, melainkan tulisan.</p>
          <div className="masalah-grid">
            <dl className="hitung" data-muncul>
              {ANGKA.map(([n, label, banding, nilai, desimal, awalan, akhiran]) => (
                <div key={label}>
                  <dt>{label}<small>{banding}</small></dt>
                  <span className="titik" aria-hidden="true" />
                  <dd data-hitung={nilai} data-desimal={desimal} data-awalan={awalan} data-akhiran={akhiran}>{n}</dd>
                </div>
              ))}
            </dl>
            <div className="seratus" data-muncul role="img" aria-label="Dari setiap 100 UMKM di Bali, sekitar 34 sudah masuk digital">
              <div className="seratus-grid" aria-hidden="true">
                {Array.from({ length: 100 }, (_, i) => <i key={i} className={i < 34 ? "isi" : ""} />)}
              </div>
              <p><b>34 dari 100</b>usaha sudah hadir di marketplace atau media sosial. Sisanya masih menunggu pembeli lewat.</p>
            </div>
          </div>
          <ul className="siapa">
            {SIAPA.map(([foto, nama, fokus, alt]) => (
              <li key={foto} data-muncul>
                <span className="siapa-foto">
                  <Image src={`/foto/${foto}.jpg`} alt={alt} fill sizes="(min-width: 900px) 260px, 45vw" style={{ objectFit: "cover", objectPosition: fokus }} />
                </span>
                <span className="siapa-nama">{nama}</span>
              </li>
            ))}
          </ul>
          <p className="sumber">Sumber: Dinas Koperasi dan UKM Provinsi Bali via RadarBisnis; BPS Provinsi Bali via Antara.</p>
        </div>
      </section>

      <section className="sec karbon rata-tengah" id="cara-kerja" aria-labelledby="cara-judul">
        <div className="wrap">
          <Pemisah no={2} nama="Cara kerja" />
          <h2 id="cara-judul" data-muncul>Menyusun tulisan semudah mengisi nota.</h2>
          <p className="intro" data-muncul>Lima isian singkat. Sisanya disunting dan ditulis, Anda tinggal membaca lalu menyalin.</p>
          <ol className="alur" data-buku>
            {ALUR.map(([judul, ket], i) => (
              <li key={judul}>
                <span className="alur-no">{String(i + 1).padStart(2, "0")}</span>
                <b>{judul}</b>
                <span className="titik" aria-hidden="true" />
                <span className="alur-ket">{ket}</span>
              </li>
            ))}
          </ol>
          <p className="loop" data-muncul>» Data produk ke server, ke Gemini, kembali sebagai empat tulisan</p>
        </div>
      </section>

      <section className="sec" id="fitur" aria-labelledby="fitur-judul">
        <div className="wrap">
          <Pemisah no={3} nama="Fitur" />
          <h2 id="fitur-judul" data-muncul>Empat tulisan jualan dari satu nota.</h2>
          <p className="intro" data-muncul>Yang distabilo kuning selalu berasal dari isian Anda. Yang tidak bisa dibuktikan, dicoret.</p>
          <FiturAkordion />
        </div>
      </section>

      <section className="sec rata-kanan sec-galeri" id="contoh" aria-labelledby="contoh-judul">
        <div className="wrap">
          <Pemisah no={4} nama="Contoh" />
          <h2 id="contoh-judul" data-muncul>Nota yang sudah disunting.</h2>
          <p className="intro" data-muncul>Contoh ilustrasi dengan format yang sama seperti keluaran app. Bukan hasil milik pelanggan.</p>
        </div>
        <GaleriNota />
      </section>

      <section className="sec rata-tengah" id="percaya" aria-labelledby="percaya-judul">
        <div className="wrap">
          <Pemisah no={5} nama="Kenapa bisa dipercaya" />
          <h2 id="percaya-judul" data-muncul>Tiga hal yang dikunci sejak awal.</h2>
          <ol className="percaya">
            {PERCAYA.map(([judul, teks], i) => (
              <li key={judul} data-muncul>
                <span className="alur-no">{String(i + 1).padStart(2, "0")}</span>
                <h3>{judul}</h3>
                <p>{teks}</p>
              </li>
            ))}
          </ol>
          <div className="faq">
            {FAQ.map(([q, a]) => (
              <details key={q} data-muncul>
                <summary>{q}<span aria-hidden="true">+</span></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="sec karbon rata-tengah cta" aria-labelledby="akhir-judul">
        <div className="wrap">
          <h2 id="akhir-judul" data-muncul>Mulai dari satu nota, gratis.</h2>
          <p className="intro" data-muncul>Tanpa daftar akun. Hasilnya langsung bisa disalin ke Instagram, WhatsApp, atau marketplace.</p>
          <div className="cta-aksi" data-muncul>
            <Link className="btn-kunyit" href="/app" data-magnet>Buka app ↗</Link>
            <a className="tautan-garis terang" href="#contoh">Lihat contoh →</a>
          </div>
        </div>
      </section>
      <BerandaGerak />
    </>
  );
}
