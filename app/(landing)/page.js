import Image from "next/image";
import Link from "next/link";
import AlurWicara from "../components/AlurWicara";
import BerandaGerak from "../components/BerandaGerak";
import KalenderBali from "../components/KalenderBali";
import FiturAkordion from "../components/FiturAkordion";
import GaleriNota from "../components/GaleriNota";
import { Patra, Sulur } from "../components/Ornamen";
import StrukHero from "../components/StrukHero";

// Kepala bagian berupa stempel toko kecil yang sedikit miring.
function Pemisah({ no, nama }) {
  return (
    <p className="stempel" data-pemisah>
      <span>No. {String(no).padStart(2, "0")}</span>
      <b>{nama}</b>
    </p>
  );
}

const TABEL = [
  [<>pie susu <span className="coret-statis">enak murah</span></>, <>Pie susu dari <mark>susu sapi asli</mark></>],
  [<>tahan seminggu <span className="coret-statis">pokoknya mantap</span></>, <>Renyah dan <mark>tahan 7 hari</mark></>],
  [<>buat turis</>, <>Versi Inggris untuk wisatawan</>],
];

// [label, nilai hitung, teks akhir, lebar relatif, warna]. 34% dari 448.734 = ±152.570.
const BATANG = [
  ["UMKM di Bali (2025)", 448734, "448.734", "100%", "b-tinta"],
  ["Sudah punya NIB", 310526, "310.526", "69.2%", "b-hijau"],
  ["Sudah masuk digital (akhir 2024)", 152570, "±152.570", "34%", "b-kunyit"],
];

const SIAPA = [
  ["kuliner", "Kuliner", "50% 45%", "Lauk makanan jalanan Bali"],
  ["kerajinan", "Kerajinan", "55% 50%", "Pengrajin ukir kayu di Ubud"],
  ["fesyen", "Fesyen", "50% 70%", "Penenun di alat tenun"],
  ["oleh-oleh", "Oleh-oleh", "50% 45%", "Jaja Bali dalam takir daun pisang"],
];

const ALUR = [
  ["Tulis nota", "Nama, kategori, keunggulan, dan modal. Atau foto produknya.", "pasar", "50% 55%"],
  ["Pena merah menyunting", "Klaim kosong dicoret, fakta Anda distabilo dan dipakai apa adanya.", "kerajinan", "55% 50%"],
  ["Empat tulisan jadi", "Deskripsi, caption dan hashtag, saran harga, dan versi Inggris.", "kuliner", "50% 45%"],
  ["Salin dan posting", "Ke Instagram, WhatsApp, atau marketplace. Bisa juga jadi gambar IG.", "oleh-oleh", "50% 45%"],
];

const PERCAYA = [
  ["Instruksi dikunci di server", "Model gemini-3.8-flash, jawaban wajib berbentuk JSON tetap dan dicek ulang di server. API key tidak pernah sampai ke peramban."],
  ["Nol klaim karangan", "AI dilarang menambah sertifikat, penghargaan, atau lokasi toko. Kata dari isian Anda diberi stabilo supaya mudah dicek."],
  ["Data tidak disimpan", "Tidak ada database. Isian diteruskan ke Gemini untuk diproses, dan riwayat lima nota tersimpan di peramban Anda sendiri."],
];

const FAQ = [
  ["Apakah gratis?", "Ya. Wicara bisa dipakai tanpa biaya dan tanpa daftar akun."],
  ["Hasilnya boleh diubah?", "Boleh, dan sebaiknya begitu. Salin hasilnya, sesuaikan dengan gaya toko Anda, lalu periksa lagi sebelum diunggah."],
  ["Apakah data saya aman?", "Isian dikirim ke Google Gemini hanya untuk menyusun tulisan dan tidak disimpan di server kami. Karena memakai layanan gratis Gemini, isi data produk saja, jangan nama orang, nomor telepon, atau alamat."],
  ["Apa batasannya?", "Saran harga adalah perkiraan dari modal dan kategori, bukan riset pasar. Hasil AI tetap perlu dibaca ulang, dan foto produk belum bisa dibaca."],
];

