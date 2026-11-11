import { z } from "zod";
import { mintaJsonAI } from "@/lib/ai";

// Sama dengan daftar kategori di form dan di app/api/generate/route.js.
export const KATEGORI = ["Kuliner", "Kerajinan", "Fashion", "Oleh-oleh", "Lainnya"];
export const UKURAN_MAKS = 4 * 1024 * 1024;

const FotoSchema = z.object({
  nama: z.string(),
  kategori: z.enum(KATEGORI),
  keunggulan: z.string(),
  catatan_ketidakpastian: z.string(),
});

const SYSTEM = `Kamu membantu pelaku UMKM di Bali mengisi data produk dari foto.
Tulis hanya hal yang benar-benar terlihat di foto. Jangan menebak merek, asal daerah, bahan yang tidak tampak, rasa, harga, sertifikat, atau klaim kesehatan.

Isi setiap bagian dalam Bahasa Indonesia:
- nama: nama produk yang umum dan deskriptif berdasarkan yang terlihat (misalnya "Keripik Pisang", "Tas Anyaman Ate"). Kalau ada nama yang tertulis jelas di kemasan, boleh dipakai. Kalau tidak bisa dikenali, isi string kosong.
- kategori: pilih satu yang paling cocok. Kalau ragu, pilih "Lainnya".
- keunggulan: 1-2 kalimat berisi ciri yang tampak (bentuk, warna, kemasan, tekstur, motif). Kalau tidak ada yang bisa disebut, isi string kosong.
- catatan_ketidakpastian: sebutkan bagian yang ragu atau tidak terlihat jelas, misalnya foto buram atau produk tertutup. Kalau tidak ada keraguan, isi string kosong.
Kalau foto tidak berisi produk sama sekali, kosongkan nama dan keunggulan, pilih "Lainnya", dan jelaskan di catatan_ketidakpastian.`;

// Cek tanda tangan berkas, bukan cuma tipe yang dikirim browser.
export function jenisGambar(buf) {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "image/png";
  }
  return null;
}

// Mengembalikan { data, model }.
export async function bacaFoto(buf, mimeType) {
  return mintaJsonAI({
    sistem: SYSTEM,
    schema: FotoSchema,
    gambar: { mimeType, base64: buf.toString("base64") },
    teks: "Isi data produk dari foto ini.",
  });
}

// Hasil statis saat tidak ada API key AI. Foto tidak dianalisis sama sekali.
export function fotoContoh() {
  return {
    nama: "Keripik Pisang (contoh)",
    kategori: "Oleh-oleh",
    keunggulan: "Irisan tipis berwarna kuning keemasan, dikemas dalam plastik bening dengan label kertas.",
    catatan_ketidakpastian:
      "Ini hasil contoh. API key belum dipasang, jadi foto Anda belum dibaca oleh AI.",
  };
}
