import { Caveat, Dela_Gothic_One, IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Dela_Gothic_One({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });
const tangan = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-tangan", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-mono", display: "swap" });

export const metadata = {
  title: "UMKM Copilot Bali",
  description: "Bantu UMKM Bali menyiapkan deskripsi produk, caption, dan saran harga.",
};

export const viewport = { themeColor: "#f3ece0" };

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${sans.variable} ${display.variable} ${tangan.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
