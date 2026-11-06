import Image from "next/image";
import Link from "next/link";
import Icon from "./Icon";

const DAFTAR = ["Deskripsi jujur", "Caption + hashtag", "Saran harga", "English"];

const BARIS = [
  ["kuliner", "Untuk pedagang//", "Warung, perajin, dan toko oleh-oleh. Cukup lima isian singkat."],
  ["pasar", "Data tetap milik Anda//", "Tidak ada database. Riwayat lima nota tersimpan di peramban Anda."],
];

export default function Bento() {
  return (
    <section className="bento" aria-label="Yang Anda dapat">
      <div className="wrap bento-grid">
        <article className="bento-kartu bento-satu" data-muncul>
          <div className="bento-foto">
            <Image src="/foto/kerajinan.jpg" alt="Pengrajin ukir kayu tersenyum sambil memahat di Ubud" fill sizes="(min-width: 1024px) 380px, 92vw"
              style={{ objectFit: "cover", objectPosition: "55% 50%" }} />
            <Link className="v-panah" href="/studio" aria-label="Buka Studio"><Icon name="arrow" /></Link>
          </div>
          <ol className="bento-daftar">
            {DAFTAR.map((d, i) => (
              <li key={d}><span>{String(i + 1).padStart(2, "0")}/</span>{d}</li>
            ))}
          </ol>
        </article>

        <article className="bento-kartu bento-dua" data-muncul>
          <span className="bento-petik" aria-hidden="true">&ldquo;</span>
          <p className="bento-kutip">Kami tidak menambah klaim. Kami merapikan yang sudah Anda punya.</p>
          <div className="bento-aksi">
            <Link className="bento-pil" href="/cara-kerja">Lihat cara kerja</Link>
            <Link className="v-panah v-panah-statis" href="/cara-kerja" aria-label="Lihat cara kerja"><Icon name="arrow" /></Link>
          </div>
        </article>

        <article className="bento-kartu bento-tiga" data-muncul>
          {BARIS.map(([foto, judul, teks]) => (
            <div className="bento-baris" key={judul}>
              <span className="bento-thumb">
                <Image src={`/foto/${foto}.jpg`} alt="" fill sizes="96px" style={{ objectFit: "cover" }} />
              </span>
              <div>
                <h3>{judul}</h3>
                <p>{teks}</p>
              </div>
            </div>
          ))}
          <span className="bento-gulir" aria-hidden="true"><i /></span>
        </article>
      </div>
    </section>
  );
}
