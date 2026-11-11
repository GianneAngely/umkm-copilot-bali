import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

// Claude adalah penyedia utama. Haiku 5.5 cepat dan murah, cukup untuk teks pemasaran,
// membaca foto produk, dan rencana posting.
export const MODEL_CLAUDE = "claude-haiku-5-5";
const BATAS_MS = 20000;

// Panggil Claude dengan structured output (skema zod yang sama dengan jalur Gemini).
// gambar opsional: { mimeType, base64 }. Mengembalikan { data, model }; melempar galat apa pun
// supaya pemanggil bisa pindah ke cadangan.
export async function mintaJsonClaude({ sistem, teks, gambar, schema }) {
  const client = new Anthropic({ timeout: BATAS_MS, maxRetries: 1 });
  const content = gambar
    ? [
        { type: "image", source: { type: "base64", media_type: gambar.mimeType, data: gambar.base64 } },
        { type: "text", text: teks },
      ]
    : teks;

  const response = await client.messages.parse({
    model: MODEL_CLAUDE,
    max_tokens: 8000,
    system: sistem,
    messages: [{ role: "user", content }],
    // Tugas pendek dan sering dipanggil: effort rendah supaya cepat.
    output_config: { effort: "low", format: zodOutputFormat(schema) },
  });

  if (response.stop_reason === "refusal") {
    throw new Error(`Claude menolak permintaan (${response.stop_details?.category ?? "tanpa kategori"})`);
  }
  if (!response.parsed_output) {
    throw new Error(`Jawaban Claude tidak sesuai skema (stop_reason: ${response.stop_reason})`);
  }
  return { data: response.parsed_output, model: MODEL_CLAUDE };
}
