"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { Jendela } from "./Jendela";

gsap.registerPlugin(ScrollTrigger);

// Kiri: daftar bernomor, kanan: jendela produk yang isinya berganti sesuai item aktif.
// Tiap panel adalah layar hasil yang utuh, dengan coretan merah dan stabilo dari isian.

function Kepala({ judul, salin = "Salin" }) {
  return (
    <div className="p-kepala">
      <span>{judul}</span>
      <span className={salin === "Tersalin" ? "p-salin ok" : "p-salin"}>{salin}</span>
    </div>
  );
}

const ITEM = [
  {
    judul: "Deskripsi",
    teks: "Dua versi: singkat untuk marketplace, bercerita untuk Instagram. Klaim kosong dicoret pena merah.",
    panel: (
      <div className="p-layar">
        <div className="p-draf">
          <span className="p-cap">DRAF ANDA</span>
          <p>pie susu <del>enak murah</del>, <mark>susu sapi asli</mark>, <mark>tahan 7 hari</mark>, <del>pokoknya mantap</del></p>
        </div>
        <div className="p-blok">
          <Kepala judul="DESKRIPSI SINGKAT" salin="Tersalin" />
          <p className="p-serif">Pie Susu Bu Made adalah oleh-oleh khas Bali dari <mark>susu sapi asli</mark>, renyah, dan <mark>tahan 7 hari</mark>.</p>
          <p className="p-meta">17 kata · pas untuk kolom deskripsi marketplace</p>
        </div>
        <div className="p-blok">
          <Kepala judul="DESKRIPSI BERCERITA" />
          <p>Setiap pagi di dapur kecil di Gianyar, Pie Susu Bu Made dipanggang sedikit demi sedikit. Adonannya memakai <mark>susu sapi asli</mark>, jadi rasanya lembut tanpa terlalu manis. Kulitnya renyah dan <mark>tahan 7 hari</mark>, cukup untuk dibawa pulang ke rumah. Satu kotak pas untuk dibagi bersama keluarga.</p>
          <p className="p-meta">45 kata · untuk caption panjang atau halaman toko</p>
        </div>
      </div>
    ),
  },
  {
    judul: "Caption + hashtag",
    teks: "Siap tempel di Instagram atau WhatsApp, dengan 8 sampai 12 hashtag khas Bali.",
    panel: (
      <div className="p-layar p-ig-wrap">
        <div className="p-ig">
          <div className="p-ig-atas"><i className="p-avatar" />piesusubumade<span>Gianyar, Bali</span></div>
          <div className="p-ig-foto">
            <Image src="/foto/oleh-oleh.jpg" alt="" fill sizes="240px" style={{ objectFit: "cover", objectPosition: "50% 45%" }} />
          </div>
          <div className="p-ig-ikon" aria-hidden="true"><i /><i /><i /></div>
        </div>
        <div className="p-ig-teks">
          <Kepala judul="CAPTION" salin="Tersalin" />
          <p><b>piesusubumade</b> Lagi cari oleh-oleh yang beda? Pie Susu Bu Made dibuat dari <mark>susu sapi asli</mark> dan <mark>tahan 7 hari</mark> di koper. Pesan lewat DM ya, kami siapkan hari ini juga.</p>
          <ul className="p-chip">
            <li>#OlehOlehBali</li><li>#PieSusuBali</li><li>#ProdukLokalBali</li><li>#UMKMBali</li>
            <li>#Gianyar</li><li>#BaliTrip</li><li>#JajananBali</li><li>#BanggaBuatanIndonesia</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    judul: "Saran harga",
    teks: "Rentang harga jual dihitung dari modal dan target pembeli, lengkap dengan alasannya.",
    panel: (
      <div className="p-layar">
        <div className="p-blok">
          <Kepala judul="SARAN HARGA JUAL" />
          <p className="p-harga">Rp27.000 – Rp35.000</p>
          <p className="p-kecil">per kotak, untuk pembeli wisatawan</p>
        </div>
        <div className="p-rumus" aria-label="Modal Rp15.000 dikali margin 1,8 sampai 2,3">
          <div><span className="p-cap">MODAL</span><b><mark>Rp15.000</mark></b></div>
          <span className="p-op">×</span>
          <div><span className="p-cap">MARGIN</span><b>1,8 – 2,3</b></div>
          <span className="p-op">=</span>
          <div><span className="p-cap">HARGA JUAL</span><b className="hijau">Rp27rb – 35rb</b></div>
        </div>
        <div className="p-banding" aria-label="Perbandingan rentang harga untuk pembeli lokal dan wisatawan">
          <p><span>Pembeli lokal</span><i style={{ "--a": "0%", "--b": "38%" }} /><b>Rp21rb – 26rb</b></p>
          <p className="pilih"><span>Wisatawan</span><i style={{ "--a": "36%", "--b": "100%" }} /><b>Rp27rb – 35rb</b></p>
        </div>
        <div className="p-blok">
          <span className="p-cap">ALASAN</span>
          <p>Dengan modal <mark>Rp15.000</mark>, margin 80–130% masih wajar untuk pasar wisatawan yang biasanya membeli di toko oleh-oleh atau area wisata.</p>
        </div>
      </div>
    ),
  },
  {
    judul: "English",
    teks: "Versi Bahasa Inggris untuk wisatawan, ditulis ulang dan bukan terjemahan kata per kata.",
    panel: (
      <div className="p-layar">
        <div className="p-blok">
          <Kepala judul="DESCRIPTION" />
          <p className="p-serif" lang="en">Pie Susu Bu Made is a small-batch milk pie from Bali, made with <mark>fresh cow&rsquo;s milk</mark>. Crisp, lightly sweet, and good for <mark>7 days</mark>.</p>
        </div>
        <div className="p-blok">
          <Kepala judul="CAPTION FOR TRAVELLERS" salin="Tersalin" />
          <p lang="en">Taking a piece of Bali home? Try Pie Susu Bu Made, baked every morning in Gianyar. It keeps for <mark>7 days</mark>, so it survives the flight. Message us to order.</p>
        </div>
        <div className="p-istilah">
          <span className="p-cap">PILIHAN KATA</span>
          <p><span>oleh-oleh</span><i>→</i><b lang="en">souvenir to bring home</b></p>
          <p><span>renyah</span><i>→</i><b lang="en">crisp</b></p>
        </div>
        <div className="p-blok">
          <Kepala judul="HASHTAGS" />
          <ul className="p-chip p-chip-rapat">
            <li>#BaliSouvenir</li><li>#BaliFood</li><li>#MadeInBali</li><li>#UbudEats</li><li>#SmallBatch</li>
          </ul>
        </div>
      </div>
    ),
  },
];

export default function CeritaSticky({ judul, lead }) {
  const [aktif, setAktif] = useState(0);
  const akar = useRef(null);
  const st = useRef(null);

  // Desktop: bagian dipaku dan gulir menentukan state aktif. Di HP atau saat gerak dikurangi,
  // daftar tampil biasa dan panel muncul di bawah tiap item.
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 960px) and (min-height: 760px)", () => {
      st.current = ScrollTrigger.create({
        trigger: akar.current,
        start: "top top",
        end: () => "+=" + window.innerHeight * 2.2,
        pin: true,
        anticipatePin: 1,
        onUpdate: (s) => setAktif(Math.min(ITEM.length - 1, Math.floor(s.progress * ITEM.length))),
      });
      return () => { st.current = null; };
    });
    return () => mm.revert();
  }, []);

  function pilih(i) {
    const s = st.current;
    if (s && window.lenis) {
      window.lenis.scrollTo(s.start + ((i + 0.5) / ITEM.length) * (s.end - s.start));
    } else if (s) {
      window.scrollTo(0, s.start + ((i + 0.5) / ITEM.length) * (s.end - s.start));
    } else {
      setAktif(i);
    }
  }

  return (
    <div className="cerita-pin" ref={akar}>
      <div className="wrap cerita">
        <div className="cerita-kiri">
          <div className="b-kepala">
            <h2 id="cerita-judul">{judul}</h2>
            <p>{lead}</p>
          </div>
          <ol className="cerita-daftar">
            {ITEM.map((it, i) => (
              <li key={it.judul} className={i === aktif ? "aktif" : ""}>
                <button type="button" className="cerita-tombol" onClick={() => pilih(i)} aria-pressed={i === aktif}>
                  <span className="cerita-no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="cerita-nama">{it.judul}</span>
                </button>
                <p className="cerita-teks">{it.teks}</p>
                <div className="cerita-panel-hp" aria-hidden="true"><div className="panel">{it.panel}</div></div>
              </li>
            ))}
          </ol>
        </div>
        <div className="cerita-kanan">
          <Jendela alamat="umkmcopilot.id/studio" demo className="jendela-cerita">
            <div className="panel-tumpuk">
              {ITEM.map((it, i) => (
                <div key={it.judul} className={`panel${i === aktif ? " aktif" : ""}`} data-panel={i}>{it.panel}</div>
              ))}
            </div>
          </Jendela>
        </div>
      </div>
    </div>
  );
}
