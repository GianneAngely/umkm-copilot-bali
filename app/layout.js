import localFont from "next/font/local";
import GerakGlobal from "./components/GerakGlobal";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import "./globals.css";

// Font disimpan di repo (app/fonts) supaya build tidak bergantung pada Google Fonts.
const mono = localFont({
  src: "./fonts/SplineSansMono-latin.woff2",
  weight: "300 700",
  variable: "--font-mono",
  display: "swap",
});
// Bricolage Grotesque untuk judul dan isi, Spline Sans Mono untuk label (seperti PERINTIS).
const display = localFont({
  src: "./fonts/BricolageGrotesque-latin.woff2",
  weight: "200 800",
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  title: { default: "UMKM Copilot Bali", template: "%s · UMKM Copilot Bali" },
  description: "Bantu UMKM Bali menyiapkan deskripsi produk, caption, dan saran harga.",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1e8" },
    { media: "(prefers-color-scheme: dark)", color: "#110d33" },
  ],
};

// Dipasang sebelum halaman digambar supaya tidak ada kedipan tema yang salah.
const SKRIP_TEMA = `(function(){var t;try{t=localStorage.getItem("tema")}catch(e){}if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${mono.variable} ${display.variable}`} suppressHydrationWarning>
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
