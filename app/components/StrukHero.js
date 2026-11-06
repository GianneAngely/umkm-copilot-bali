// Struk contoh di hero. Markup ini sudah keadaan akhir, jadi utuh tanpa JS atau saat gerak
// dikurangi. BerandaGerak memutarnya: struk tercetak, AI menyunting, coretan dan stabilo,
// hasil per bagian, cap SIAP POSTING, lalu saran harga di bawah.
export default function StrukHero() {
  return (
    <figure className="sh">
      <div className="sh-kertas" data-struk role="img"
        aria-label="Contoh: nota Pie Susu Bu Made disunting AI. Klaim enak murah dicoret, fakta susu sapi asli dan tahan 7 hari distabilo, lalu tersusun deskripsi, caption, harga Rp27.000 sampai Rp35.000, dan versi Inggris.">
        <div aria-hidden="true">
          <p className="sh-judul" data-s="kepala">NOTA PRODUK</p>
          <p className="sh-sub" data-s="kepala">UMKM COPILOT · BALI</p>
          <p className="sh-meta" data-s="kepala"><span>06/11/2026</span><span>09:41 WITA</span></p>

          <div className="sh-blok">
            <p className="sh-baris" data-s="isi"><span>Nama</span><b>Pie Susu Bu Made</b></p>
            <p className="sh-baris" data-s="isi"><span>Kategori</span><b>Oleh-oleh</b></p>
            <p className="sh-baris sh-teks" data-s="isi">
              pie susu <span className="sh-coret">enak murah<i data-s="coret" /></span>,{" "}
              <span className="sh-sorot"><i data-s="sapu" />susu sapi asli</span>,{" "}
              <span className="sh-sorot"><i data-s="sapu" />tahan 7 hari</span>
            </p>
            <p className="sh-baris" data-s="isi"><span>Modal</span><b>15.000</b></p>
          </div>

          <p className="sh-ai" data-s="ai">✂ AI MENYUNTING &amp; MENULIS ✂</p>

          <div className="sh-blok sh-hasil">
            <p className="sh-baris" data-s="hasil"><span><i>»</i> Deskripsi</span><b>2 versi</b></p>
            <p className="sh-baris" data-s="hasil"><span><i>»</i> Caption</span><b>10 tagar</b></p>
            <p className="sh-baris" data-s="hasil"><span><i>»</i> Harga</span><b>Rp27–35rb</b></p>
            <p className="sh-baris" data-s="hasil"><span><i>»</i> English</span><b>siap</b></p>
          </div>

          <p className="sh-total" data-s="total"><span>SARAN HARGA</span><b>Rp27.000–35.000</b></p>
          <p className="sh-kaki" data-s="total"><mark>2 fakta</mark> dari isian · 0 klaim karangan</p>
          <span className="sh-cap" data-s="cap">SIAP POSTING ✓</span>
        </div>
      </div>
      <figcaption>CONTOH TAMPILAN</figcaption>
    </figure>
  );
}
