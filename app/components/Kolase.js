// Objek tanda tangan di hero: nota tulisan tangan disunting pena merah,
// lalu keluar struk promosi, label harga, dan HP berisi caption.
// Semua benda digambar dengan CSS dan SVG. Isinya contoh statis.

function Benda({ k, children }) {
  return (
    <div className={`k-obj k-${k}`} tabIndex={0}>
      <div className="k-in">{children}</div>
    </div>
  );
}

export default function Kolase() {
  return (
    <div className="meja" role="img"
      aria-label="Contoh: nota tulisan tangan disunting pena merah, lalu dicetak jadi struk promosi, label harga, dan caption Instagram">
      <div className="k-panggung">
        <div className="k-taplak" aria-hidden="true" />

        <Benda k="nota">
          <p className="k-label">TULISAN ANDA</p>
          <p className="k-tangan">Pie susu Bu Made</p>
          <p className="k-tangan"><del>enak, murah</del><i className="k-no">1</i></p>
          <p className="k-tangan"><mark className="k-stabilo">susu sapi asli</mark></p>
          <p className="k-tangan"><mark className="k-stabilo">tahan 7 hari</mark><i className="k-no">2</i></p>
          <p className="k-tangan k-sembunyi-hp"><del>pokoknya mantap</del></p>
          <p className="k-tangan">modal <mark className="k-stabilo">15rb</mark></p>
        </Benda>

        <Benda k="catatan">
          <p className="k-label k-merah">CATATAN PENA MERAH</p>
          <p className="k-catat"><i className="k-no">1</i>Klaim tanpa bukti, dicoret.</p>
          <p className="k-catat"><i className="k-no">2</i>Fakta dari Anda, dipakai.</p>
        </Benda>

        <Benda k="pena">
          <svg viewBox="0 0 160 28" aria-hidden="true">
            <rect x="22" y="6" width="104" height="16" rx="3" fill="#c43a2c" />
            <rect x="96" y="6" width="44" height="16" rx="3" fill="#a52f23" />
            <rect x="104" y="2" width="30" height="4" rx="2" fill="#1f1a15" />
            <path d="M22 6 L4 14 L22 22 Z" fill="#e9d9bf" />
            <path d="M4 14 L10 11.3 L10 16.7 Z" fill="#1f1a15" />
          </svg>
        </Benda>

        <Benda k="struk">
          <div className="k-struk-head"><b>NOTA PROMOSI</b><span>Pie Susu Bu Made · No. 0142</span></div>
          <div className="k-baris">
            <p className="k-judul">DESKRIPSI</p>
            <p>Oleh-oleh khas Bali dari <mark className="k-stabilo">susu sapi asli</mark>, renyah sampai <mark className="k-stabilo">tujuh hari</mark>.</p>
          </div>
          <div className="k-baris k-sembunyi-hp">
            <p className="k-judul">CAPTION</p>
            <p>Lagi cari oleh-oleh yang beda? Pie Susu Bu Made <span className="k-cetak">jawabannya. Pesan lewat DM.</span></p>
          </div>
          <div className="k-baris k-sembunyi-hp">
            <p className="k-judul">ENGLISH</p>
            <p>Small-batch milk pie from Bali, crisp for a week.</p>
          </div>
          <div className="k-barcode" aria-hidden="true" />
          <div className="k-cap">0 klaim karangan</div>
        </Benda>

        <Benda k="tag">
          <p className="k-label">HARGA JUAL</p>
          <b>Rp27rb</b>
          <span>sampai Rp35rb</span>
        </Benda>

        <Benda k="hp">
          <div className="k-layar">
            <div className="k-ig"><i />piesusubumade</div>
            <div className="k-foto">
              <svg viewBox="0 0 88 88" aria-hidden="true">
                <circle cx="44" cy="44" r="42" fill="#d6964a" />
                <circle cx="44" cy="44" r="31" fill="#f1d491" />
                <circle cx="35" cy="37" r="4" fill="#c4863a" />
                <circle cx="54" cy="50" r="3" fill="#c4863a" />
                <circle cx="47" cy="32" r="2" fill="#c4863a" />
              </svg>
            </div>
            <p><b>piesusubumade</b> Lagi cari oleh-oleh yang beda dari biasanya? Pie Susu Bu Made jawabannya.</p>
            <p className="k-tagar">#OlehOlehBali #PieSusuBali</p>
          </div>
        </Benda>
      </div>
    </div>
  );
}
