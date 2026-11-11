import { Patra } from "./Ornamen";

// Nota produk UMKM di hero. Markup sudah keadaan akhir (coretan, stabilo, hasil, cap), jadi
// utuh tanpa JS atau saat gerak dikurangi. BerandaGerak memutarnya sebagai satu siklus cetak.
export default function StrukHero() {
  return (
    <figure className="nota">
      <div className="nota-kertas" data-nota role="img"
        aria-label="Contoh draf copy produk Pie Susu Bu Made. Tulisan pedagang berisi klaim enak murah dan pokoknya mantap yang dicoret, serta fakta susu sapi asli dan tahan 7 hari yang distabilo. Hasil suntingan: deskripsi, caption, versi Inggris, dan saran harga Rp27.000 sampai Rp35.000.">
        <div aria-hidden="true">
          <i className="nota-sinar" data-n="sinar" />
          <Patra className="nota-patra" />
          <div className="nota-kepala" data-n="baris">
            <span className="nota-toko">WARUNG<br />BU MADE</span>
            <div>
              <b>DRAF TULISAN</b>
              <span>No. 0142 · Gianyar, Bali</span>
            </div>
          </div>
          <p className="nota-meta" data-n="baris"><span>06/11/2026</span><span>09.41 WITA</span></p>

          <div className="nota-dua">
            <div className="nota-kolom">
              <p className="nota-label" data-n="baris">TULISAN ANDA</p>
              <p className="nota-tangan" data-n="baris">
                pie susu <span className="coret">enak murah<i data-n="coret" /></span>,{" "}
                <span className="sorot"><i data-n="sapu" />susu sapi asli</span>,{" "}
                <span className="sorot"><i data-n="sapu" />tahan 7 hari</span>,{" "}
                <span className="coret">pokoknya mantap<i data-n="coret" /></span>
              </p>
            </div>
            <div className="nota-kolom nota-kolom-hasil">
              <p className="nota-label" data-n="baris">HASIL SUNTINGAN</p>
              <p className="nota-jadi" data-n="hasil">
                Pie susu dari <mark>susu sapi asli</mark>, renyah, dan <mark>tahan 7 hari</mark>. Pas dibawa pulang setelah liburan.
              </p>
            </div>
          </div>

          <p className="nota-scan" data-n="scan">» AI MENYUNTING &amp; MENULIS «</p>

          <div className="nota-baris" data-n="hasil"><span>Deskripsi</span><b>2 versi</b></div>
          <div className="nota-baris" data-n="hasil"><span>Caption + tagar</span><b>10 tagar</b></div>
          <div className="nota-baris" data-n="hasil"><span>English</span><b>siap</b></div>

          <div className="nota-total" data-n="total">
            <span>SARAN HARGA</span>
            <b>Rp<span data-n="min">27.000</span>–<span data-n="max">35.000</span></b>
          </div>
          <p className="nota-kaki" data-n="total"><mark>2 fakta</mark> dipakai · 2 klaim dicoret</p>
          <span className="nota-cap" data-n="cap">SIAP POSTING</span>
        </div>
      </div>
      <figcaption>Contoh suntingan · klik untuk memutar ulang</figcaption>
    </figure>
  );
}
