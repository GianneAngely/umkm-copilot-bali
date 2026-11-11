import { AiError, adaPenyediaAI } from "@/lib/ai";
import { buatProfil, profilContoh } from "@/lib/profil";

// Claude (maks ~20 dtk) lalu cadangan Gemini (maks 25 dtk).
export const maxDuration = 60;

const KATEGORI = ["Kuliner", "Kerajinan", "Fashion", "Oleh-oleh", "Lainnya"];

// Body: { produk: { nama, kategori, keunggulan, target }, toko: { nama, kota } }
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Format data tidak valid." }, { status: 400 });
  }

  const p = body.produk || {};
  const produk = {
    nama: String(p.nama || "").trim().slice(0, 100),
    kategori: KATEGORI.includes(p.kategori) ? p.kategori : "Lainnya",
    keunggulan: String(p.keunggulan || "").trim().slice(0, 500),
    target: p.target === "turis" ? "turis" : "lokal",
  };
  if (!produk.nama) {
    return Response.json({ error: "Nama produk wajib diisi." }, { status: 400 });
  }
  const toko = {
    nama: String(body.toko?.nama || "").trim().slice(0, 60),
    kota: String(body.toko?.kota || "").trim().slice(0, 60),
  };
  const input = { produk, toko };

  if (!adaPenyediaAI()) {
    return Response.json({ mode: "mock", result: profilContoh(input) });
  }

  try {
    const { data, model } = await buatProfil(input);
    return Response.json({ mode: "ai", model, result: data });
  } catch (err) {
    if (err instanceof AiError) {
      // Saat kuota penuh, contoh ikut dikirim tapi hanya tampil kalau pengguna memilihnya.
      const extra = err.status === 429 ? { contoh: profilContoh(input) } : {};
      return Response.json({ error: err.message, ...extra }, { status: err.status });
    }
    console.error(err);
    return Response.json({ error: "Terjadi kesalahan di server." }, { status: 500 });
  }
}
