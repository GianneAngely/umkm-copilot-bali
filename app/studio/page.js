import { redirect } from "next/navigation";

// Studio pindah ke /app. Nama produk dari ?nama= ikut dibawa.
export default async function StudioPage({ searchParams }) {
  const { nama } = await searchParams;
  redirect(nama ? `/app?nama=${encodeURIComponent(String(nama).slice(0, 100))}` : "/app");
}
