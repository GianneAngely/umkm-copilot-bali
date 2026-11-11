import Link from "next/link";
import { StripIkat } from "./Ornamen";

const KREDIT = [
  ["G Y", "https://www.pexels.com/photo/31246481/"],
  ["Stijn Dijkstra", "https://www.pexels.com/photo/38330312/"],
  ["Kevin Yung", "https://www.pexels.com/photo/36892251/"],
  ["Smaart", "https://www.pexels.com/photo/32064709/"],
  ["Andreas Suwardy", "https://www.pexels.com/photo/40524482/"],
  ["Evert jan Hoek", "https://www.pexels.com/photo/36858325/"],
];

export default function SiteFooter() {
  return (
    <footer className="kaki" id="tentang">
      <StripIkat />
      <div className="wrap kaki-grid">
        <div>
          <Link className="merek" href="/" aria-label="Wicara, ke atas">Wicara<i aria-hidden="true" /></Link>
          <p className="kaki-tagline">Asisten tulis jualan untuk UMKM Bali. Dari bahasa Jawa dan Bali kuno: ucapan, perkataan.</p>
        </div>
        <nav className="kaki-tautan" aria-label="Tautan kaki">
          <a href="#masalah">Masalah</a>
          <a href="#cara-kerja">Cara kerja</a>
          <a href="#contoh">Contoh</a>
          <Link href="/app">Buka app</Link>
        </nav>
        <div className="kaki-info">
          <p className="kaki-ai">Teks dibuat dengan bantuan AI (Claude oleh Anthropic, cadangan Google Gemini). Periksa kembali sebelum diunggah.</p>
          <p>Dibuat oleh Gianne Angely, Teknik Informatika, Universitas Dhyana Pura.</p>
          <p>AI Web Innovation Challenge · Bali Digifest 2026</p>
          <p className="kaki-kredit">
            Foto: {KREDIT.map(([nama, url], i) => (
              <span key={url}>{i > 0 && ", "}<a href={url} target="_blank" rel="noopener noreferrer">{nama}</a></span>
            ))} (Pexels)
          </p>
        </div>
      </div>
    </footer>
  );
}
