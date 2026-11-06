import { ApiError, GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { AiError, MODEL } from "@/lib/generate";

// Satu pintu untuk panggilan Gemini dengan keluaran JSON terstruktur,
// dipakai fitur foto dan kalender. Galat diterjemahkan ke AiError.
export async function mintaJsonGemini({ contents, systemInstruction, schema }) {
  const { $schema, ...jsonSchema } = z.toJSONSchema(schema);
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  let response;
  try {
    response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseJsonSchema: jsonSchema,
      },
    });
  } catch (err) {
    console.error(err);
    if (err instanceof ApiError && err.status === 429) {
      throw new AiError("Kuota gratis Gemini sedang habis. Coba lagi beberapa menit lagi.", 429);
    }
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
    console.error("Respons Gemini tidak sesuai skema:", response.text);
    throw new AiError("Jawaban AI tidak lengkap. Silakan coba sekali lagi.", 502);
  }
  return parsed.data;
}
