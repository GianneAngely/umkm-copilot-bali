import "./globals.css";

export const metadata = {
  title: "UMKM Copilot Bali",
  description: "Bantu UMKM Bali menyiapkan deskripsi produk, caption, dan saran harga.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
