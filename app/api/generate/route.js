import { AiError, adaPenyediaAI } from "@/lib/ai";
import { generateMock, generateWithAI } from "@/lib/generate";

// Claude (maks ~20 dtk) lalu cadangan Gemini (maks 25 dtk).
export const maxDuration = 60;

const KATEGORI = ["Kuliner", "Kerajinan", "Fashion", "Oleh-oleh", "Lainnya"];

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Format data tidak valid." }, { status: 400 });
  }

  const input = {
    nama: String(body.nama || "").trim().slice(0, 100),
    kategori: KATEGORI.includes(body.kategori) ? body.kategori : "Lainnya",
    keunggulan: String(body.keunggulan || "").trim().slice(0, 500),
    modal: Number(body.modal) > 0 ? Math.round(Number(body.modal)) : null,
    target: body.target === "turis" ? "turis" : "lokal",
  };
  if (!input.nama) {
    return Response.json({ error: "Nama produk wajib diisi." }, { status: 400 });
  }

  if (!adaPenyediaAI()) {
    return Response.json({ mode: "mock", result: generateMock(input) });
  }

  try {
    const { data, model } = await generateWithAI(input);
    return Response.json({ mode: "ai", model, result: data });
  } catch (err) {
    if (err instanceof AiError) {
      // Saat kuota penuh, contoh ikut dikirim tapi hanya tampil kalau pengguna memilihnya.
      const extra = err.status === 429 ? { contoh: generateMock(input) } : {};
      return Response.json({ error: err.message, ...extra }, { status: err.status });
    }
    console.error(err);
    return Response.json({ error: "Terjadi kesalahan di server." }, { status: 500 });
  }
}