export default function Beranda() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-judul">
        <Patra className="hero-patra" />
        <div className="wrap hero-grid">
          <div className="hero-kiri">
            <p className="kicker" data-intro><b>Wicara</b><span className="kicker-ekor">Asisten tulis jualan untuk UMKM Bali</span></p>
            <h1 id="hero-judul" className="hero-judul">
              {"Tulisan jualan yang".split(" ").map((k, i) => <span className="hk" key={i}>{k} </span>)}
              <span className="hk"><span className="kunci">rapi dan jujur
                <svg viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 9 C 80 3, 200 3, 297 8" /></svg>
              </span>.</span>
            </h1>
            <p className="hero-sub" data-intro>
              Tulis seadanya seperti mengisi nota. Pena merah mencoret klaim kosong, stabilo menandai fakta Anda, lalu
              deskripsi, caption, saran harga, dan versi Inggris siap disalin.
            </p>
            <form className="hero-form" action="/app" method="get" data-intro>
              <label className="sr" htmlFor="hero-nama">Nama produk</label>
              <input id="hero-nama" name="nama" maxLength={100} placeholder="Misalnya: Pie Susu Bu Made" autoComplete="off" />
              <button type="submit" className="btn-hijau" data-magnet>Tulis sekarang <span className="panah">→</span></button>
            </form>
            <a className="tautan-garis" href="#cara-kerja" data-intro>Atau lihat cara kerja →</a>
          </div>
          <div className="hero-panggung">
            <span className="hero-foto">
              <Image src="/foto/hero-umkm.jpg" alt="Pedagang sate tersenyum di pasar kuliner Bali" fill priority
                sizes="(min-width: 960px) 50vw, 100vw" style={{ objectFit: "cover", objectPosition: "38% 40%" }} />
              <small>Pasar kuliner, Bali · Foto: G Y / Pexels</small>
            </span>
            <StrukHero />
          </div>
        </div>
      </section>
      <div className="sobek" aria-hidden="true" />
      <p className="sobek-label" aria-hidden="true">· · · sobek di sini · · ·</p>

      <section className="sec rata-kanan" id="masalah" aria-labelledby="masalah-judul">
        <div className="wrap">
          <Pemisah no={1} nama="Masalah" />
          <h2 id="masalah-judul" data-muncul>Banyak yang berjualan, sedikit yang <span className="sorot-judul">terbaca</span> di internet.</h2>
          <p className="intro" data-muncul>Bali punya hampir setengah juta UMKM dan jutaan wisatawan tiap tahun. Hambatannya sering bukan produk, melainkan tulisan.</p>
          <div className="masalah-grid">
            <div className="batang" data-muncul role="img" aria-label="UMKM di Bali: 448.734 usaha, 310.526 sudah punya NIB, sekitar 152 ribu atau 34 persen sudah masuk digital">
              {BATANG.map(([label, nilai, teks, lebar, warna]) => (
                <div className="batang-baris" key={label}>
                  <p className="batang-label"><span>{label}</span><b data-hitung={nilai} data-awalan={teks.startsWith("±") ? "±" : ""}>{teks}</b></p>
                  <span className="batang-jalur"><i className={warna} style={{ "--w": lebar }} data-batang /></span>
                </div>
              ))}
            </div>
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
          <Sulur className="band-sulur" />
          <ol className="langkah">
            {ALUR.map(([judul, ket, foto, fokus], i) => (
              <li key={judul} data-muncul>
                <span className="langkah-foto">
                  <Image src={`/foto/${foto}.jpg`} alt="" fill sizes="(min-width: 960px) 260px, 45vw" style={{ objectFit: "cover", objectPosition: fokus }} />
                  <b>{String(i + 1).padStart(2, "0")}</b>
                </span>
                <h3>{judul}</h3>
                <p>{ket}</p>
              </li>
            ))}
          </ol>
          <p className="loop" data-muncul>Data produk ke server, diteruskan ke Gemini, kembali sebagai empat tulisan</p>
        </div>
      </section>

      <section className="sec latar-2" id="fitur" aria-labelledby="fitur-judul">
        <div className="wrap">
          <Pemisah no={3} nama="Fitur" />
          <h2 id="fitur-judul" data-muncul>Empat tulisan jualan dari <span className="sorot-judul">satu nota</span>.</h2>
          <p className="intro" data-muncul>Yang distabilo kuning selalu berasal dari isian Anda. Yang tidak bisa dibuktikan, dicoret.</p>
          <div className="fitur-grid">
            <FiturAkordion />
            <aside className="fitur-visual" data-muncul>
              <span className="fv-foto">
                <Image src="/foto/kuliner.jpg" alt="Lauk makanan jalanan Bali" fill sizes="(min-width: 960px) 420px, 92vw" style={{ objectFit: "cover", objectPosition: "50% 45%" }} />
              </span>
              <table className="tabel-nota">
                <thead><tr><th scope="col">Tulisan Anda</th><th scope="col">Hasil Wicara</th></tr></thead>
                <tbody>
                  {TABEL.map(([a, b], i) => <tr key={i}><td>{a}</td><td>{b}</td></tr>)}
                </tbody>
              </table>
            </aside>
          </div>
        </div>
      </section>

      <section className="sec latar-hi" id="teknologi" aria-labelledby="tek-judul">
        <div className="wrap">
          <Pemisah no={4} nama="Di balik layar" />
          <h2 id="tek-judul" data-muncul>Dari nota sampai <span className="sorot-judul">siap posting</span>.</h2>
          <p className="intro" data-muncul>Gulir untuk mengikuti satu nota melewati server, Gemini, dan pemeriksaan fakta.</p>
          <AlurWicara />
        </div>
      </section>

      <section className="sec karbon rata-tengah" id="kalender" aria-labelledby="kal-judul">
        <div className="wrap">
          <Pemisah no={5} nama="Kalender Bali" />
          <h2 id="kal-judul" data-muncul>Wicara tahu kapan pembeli sedang ramai.</h2>
          <p className="intro" data-muncul>Rencana posting tujuh hari di app memperhitungkan hari raya dan libur berikut. Tanggalnya diambil dari sumber resmi, bukan tebakan AI.</p>
          <KalenderBali />
        </div>
      </section>

      <section className="sec rata-kanan sec-galeri" id="contoh" aria-labelledby="contoh-judul">
        <div className="wrap">
          <Pemisah no={6} nama="Contoh" />
          <h2 id="contoh-judul" data-muncul>Nota yang sudah disunting.</h2>
          <p className="intro" data-muncul>Contoh ilustrasi dengan format yang sama seperti keluaran app. Bukan hasil milik pelanggan.</p>
        </div>
        <GaleriNota />
      </section>

      <section className="sec rata-tengah latar-2" id="percaya" aria-labelledby="percaya-judul">
        <div className="wrap">
          <Pemisah no={7} nama="Kenapa bisa dipercaya" />
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
            <Link className="btn-kunyit" href="/app" data-magnet>Buka app <span className="panah">→</span></Link>
            <a className="tautan-garis terang" href="#contoh">Lihat contoh →</a>
          </div>
        </div>
      </section>
      <BerandaGerak />
    </>
  );
}
