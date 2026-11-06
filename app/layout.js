import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata = {
  title: "UMKM Copilot Bali",
  description: "Bantu UMKM Bali menyiapkan deskripsi produk, caption, dan saran harga.",
};

export const viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={sans.variable}>
      <body>{children}</body>
    </html>
  );
}
