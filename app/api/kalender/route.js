import { AiError } from "@/lib/generate";
import { buatKalender, kalenderContoh } from "@/lib/kalender";

const KATEGORI = ["Kuliner", "Kerajinan", "Fashion", "Oleh-oleh", "Lainnya"];

// Tanggal hari ini di zona WITA, format YYYY-MM-DD.
function hariIniWita() {
  return new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 10);
}

// Body: { produk: { nama, kategori, target }, ringkasan, tanggalMulai: "YYYY-MM-DD" }
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
    target: p.target === "turis" ? "turis" : "lokal",
  };
  if (!produk.nama) {
    return Response.json({ error: "Nama produk wajib diisi." }, { status: 400 });
  }
  const ringkasan = String(body.ringkasan || "").trim().slice(0, 600);
  const mulai = body.tanggalMulai || hariIniWita();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(mulai) || Number.isNaN(Date.parse(`${mulai}T00:00:00Z`))) {
    return Response.json({ error: "Tanggal mulai tidak valid." }, { status: 400 });
  }

  const input = { produk, ringkasan, mulai };
  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ mode: "mock", result: kalenderContoh(input) });
  }

  try {
    return Response.json({ mode: "ai", result: await buatKalender(input) });
  } catch (err) {
    if (err instanceof AiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error(err);
    return Response.json({ error: "Terjadi kesalahan di server." }, { status: 500 });
  }
}
