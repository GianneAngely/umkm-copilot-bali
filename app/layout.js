import localFont from "next/font/local";
import "./globals.css";

// Font disimpan di repo (app/fonts) supaya build tidak bergantung pada Google Fonts.
// Familjen Grotesk untuk judul, Plus Jakarta Sans untuk isi, IBM Plex Mono untuk label dan angka nota.
const display = localFont({ src: "./fonts/FamiljenGrotesk-latin.woff2", weight: "400 700", variable: "--font-display", display: "swap" });
const sans = localFont({ src: "./fonts/PlusJakartaSans-latin.woff2", weight: "200 800", variable: "--font-sans", display: "swap" });
const mono = localFont({
  src: [
    { path: "./fonts/IBMPlexMono-Regular-latin.woff2", weight: "400" },
    { path: "./fonts/IBMPlexMono-SemiBold-latin.woff2", weight: "600" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: { default: "Wicara, asisten tulis jualan untuk UMKM Bali", template: "%s · Wicara" },
  description: "Wicara membantu UMKM Bali menyusun deskripsi produk, caption, saran harga, dan versi Inggris dari satu nota.",
};

export const viewport = {
  themeColor: "#f4efe3",
  colorScheme: "light",
};

// Dipasang sebelum halaman digambar: kelas "js" untuk animasi landing.
// Kalau skrip gerak gagal jalan dalam 2,5 detik, kelas itu dicabut supaya isi tetap tampil.
const SKRIP_JS = `(function(){var h=document.documentElement;h.classList.add("js");setTimeout(function(){if(!window.__gerak)h.classList.remove("js")},2500)})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SKRIP_JS }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
