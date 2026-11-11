import { mintaJsonClaude } from "@/lib/claude";
import { AiError, mintaJsonGemini } from "@/lib/gemini";

export { AiError };

// Ada penyedia AI yang bisa dipanggil; kalau tidak ada sama sekali, route memakai mode contoh.
export function adaPenyediaAI() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY);
}

// Satu pintu untuk generate, foto, dan kalender: Claude dulu, lalu rantai Gemini sebagai cadangan
// kalau Claude galat atau ANTHROPIC_API_KEY kosong. Mengembalikan { data, model }.
export async function mintaJsonAI({ sistem, teks, gambar, schema }) {
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      return await mintaJsonClaude({ sistem, teks, gambar, schema });
    } catch (err) {
      console.warn(`Claude gagal, pindah ke Gemini: ${err.status ?? ""} ${err.message}`);
      if (!process.env.GEMINI_API_KEY) {
        throw new AiError("Layanan AI sedang bermasalah. Tunggu sebentar, lalu coba lagi.", 503);
      }
    }
  }

  const contents = gambar
    ? [{ role: "user", parts: [{ inlineData: { mimeType: gambar.mimeType, data: gambar.base64 } }, { text: teks }] }]
    : teks;
  return mintaJsonGemini({ contents, systemInstruction: sistem, schema });
}
