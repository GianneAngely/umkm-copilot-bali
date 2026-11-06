import localFont from "next/font/local";
import "./globals.css";

// Font disimpan di repo (app/fonts) supaya build tidak bergantung pada Google Fonts.
const sans = localFont({
  src: "./fonts/PlusJakartaSans-latin.woff2",
  weight: "200 800",
  variable: "--font-sans",
  display: "swap",
});
const serif = localFont({
  src: "./fonts/Newsreader-latin.woff2",
  weight: "200 800",
  variable: "--font-serif",
  display: "swap",
});
const mono = localFont({
  src: [
    { path: "./fonts/IBMPlexMono-Regular-latin.woff2", weight: "400" },
    { path: "./fonts/IBMPlexMono-SemiBold-latin.woff2", weight: "600" },
  ],
  variable: "--font-mono",
  display: "swap",
});
// Hanya untuk ilustrasi nota tulisan tangan di hero.
const tangan = localFont({
  src: "./fonts/Caveat-latin.woff2",
  weight: "400 700",
  variable: "--font-tangan",
  display: "swap",
});

export const metadata = {
  title: "UMKM Copilot Bali",
  description: "Bantu UMKM Bali menyiapkan deskripsi produk, caption, dan saran harga.",
};

export const viewport = { themeColor: "#f7f3ec" };

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${sans.variable} ${serif.variable} ${mono.variable} ${tangan.variable}`}>
      <body>{children}</body>
    </html>
  );
}
