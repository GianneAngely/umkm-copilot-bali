import { AiError, adaPenyediaAI } from "@/lib/ai";
import { UKURAN_MAKS, jenisGambar } from "@/lib/foto";
import { nilaiFoto, studioContoh } from "@/lib/studio";

// Claude (maks ~20 dtk) lalu cadangan Gemini (maks 25 dtk).
export const maxDuration = 60;

// Menerima foto produk sebagai multipart (field "foto"). Mengembalikan nilai, masalah,
// pengaturan perbaikan, dan tips; foto dirapikan di browser, bukan di server.
export async function POST(request) {
  let buf;
  try {
    const file = (await request.formData()).get("foto");
    if (!file || typeof file === "string") throw new Error("tanpa foto");
    buf = Buffer.from(await file.arrayBuffer());
  } catch {
    return Response.json({ error: "Foto tidak terbaca. Pilih ulang fotonya." }, { status: 400 });
  }

  if (buf.length === 0) {
    return Response.json({ error: "Foto tidak terbaca. Pilih ulang fotonya." }, { status: 400 });
  }
  if (buf.length > UKURAN_MAKS) {
    return Response.json({ error: "Ukuran foto lebih dari 4 MB." }, { status: 413 });
  }
  const mimeType = jenisGambar(buf);
  if (!mimeType) {
    return Response.json({ error: "Format foto harus JPEG atau PNG." }, { status: 415 });
  }

  if (!adaPenyediaAI()) {
    return Response.json({ mode: "mock", result: studioContoh() });
  }

  try {
    const { data, model } = await nilaiFoto(buf, mimeType);
    return Response.json({ mode: "ai", model, result: data });
  } catch (err) {
    if (err instanceof AiError) {
      // Saat kuota penuh, contoh ikut dikirim tapi hanya tampil kalau pengguna memilihnya.
      const extra = err.status === 429 ? { contoh: studioContoh() } : {};
      return Response.json({ error: err.message, ...extra }, { status: err.status });
    }
    console.error(err);
    return Response.json({ error: "Terjadi kesalahan di server." }, { status: 500 });
  }
}
