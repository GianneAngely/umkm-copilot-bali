import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="foot">
      <div className="wrap foot-grid">
        <div className="foot-merek">
          <Link className="logo" href="/" aria-label="UMKM Copilot Bali, beranda">
            <i className="logo-mark" aria-hidden="true" />
            <span className="logo-text">UMKM Copilot</span>
          </Link>
          <p>Asisten menulis untuk UMKM Bali: deskripsi produk, caption, saran harga, dan versi Inggris dari satu nota.</p>
        </div>
        <nav className="foot-kolom" aria-label="Produk">
          <p className="foot-judul">PRODUK</p>
          <Link href="/studio">Studio</Link>
          <Link href="/contoh">Contoh hasil</Link>
        </nav>
        <nav className="foot-kolom" aria-label="Pelajari">
          <p className="foot-judul">PELAJARI</p>
          <Link href="/cara-kerja">Cara kerja</Link>
          <Link href="/tentang">Tentang</Link>
        </nav>
        <div className="foot-info">
          <p className="foot-disclosure">Teks dibuat dengan bantuan AI (Google Gemini). Periksa kembali sebelum diunggah.</p>
          <p>Dibuat oleh Gianne Angely, Teknik Informatika, Universitas Dhyana Pura.</p>
          <p className="foot-meta">© 2026 · AI Web Innovation Challenge, Bali Digifest 2026</p>
        </div>
      </div>
    </footer>
  );
}
