// Bingkai jendela aplikasi (ala peramban) untuk memamerkan layar Studio.
// Isinya markup statis yang memakai komponen visual yang sama dengan Studio.

export function Jendela({ alamat = "umkmcopilot.id/studio", className = "", children }) {
  return (
    <div className={`jendela ${className}`} aria-hidden={className.includes("jendela-cerita") || undefined}>
      <div className="jendela-bar" aria-hidden="true">
        <span className="jendela-titik"><i /><i /><i /></span>
        <span className="jendela-alamat">{alamat}</span>
        <span className="jendela-ruang" />
      </div>
      <div className="jendela-isi">{children}</div>
    </div>
  );
}

export function Stiker({ href = "/studio", children = "Coba" }) {
  return (
    <a className="stiker" href={href}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 2l9 15 16-8 2 18 18 2-8 16 15 9-15 9 8 16-18 2-2 18-16-8-9 15-9-15-16 8-2-18-18-2 8-16L2 50l15-9-8-16 18-2 2-18 16 8z" />
      </svg>
      <span>{children} →</span>
    </a>
  );
}

// Layar Studio dalam keadaan sudah mencetak struk, untuk pajangan di beranda.
export function LayarStudio() {
  return (
    <div className="layar" aria-label="Contoh layar Studio: nota Pie Susu Bu Made dan struk deskripsi yang sudah disunting" role="img">
      <div className="layar-samping" aria-hidden="true">
        <p className="layar-label">NOTA SEBELUMNYA</p>
        <p className="layar-item aktif">Pie Susu Bu Made<small>Oleh-oleh</small></p>
        <p className="layar-item">Kopi Bubuk Kintamani<small>Kuliner</small></p>
        <p className="layar-item">Tas Anyaman Ate<small>Kerajinan</small></p>
      </div>
      <div className="layar-nota" aria-hidden="true">
        <p className="layar-label">NOTA PRODUK</p>
        <p className="layar-f"><small>Nama produk</small>Pie Susu Bu Made</p>
        <p className="layar-f"><small>Bahan atau keunggulan</small>pie susu <del>enak murah</del>, <mark>susu sapi asli</mark>, <mark>tahan 7 hari</mark></p>
        <div className="layar-duo">
          <p className="layar-f"><small>Kategori</small>Oleh-oleh</p>
          <p className="layar-f"><small>Modal</small>Rp15.000</p>
        </div>
        <p className="layar-tombol">Sunting dan cetak</p>
      </div>
      <div className="layar-hasil" aria-hidden="true">
        <div className="layar-head"><span><mark>2 fakta</mark> dari isian dipakai</span><span className="layar-status"><i />AI aktif</span></div>
        <div className="layar-struk">
          <p className="layar-label hijau">DESKRIPSI SINGKAT <b>Tersalin</b></p>
          <p>Pie Susu Bu Made adalah oleh-oleh khas Bali dari <mark>susu sapi asli</mark>, renyah, dan <mark>tahan 7 hari</mark>. Pas dibawa pulang setelah liburan.</p>
        </div>
        <div className="layar-struk">
          <p className="layar-label hijau">SARAN HARGA JUAL</p>
          <p className="layar-harga">Rp27.000 – Rp35.000</p>
        </div>
      </div>
    </div>
  );
}
