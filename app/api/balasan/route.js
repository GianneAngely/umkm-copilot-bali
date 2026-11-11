import { AiError, adaPenyediaAI } from "@/lib/ai";
import { balasanContoh, buatBalasan } from "@/lib/balasan";

// Claude (maks ~20 dtk) lalu cadangan Gemini (maks 25 dtk).
export const maxDuration = 60;

const KATEGORI = ["Kuliner", "Kerajinan", "Fashion", "Oleh-oleh", "Lainnya"];

function angka(n) {
  const x = Number(n);
  return Number.isFinite(x) && x > 0 ? Math.round(Math.min(x, 1e9)) : null;
}

// Body: { produk: { nama, kategori, keunggulan, target }, hasil: { harga: { min, max }, deskripsi_singkat } }
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
  const h = body.hasil?.harga || {};
  const min = angka(h.min);
  const max = angka(h.max);
  const input = {
    produk,
    ringkasan: String(body.hasil?.deskripsi_singkat || "").trim().slice(0, 600),
    harga: min && max ? { min: Math.min(min, max), max: Math.max(min, max) } : null,
  };

  if (!adaPenyediaAI()) {
    return Response.json({ mode: "mock", result: balasanContoh(input) });
  }

  try {
    const { model, ...result } = await buatBalasan(input);
    return Response.json({ mode: "ai", model, result });
  } catch (err) {
    if (err instanceof AiError) {
      // Saat kuota penuh, contoh ikut dikirim tapi hanya tampil kalau pengguna memilihnya.
      const extra = err.status === 429 ? { contoh: balasanContoh(input) } : {};
      return Response.json({ error: err.message, ...extra }, { status: err.status });
    }
    console.error(err);
    return Response.json({ error: "Terjadi kesalahan di server." }, { status: 500 });
  }
}
