import Link from "next/link";
import FotoSlot from "./components/FotoSlot";
import Icon from "./components/Icon";
import Kolase from "./components/Kolase";
import Reveal from "./components/Reveal";

const JUDUL = [
  ["Coretan"], ["jualan"], ["Anda,"], ["disunting", "merah"], ["jadi"], ["nota"],
  ["siap", "hijau"], ["pajang.", "hijau"],
];

function Cap({ children }) {
  return <span className="cap">{children}</span>;
}

function Kepala({ no, judul, lead, id }) {
  return (
    <div className="kepala">
      <Cap>NOTA No. {String(no).padStart(2, "0")}</Cap>
      <h2 id={id}>{judul}</h2>
      {lead && <p className="kepala-lead">{lead}</p>}
    </div>
  );
}

const ANGKA = [
  ["448.734", "UMKM di Bali", "data 2025"],
  ["310.526", "sudah punya NIB", "69% dari seluruh UMKM"],
  ["±34%", "sudah masuk digital", "akhir 2024, sisanya 66% belum"],
  ["6,33 jt", "wisman datang ke Bali", "sepanjang 2024"],
];

// 100 kotak, 34 terisi: porsi UMKM yang sudah terdigitalisasi.
function Waffle() {
  return (
    <svg className="waffle" viewBox="0 0 200 200" role="img" aria-label="Dari setiap 100 UMKM di Bali, sekitar 34 sudah terdigitalisasi">
      {Array.from({ length: 100 }, (_, i) => {
        const x = (i % 10) * 20 + 2;
        const y = Math.floor(i / 10) * 20 + 2;
        return <rect key={i} x={x} y={y} width="16" height="16" rx="3" className={i < 34 ? "w-isi" : "w-kosong"} style={{ "--i": i }} />;
      })}
    </svg>
  );
}

const SEBELUM = [
  {
    mentah: <>pie susu <del>enak murah</del>, <mark className="stabilo">susu sapi asli</mark>, <mark className="stabilo">tahan 7 hari</mark>, <del>pokoknya mantap</del></>,
    jadi: <>Pie susu dari <mark className="stabilo">susu sapi asli</mark>, renyah dan <mark className="stabilo">tahan 7 hari</mark>. Pas dibawa pulang sebagai oleh-oleh.</>,
    catatan: "Dua klaim tanpa bukti dicoret.",
  },
  {
    mentah: <>kopi <mark className="stabilo">arabika Kintamani</mark> <del>paling enak se-Bali</del>, <mark className="stabilo">sangrai medium</mark>, <mark className="stabilo">bubuk 200 gram</mark></>,
    jadi: <>Kopi <mark className="stabilo">arabika Kintamani</mark> dengan <mark className="stabilo">sangrai medium</mark>, dikemas <mark className="stabilo">bubuk 200 gram</mark>.</>,
    catatan: "Klaim \"paling enak\" tidak bisa dibuktikan.",
  },
  {
    mentah: <>kain endek <del>bagus banget</del>, <mark className="stabilo">tenun tangan</mark>, <mark className="stabilo">motif cepuk</mark>, <mark className="stabilo">2 meter</mark></>,
    jadi: <>Kain endek <mark className="stabilo">tenun tangan</mark> bermotif <mark className="stabilo">cepuk</mark>, panjang <mark className="stabilo">2 meter</mark>.</>,
    catatan: "Pujian umum diganti ukuran dan teknik.",
  },
];

const SIAPA = [
  ["kuliner", "Kuliner", "Warung, kue, sambal, kopi.", "Menu baru langsung punya deskripsi dan caption."],
  ["kerajinan", "Kerajinan", "Anyaman, ukiran, perak.", "Proses pembuatan diceritakan tanpa dilebih-lebihkan."],
  ["fesyen", "Fesyen", "Endek, songket, kebaya.", "Bahan dan motif tertulis jelas untuk pembeli."],
  ["oleh-oleh", "Oleh-oleh", "Pie susu, pai, camilan.", "Versi Inggris siap untuk wisatawan."],
];

