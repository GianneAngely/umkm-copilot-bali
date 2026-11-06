import { AiError, generateMock, generateWithGemini } from "@/lib/generate";

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

  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ mode: "mock", result: generateMock(input) });
  }

  try {
    const result = await generateWithGemini(input);
    return Response.json({ mode: "ai", result });
  } catch (err) {
    if (err instanceof AiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error(err);
    return Response.json({ error: "Terjadi kesalahan di server." }, { status: 500 });
  }
}
