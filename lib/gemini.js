import { ApiError, GoogleGenAI, ThinkingLevel } from "@google/genai";
import { z } from "zod";

// Model utama lalu cadangan. Kalau satu model sibuk (503/429) atau lambat, coba berikutnya.
export const MODEL_RANTAI = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.7-flash"];
const BATAS_TOTAL_MS = 25000;
// Model yang macet tidak boleh menghabiskan semua waktu; model terakhir boleh memakai sisanya.
const BATAS_PER_PANGGILAN_MS = 9000;
const JEDA_ULANG_MS = 600;

// Galat yang pesannya aman ditampilkan ke pengguna.
export class AiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const tidur = (ms) => new Promise((ok) => setTimeout(ok, ms));

function sibuk(err) {
  return err instanceof ApiError && (err.status === 503 || /UNAVAILABLE/.test(err.message));
}

function waktuHabis(err) {
  return err?.name === "AbortError" || err?.name === "TimeoutError";
}

// Panggil Gemini dengan keluaran JSON terstruktur, dipakai generate, foto, dan kalender.
// Mengembalikan { data, model } dengan model yang benar-benar menjawab.
export async function mintaJsonGemini({ contents, systemInstruction, schema }) {
  const { $schema, ...jsonSchema } = z.toJSONSchema(schema);
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const mulai = Date.now();
  const sisa = () => BATAS_TOTAL_MS - (Date.now() - mulai);
  let kuotaHabis = false;

  for (const [i, model] of MODEL_RANTAI.entries()) {
    const terakhir = i === MODEL_RANTAI.length - 1;
    // Paling banyak dua percobaan per model: sekali, lalu satu ulangan singkat kalau sibuk.
    for (let percobaan = 0; percobaan < 2; percobaan++) {
      if (sisa() < 1500) break;
      let response;
      try {
        response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseJsonSchema: jsonSchema,
            // Teks pemasaran tidak butuh penalaran panjang; LOW membuat jawaban jauh lebih cepat.
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            abortSignal: AbortSignal.timeout(terakhir ? sisa() : Math.min(sisa(), BATAS_PER_PANGGILAN_MS)),
          },
        });
      } catch (err) {
        // Kuota tiap model terpisah: kalau satu habis, langsung pindah tanpa mengulang.
        if (err instanceof ApiError && err.status === 429) {
          kuotaHabis = true;
          console.warn(`Gemini ${model} kuota habis (429)`);
          break;
        }
        if (sibuk(err)) {
          console.warn(`Gemini ${model} sibuk (${err.status}), percobaan ${percobaan + 1}`);
          if (percobaan === 0 && sisa() > JEDA_ULANG_MS + 1500) {
            await tidur(JEDA_ULANG_MS);
            continue;
          }
          break;
        }
        if (waktuHabis(err)) {
          console.warn(`Gemini ${model} terlalu lama, pindah ke model berikutnya`);
          break;
        }
        if (err instanceof ApiError && err.status === 404) {
          console.warn(`Gemini ${model} tidak tersedia (404)`);
          break;
        }
        console.error(err);
        if (err instanceof ApiError && [400, 401, 403].includes(err.status)) {
          throw new AiError("API key Gemini di server tidak valid atau tidak punya akses ke model ini.", 502);
        }
        throw new AiError("Gagal menghubungi Gemini. Coba lagi sebentar lagi.", 502);
      }

      let data = null;
      try {
        data = JSON.parse(response.text ?? "");
      } catch {}
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        console.error(`Respons ${model} tidak sesuai skema:`, response.text);
        throw new AiError("Jawaban AI tidak lengkap. Silakan coba sekali lagi.", 502);
      }
      return { data: parsed.data, model };
    }
  }

  throw kuotaHabis
    ? new AiError("Kuota gratis Gemini sedang habis. Coba lagi beberapa menit lagi.", 429)
    : new AiError("Layanan AI sedang ramai. Tunggu sebentar, lalu coba lagi.", 503);
}
