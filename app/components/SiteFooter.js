const KREDIT = [
  ["G Y", "https://www.pexels.com/photo/31246481/"],
  ["Stijn Dijkstra", "https://www.pexels.com/photo/38330312/"],
  ["Kevin Yung", "https://www.pexels.com/photo/36892251/"],
  ["Smaart", "https://www.pexels.com/photo/32064709/"],
  ["Andreas Suwardy", "https://www.pexels.com/photo/40524482/"],
  ["Evert jan Hoek", "https://www.pexels.com/photo/36858325/"],
];

// Kaki halaman berbentuk ujung struk.
export default function SiteFooter() {
  return (
    <footer className="kaki" id="tentang">
      <div className="wrap">
        <p className="kaki-terima">*** Terima kasih ***</p>
        <div className="barcode" aria-hidden="true" />
        <p className="kaki-baris"><b>UMKM Copilot</b> · Asisten menulis untuk UMKM Bali</p>
        <p className="kaki-baris">Dibuat oleh Gianne Angely · Teknik Informatika, Universitas Dhyana Pura</p>
        <p className="kaki-baris">AI Web Innovation Challenge · Bali Digifest 2026</p>
        <p className="kaki-ai">Teks dibuat dengan bantuan AI (Google Gemini). Periksa kembali sebelum diunggah.</p>
        <p className="kaki-kredit">
          Foto: {KREDIT.map(([nama, url], i) => (
            <span key={url}>{i > 0 && " · "}<a href={url} target="_blank" rel="noopener noreferrer">{nama}</a></span>
          ))} / Pexels
        </p>
      </div>
    </footer>
  );
}
