import localFont from "next/font/local";
import GerakGlobal from "./components/GerakGlobal";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
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
// Judul tebal di beranda.
const display = localFont({
  src: "./fonts/BricolageGrotesque-latin.woff2",
  weight: "200 800",
  variable: "--font-display",
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
  title: { default: "UMKM Copilot Bali", template: "%s · UMKM Copilot Bali" },
  description: "Bantu UMKM Bali menyiapkan deskripsi produk, caption, dan saran harga.",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5efe1" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1217" },
  ],
};

// Dipasang sebelum halaman digambar supaya tidak ada kedipan tema yang salah.
const SKRIP_TEMA = `(function(){var t;try{t=localStorage.getItem("tema")}catch(e){}if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t;try{if(sessionStorage.getItem("pl"))document.documentElement.classList.add("pl-skip");sessionStorage.setItem("pl","1")}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${sans.variable} ${serif.variable} ${mono.variable} ${display.variable} ${tangan.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SKRIP_TEMA }} />
      </head>
      <body>
        <GerakGlobal />
        <SiteHeader />
        <main id="isi">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
