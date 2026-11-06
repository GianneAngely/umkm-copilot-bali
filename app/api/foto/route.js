import { AiError } from "@/lib/gemini";
import { UKURAN_MAKS, bacaFoto, fotoContoh, jenisGambar } from "@/lib/foto";

export const maxDuration = 30;

// Menerima foto produk sebagai multipart (field "foto") atau JSON { gambar: "data:image/...;base64,..." }.
export async function POST(request) {
  let buf;
  try {
    const type = request.headers.get("content-type") || "";
    if (type.includes("multipart/form-data")) {
      const file = (await request.formData()).get("foto");
      if (!file || typeof file === "string") throw new Error("tanpa foto");
      buf = Buffer.from(await file.arrayBuffer());
    } else {
      const { gambar } = await request.json();
      const base64 = String(gambar || "").replace(/^data:[^;]+;base64,/, "");
      buf = Buffer.from(base64, "base64");
    }
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

  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ mode: "mock", result: fotoContoh() });
  }

  try {
    const { data, model } = await bacaFoto(buf, mimeType);
    return Response.json({ mode: "ai", model, result: data });
  } catch (err) {
    if (err instanceof AiError) {
      // Saat kuota penuh, contoh ikut dikirim tapi hanya tampil kalau pengguna memilihnya.
      const extra = err.status === 429 ? { contoh: fotoContoh() } : {};
      return Response.json({ error: err.message, ...extra }, { status: err.status });
    }
    console.error(err);
    return Response.json({ error: "Terjadi kesalahan di server." }, { status: 500 });
  }
}
