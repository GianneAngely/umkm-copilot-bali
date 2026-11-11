import { z } from "zod";
import { mintaJsonAI } from "@/lib/ai";

const StudioSchema = z.object({
  nilai: z.number(),
  masalah: z.array(z.string()),
  perbaikan: z.object({
    crop: z.object({ x: z.number(), y: z.number(), w: z.number(), h: z.number() }),
    kecerahan: z.number(),
    kontras: z.number(),
    saturasi: z.number(),
    kehangatan: z.number(),
    rotasi: z.number(),
  }),
  tips_foto_ulang: z.array(z.string()),
});

const SYSTEM = `Kamu membantu pelaku UMKM di Bali merapikan foto produk yang diambil dengan HP.
Nilai hanya kualitas teknis foto: komposisi, posisi produk, kemiringan, cahaya, warna, dan latar. Jangan menebak atau menyebut merek, bahan, rasa, harga, atau isi produk yang tidak terlihat.

Isi dalam Bahasa Indonesia yang singkat:
- nilai: angka bulat 1-10 untuk kelayakan foto sebagai foto katalog.
- masalah: paling banyak 3 masalah utama, masing-masing satu frasa pendek. Kosongkan kalau foto sudah baik.
- perbaikan: pengaturan yang akan diterapkan otomatis ke foto asli.
  - crop: kotak potong dalam koordinat relatif 0-1 terhadap foto asli (x, y = pojok kiri atas; w, h = lebar dan tinggi). Pilih kotak yang membuat produk utama berada di tengah dengan ruang kosong secukupnya di sekelilingnya, dan buang bagian yang mengganggu di tepi. Jangan memotong bagian produk. Kalau komposisi sudah pas, pakai x=0, y=0, w=1, h=1.
  - kecerahan, kontras, saturasi, kehangatan: angka kecil antara -0.3 dan 0.3 (0 berarti tidak diubah; positif berarti lebih terang, lebih kontras, lebih berwarna, lebih hangat). Pakai perubahan halus; foto yang sudah bagus cukup diberi angka mendekati 0.
  - rotasi: derajat antara -10 dan 10 untuk meluruskan garis meja atau produk yang miring; 0 kalau sudah lurus.
- tips_foto_ulang: paling banyak 3 tips praktis untuk memotret ulang dengan HP, misalnya soal cahaya jendela, latar polos, atau sudut kamera.`;

const batas = (n, min, max) => Math.min(max, Math.max(min, Number.isFinite(n) ? n : 0));

// Nilai dari AI dijepit supaya hasil di kanvas tidak pernah aneh.
export function rapikanSaran(d) {
  const p = d.perbaikan || {};
  const c = p.crop || {};
  const w = batas(c.w, 0.4, 1);
  const h = batas(c.h, 0.4, 1);
  return {
    nilai: Math.round(batas(d.nilai, 1, 10)),
    masalah: (d.masalah || []).map(String).filter(Boolean).slice(0, 3),
    perbaikan: {
      crop: { x: batas(c.x, 0, 1 - w), y: batas(c.y, 0, 1 - h), w, h },
      kecerahan: batas(p.kecerahan, -0.3, 0.3),
      kontras: batas(p.kontras, -0.3, 0.3),
      saturasi: batas(p.saturasi, -0.3, 0.3),
      kehangatan: batas(p.kehangatan, -0.3, 0.3),
      rotasi: batas(p.rotasi, -10, 10),
    },
    tips_foto_ulang: (d.tips_foto_ulang || []).map(String).filter(Boolean).slice(0, 3),
  };
}

// Mengembalikan { data, model } dengan saran yang sudah dijepit.
export async function nilaiFoto(buf, mimeType) {
  const { data, model } = await mintaJsonAI({
    sistem: SYSTEM,
    schema: StudioSchema,
    gambar: { mimeType, base64: buf.toString("base64") },
    teks: "Nilai foto produk ini dan beri pengaturan perbaikannya.",
  });
  return { data: rapikanSaran(data), model };
}

// Saran statis saat tidak ada API key AI: perbaikan ringan yang aman untuk foto apa pun.
export function studioContoh() {
  return {
    nilai: 6,
    masalah: ["Contoh: foto belum dinilai AI"],
    perbaikan: {
      crop: { x: 0.04, y: 0.04, w: 0.92, h: 0.92 },
      kecerahan: 0.08,
      kontras: 0.06,
      saturasi: 0.05,
      kehangatan: 0.04,
      rotasi: 0,
    },
    tips_foto_ulang: [
      "Potret di dekat jendela pada pagi atau sore hari.",
      "Pakai latar polos, misalnya kain atau kertas warna terang.",
      "Pegang HP sejajar produk dan jangan memakai zoom digital.",
    ],
  };
}
