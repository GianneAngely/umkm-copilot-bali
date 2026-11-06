import Image from "next/image";

// Foto latar hero yang berganti. Foto pertama tampil tanpa JS; pergantian diatur BerandaGerak.
export const HERO_FOTO = [
  ["hero-umkm", "42% 38%", "Pedagang sate di pasar kuliner Bali", "G Y"],
  ["pasar", "50% 55%", "Kunyit, limau, dan teri di pasar Bali", "Stijn Dijkstra"],
  ["kuliner", "50% 45%", "Lauk makanan jalanan Bali", "Kevin Yung"],
  ["kerajinan", "55% 50%", "Pengrajin ukir kayu di Ubud", "Smaart"],
  ["oleh-oleh", "50% 45%", "Jaja Bali dalam takir daun pisang", "Evert jan Hoek"],
];

export default function HeroFoto() {
  return (
    <>
      <div className="b-hero-tumpuk" data-hero-tumpuk aria-hidden="true">
        {HERO_FOTO.map(([nama, fokus], i) => (
          <Image key={nama} src={`/foto/${nama}.jpg`} alt="" fill sizes="100vw" priority={i === 0}
            className={i === 0 ? "b-hero-foto on" : "b-hero-foto"} style={{ objectPosition: fokus }} />
        ))}
      </div>
      <div className="b-hero-tirai" aria-hidden="true" />
      <div className="b-hero-keterangan">
        <span className="b-hero-titik" aria-hidden="true">
          {HERO_FOTO.map(([nama], i) => <i key={nama} className={i === 0 ? "on" : ""} />)}
        </span>
        <span data-hero-ket>{HERO_FOTO[0][2]} · Foto: {HERO_FOTO[0][3]} / Pexels</span>
      </div>
    </>
  );
}
