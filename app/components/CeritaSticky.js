"use client";

import { useEffect, useRef, useState } from "react";
import { Jendela, Stiker } from "./Jendela";

// Kiri: daftar bernomor yang aktif mengikuti gulir. Kanan: jendela produk yang menempel
// dan isinya berganti sesuai item aktif. Di HP, panel tampil di bawah tiap item.

const ITEM = [
  {
    judul: "Deskripsi",
    teks: "Dua versi: singkat untuk marketplace, bercerita untuk Instagram. Klaim kosong dicoret pena merah.",
    panel: (
      <>
        <p className="layar-label">DRAF ANDA</p>
        <p className="panel-draf">pie susu <del>enak murah</del>, <mark>susu sapi asli</mark>, <mark>tahan 7 hari</mark>, <del>pokoknya mantap</del></p>
        <p className="layar-label hijau">DESKRIPSI SINGKAT</p>
        <p className="panel-jadi">Pie Susu Bu Made adalah oleh-oleh khas Bali dari <mark>susu sapi asli</mark>, renyah, dan <mark>tahan 7 hari</mark>.</p>
      </>
    ),
  },
  {
    judul: "Caption + hashtag",
    teks: "Siap tempel di Instagram atau WhatsApp, dengan 8 sampai 12 hashtag khas Bali.",
    panel: (
      <>
        <p className="layar-label hijau">CAPTION</p>
        <p className="panel-jadi">Lagi cari oleh-oleh yang beda? Pie Susu Bu Made dari <mark>susu sapi asli</mark>, <mark>tahan 7 hari</mark> di koper. Pesan lewat DM ya.</p>
        <ul className="panel-chip"><li>#OlehOlehBali</li><li>#PieSusuBali</li><li>#ProdukLokalBali</li><li>#UMKMBali</li><li>#Gianyar</li></ul>
      </>
    ),
  },
  {
    judul: "Saran harga",
    teks: "Rentang harga jual dihitung dari modal dan target pembeli, lengkap dengan alasannya.",
    panel: (
      <>
        <p className="layar-label hijau">SARAN HARGA JUAL</p>
        <p className="panel-harga">Rp27.000 – Rp35.000</p>
        <p className="panel-jadi kecil">Dengan modal <mark>Rp15.000</mark>, margin 80–130% masih wajar untuk pasar wisatawan.</p>
        <div className="panel-bar" aria-hidden="true"><span style={{ "--w": "43%" }}>modal</span><span style={{ "--w": "57%" }}>margin</span></div>
      </>
    ),
  },
  {
    judul: "English",
    teks: "Versi Bahasa Inggris untuk wisatawan, ditulis ulang dan bukan terjemahan kata per kata.",
    panel: (
      <>
        <p className="layar-label hijau">FOR TRAVELLERS</p>
        <p className="panel-jadi" lang="en">Small-batch milk pie from Bali, made with <mark>fresh cow&rsquo;s milk</mark> and good for <mark>7 days</mark>. A sweet souvenir to bring home.</p>
      </>
    ),
  },
];

export default function CeritaSticky() {
  const [aktif, setAktif] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entri) => entri.forEach((e) => e.isIntersecting && setAktif(Number(e.target.dataset.i))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="cerita">
      <ol className="cerita-daftar">
        {ITEM.map((it, i) => (
          <li key={it.judul} ref={(el) => (refs.current[i] = el)} data-i={i} className={i === aktif ? "aktif" : ""}>
            <p className="cerita-no">{String(i + 1).padStart(2, "0")}</p>
            <div>
              <h3>{it.judul}</h3>
              <p className="cerita-teks">{it.teks}</p>
              <div className="cerita-panel-hp"><div className="panel">{it.panel}</div></div>
            </div>
          </li>
        ))}
      </ol>
      <div className="cerita-kanan">
        <Jendela alamat="umkmcopilot.id/studio" className="jendela-cerita">
          <div className="panel-tumpuk">
            {ITEM.map((it, i) => (
              <div key={it.judul} className={`panel${i === aktif ? " aktif" : ""}`}>{it.panel}</div>
            ))}
          </div>
        </Jendela>
        <Stiker />
      </div>
    </div>
  );
}
