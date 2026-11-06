// Demo hidup di jendela produk beranda. Markup ini sudah keadaan akhir (coretan, stabilo,
// struk terisi), jadi tetap utuh tanpa JS atau saat gerak dikurangi. Animasinya diputar
// oleh BerandaGerak: coretan merah digambar, stabilo menyapu fakta, lalu struk diketik per kata.

function Kata({ teks }) {
  return teks.split(" ").map((k, i) => <span className="d-kata" key={i}>{k} </span>);
}

function Fakta({ children }) {
  return <span className="d-kata d-fakta"><mark>{children}</mark> </span>;
}

export default function DemoHidup() {
  return (
    <div className="demo" data-demo aria-label="Demo: nota Pie Susu Bu Made disunting pena merah lalu dicetak jadi deskripsi, caption, dan saran harga" role="img">
      <div className="demo-samping" aria-hidden="true">
        <p className="layar-label">NOTA SEBELUMNYA</p>
        <p className="layar-item aktif">Pie Susu Bu Made<small>Oleh-oleh</small></p>
        <p className="layar-item">Kopi Bubuk Kintamani<small>Kuliner</small></p>
        <p className="layar-item">Tas Anyaman Ate<small>Kerajinan</small></p>
      </div>

      <div className="demo-nota" aria-hidden="true">
        <p className="layar-label">NOTA PRODUK <span className="d-hitung"><b data-d-hitung>2</b> fakta</span></p>
        <p className="layar-f"><small>Nama produk</small>Pie Susu Bu Made</p>
        <div className="layar-f d-draf">
          <small>Bahan atau keunggulan</small>
          <p>
            pie susu <span className="d-coret">enak murah<i className="d-garis" /><b className="d-no">1</b></span>,{" "}
            <span className="d-sorot"><i className="d-sapu" />susu sapi asli</span>,{" "}
            <span className="d-sorot"><i className="d-sapu" />tahan 7 hari</span>,{" "}
            <span className="d-coret">pokoknya mantap<i className="d-garis" /><b className="d-no">2</b></span>
          </p>
        </div>
        <div className="layar-duo">
          <p className="layar-f"><small>Kategori</small>Oleh-oleh</p>
          <p className="layar-f"><small>Modal</small>Rp15.000</p>
        </div>
        <p className="layar-tombol d-tombol">Sunting dan cetak</p>
        <p className="d-catatan"><b className="d-no">1</b><b className="d-no">2</b>Klaim tanpa bukti dicoret pena merah.</p>
      </div>

      <div className="demo-hasil" aria-hidden="true">
        <div className="layar-head"><span className="d-judul-hasil">Struk promosi</span><span className="layar-status"><i />Demo</span></div>
        <div className="layar-struk d-struk">
          <p className="layar-label hijau">DESKRIPSI SINGKAT <b>Tersalin</b></p>
          <p>
            <Kata teks="Pie Susu Bu Made adalah oleh-oleh khas Bali dari" /> <Fakta>susu sapi asli</Fakta>
            <Kata teks="yang renyah dan" /> <Fakta>tahan 7 hari.</Fakta>
          </p>
        </div>
        <div className="layar-struk d-struk">
          <p className="layar-label hijau">CAPTION</p>
          <p>
            <Kata teks="Lagi cari oleh-oleh yang beda? Pie susu dari" /> <Fakta>susu sapi asli,</Fakta>
            <Kata teks="aman di koper sampai" /> <Fakta>7 hari.</Fakta> <Kata teks="Pesan lewat DM ya." />
          </p>
          <p className="d-tagar"><Kata teks="#OlehOlehBali #PieSusuBali #UMKMBali" /></p>
        </div>
        <div className="layar-struk d-struk d-struk-harga">
          <p className="layar-label hijau">SARAN HARGA JUAL</p>
          <p className="layar-harga">Rp27.000 – Rp35.000</p>
        </div>
      </div>
    </div>
  );
}