export default function Beranda() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-teks">
            <Cap>NOTA No. 01</Cap>
            <h1>
              {JUDUL.map(([kata, warna], i) => (
                <span key={i} className={`kata ${warna || ""}`} style={{ "--i": i }}>{kata} </span>
              ))}
            </h1>
            <p className="sub">
              Tulis seadanya. Pena merah mencoret klaim kosong, menyorot fakta dari Anda, lalu mencetak
              deskripsi, caption, harga, dan versi Inggris.
            </p>
            <div className="cta">
              <Link className="btn btn-utama btn-lg" href="/studio">Buka Studio <Icon name="arrow" /></Link>
              <Link className="btn btn-garis btn-lg" href="/contoh">Lihat contoh hasil</Link>
            </div>
            <ul className="legend" aria-label="Arti warna">
              <li><i className="sw-merah" />coretan pena merah</li>
              <li><i className="sw-stabilo" />fakta dari isian Anda</li>
              <li><i className="sw-hijau" />siap dipakai</li>
            </ul>
          </div>
          <Kolase />
        </div>
      </section>

      <section className="angka-strip" aria-label="UMKM Bali dalam angka">
        <div className="wrap angka-grid">
          {ANGKA.map(([n, label, banding]) => (
            <div className="angka" key={label}>
              <p className="angka-n">{n}</p>
              <p className="angka-label">{label}</p>
              <p className="angka-banding">{banding}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bagian" aria-labelledby="masalah-judul">
        <div className="wrap duo-57">
          <Reveal className="kolom-teks">
            <Kepala no={2} id="masalah-judul" judul="Banyak yang berjualan, sedikit yang terbaca di internet." />
            <p className="paragraf">
              Bali punya hampir setengah juta UMKM dan jutaan wisatawan setiap tahun. Tetapi baru sekitar sepertiga
              usaha yang sudah masuk ke ranah digital. Sisanya masih mengandalkan pembeli yang lewat.
            </p>
            <p className="paragraf">
              Hambatannya sering bukan produk, melainkan tulisan: deskripsi yang jujur tapi menarik, caption yang
              enak dibaca, dan versi Inggris untuk tamu dari luar negeri.
            </p>
            <p className="sumber">
              Sumber: Dinas Koperasi dan UKM Provinsi Bali via RadarBisnis (jumlah UMKM 2025, NIB, digitalisasi akhir 2024);
              BPS Provinsi Bali via Antara (kunjungan wisman 2024).
            </p>
          </Reveal>
          <Reveal className="kartu grafik">
            <p className="nota-judul"><span>DARI 100 UMKM BALI</span><span>AKHIR 2024</span></p>
            <div className="grafik-isi">
              <Waffle />
              <div className="grafik-ket">
                <p className="ket-n"><b>34</b> sudah digital</p>
                <p className="ket-banding">66 lainnya belum hadir di marketplace atau media sosial.</p>
                <div className="bar-nib" role="img" aria-label="310.526 dari 448.734 UMKM sudah punya NIB, sekitar 69 persen">
                  <p className="bar-label"><span>Punya NIB</span><b>69%</b></p>
                  <span className="bar-track"><span className="bar-isi" style={{ "--w": "69%" }} /></span>
                  <p className="ket-banding">310.526 dari 448.734 usaha. Sudah resmi, tapi belum tentu terlihat di internet.</p>
                </div>
                <div className="legend legend-kecil">
                  <span><i className="sw-hijau" />sudah digital</span>
                  <span><i className="sw-garis" />belum</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bagian" aria-labelledby="sebelum-judul">
        <div className="wrap">
          <Kepala no={3} id="sebelum-judul" judul="Sebelum dan sesudah disunting"
            lead="Yang dicoret adalah klaim kosong. Yang distabilo adalah fakta dari pedagang, dipakai apa adanya." />
          <ol className="banding-list">
            {SEBELUM.map((s, i) => (
              <Reveal as="li" className="kartu banding" key={i}>
                <div className="banding-sisi">
                  <p className="banding-label">SEBELUM · TULISAN PEDAGANG</p>
                  <p className="banding-mentah">{s.mentah}</p>
                  <p className="banding-catatan"><i className="k-no">{i + 1}</i>{s.catatan}</p>
                </div>
                <div className="banding-panah" aria-hidden="true"><Icon name="arrow" /></div>
                <div className="banding-sisi">
                  <p className="banding-label hijau">SESUDAH · SIAP DIPAKAI</p>
                  <p className="banding-jadi">{s.jadi}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bagian" aria-labelledby="siapa-judul">
        <div className="wrap">
          <Kepala no={4} id="siapa-judul" judul="Untuk usaha kecil yang menjual barang nyata" />
          <ul className="grid-4">
            {SIAPA.map(([foto, judul, contoh, teks]) => (
              <Reveal as="li" className="kartu siapa" key={foto}>
                <FotoSlot nama={foto} label={`Foto ${judul.toLowerCase()} menyusul`} />
                <div className="siapa-isi">
                  <h3>{judul}</h3>
                  <p className="siapa-contoh">{contoh}</p>
                  <p>{teks}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bagian band-gelap" aria-labelledby="cara-judul">
        <div className="wrap">
          <div className="duo-57 rata-bawah">
            <Kepala no={5} id="cara-judul" judul="Tiga langkah, tanpa daftar akun." />
            <p className="kepala-lead">
              Data produk dikirim ke server kami, diteruskan ke Google Gemini dengan instruksi yang dikunci,
              lalu kembali sebagai empat struk. Tidak ada yang disimpan di server.
            </p>
          </div>
          <ol className="grid-3 langkah-gelap">
            <Reveal as="li">
              <p className="langkah-no">01</p>
              <h3>Tulis nota</h3>
              <p>Nama, kategori, keunggulan, modal, dan siapa pembelinya.</p>
            </Reveal>
            <Reveal as="li">
              <p className="langkah-no">02</p>
              <h3>Pena merah menyunting</h3>
              <p>Klaim kosong dicoret, fakta Anda disorot dan dipakai apa adanya.</p>
            </Reveal>
            <Reveal as="li">
              <p className="langkah-no">03</p>
              <h3>Salin dan posting</h3>
              <p>Deskripsi, caption, saran harga, dan versi Inggris tinggal disalin.</p>
            </Reveal>
          </ol>
          <Link className="btn btn-terang btn-lg" href="/cara-kerja">Pelajari cara kerjanya <Icon name="arrow" /></Link>
        </div>
      </section>

      <section className="bagian" aria-labelledby="kasus-judul">
        <div className="wrap duo-57 kasus">
          <Reveal className="kasus-foto">
            <FotoSlot nama="pasar" label="Foto lapak menyusul" rasio="4 / 5" />
          </Reveal>
          <Reveal className="kolom-teks">
            <Cap>ILUSTRASI CONTOH</Cap>
            <h2 id="kasus-judul" className="judul-2">Satu nota, empat tulisan, satu menit.</h2>
            <p className="paragraf">
              Bu Made (tokoh ilustrasi) menjual pie susu di Gianyar. Ia menulis lima isian di Studio: nama produk,
              kategori oleh-oleh, &ldquo;susu sapi asli, tanpa pengawet, tahan 7 hari&rdquo;, modal Rp15.000, dan pembeli
              wisatawan. Hasil di bawah memakai mode contoh aplikasi.
            </p>
            <dl className="kasus-angka">
              <div><dt>5 isian</dt><dd>menjadi <b>4 tulisan</b> siap salin</dd></div>
              <div><dt>3 fakta</dt><dd>distabilo, <b>0 klaim</b> yang ditambahkan</dd></div>
              <div><dt>Rp15.000</dt><dd>modal, saran jual <b>Rp27.000 – Rp35.000</b></dd></div>
            </dl>
            <p className="sumber">Tokoh dan isi bagian ini adalah ilustrasi, bukan testimoni pengguna.</p>
          </Reveal>
        </div>
      </section>

      <section className="cta-akhir" aria-labelledby="akhir-judul">
        <div className="wrap cta-akhir-isi">
          <div>
            <h2 id="akhir-judul">Mulai dari satu nota.</h2>
            <p>Gratis, tanpa daftar akun. Hasilnya bisa langsung disalin ke Instagram, WhatsApp, atau marketplace.</p>
          </div>
          <div className="cta-akhir-aksi">
            <Link className="btn btn-terang btn-lg" href="/studio">Buka Studio <Icon name="arrow" /></Link>
            <Link className="btn btn-garis-terang btn-lg" href="/contoh">Lihat contoh</Link>
          </div>
        </div>
      </section>
    </>
  );
}
