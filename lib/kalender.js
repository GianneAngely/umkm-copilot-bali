import { z } from "zod";
import { mintaJsonAI } from "@/lib/ai";
import { ATURAN_FAKTA, mintaTanpaKlaim } from "@/lib/klaim";
import { acaraDalamRentang } from "@/lib/hari-raya-bali";

const NAMA_HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const FORMAT = ["feed", "story", "reels"];

const HariSchema = z.object({
  tanggal: z.string(),
  hari: z.string(),
  ide_posting: z.string(),
  format: z.enum(FORMAT),
  caption_singkat: z.string(),
  alasan: z.string(),
});
const KalenderSchema = z.object({ hari: z.array(HariSchema).min(7).max(7) });

const SYSTEM = `Kamu membantu pelaku UMKM di Bali menyusun rencana posting media sosial selama 7 hari.
Tulis dalam Bahasa Indonesia yang wajar. Jangan mengarang fakta produk di luar data yang diberikan.

${ATURAN_FAKTA}
Pakai hari raya dan masa libur yang disebutkan di prompt bila relevan, dengan hormat: untuk hari suci seperti Nyepi, jangan sarankan promosi yang ramai di hari itu, cukup ucapan atau posting dijadwalkan sebelumnya. Jangan menyebut hari raya yang tidak ada di daftar.
Pada hari raya keagamaan, jangan menyarankan sarana upacara (canang, banten, sesajen, pura, atau pelinggih) sebagai alas, properti, atau latar foto produk, dan jangan menyebut produk dipakai untuk upacara atau persembahan kecuali tertulis di data.
Ide, caption, dan alasan tidak boleh memuat sifat produk yang tidak ada di data, termasuk yang bersyarat seperti "bila sesuai" atau "jika ada".

Untuk setiap tanggal yang diberikan, isi:
- tanggal dan hari: salin persis dari daftar.
- ide_posting: satu kalimat ide konten yang konkret.
- format: "feed", "story", atau "reels". Variasikan sepanjang minggu.
- caption_singkat: 1-2 kalimat siap pakai, boleh 1 emoji.
- alasan: satu kalimat kenapa ide ini cocok di hari itu. Sebut nama hari raya atau masa libur bila ada.`;

export function tujuhHari(mulai) {
  const awal = new Date(`${mulai}T00:00:00Z`);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(awal.getTime() + i * 86400000);
    return { tanggal: d.toISOString().slice(0, 10), hari: NAMA_HARI[d.getUTCDay()] };
  });
}

function acaraUntuk(hari) {
  return acaraDalamRentang(hari[0].tanggal, hari[6].tanggal);
}

function teksAcara(a) {
  return a.tanggal ? `${a.tanggal}: ${a.nama}` : `${a.mulai} s.d. ${a.selesai}: ${a.nama}`;
}

export async function buatKalender({ produk, ringkasan, mulai }) {
  const hari = tujuhHari(mulai);
  const acara = acaraUntuk(hari);
  const prompt = [
    `Produk: ${produk.nama} (${produk.kategori})`,
    `Target pasar: ${produk.target === "turis" ? "wisatawan" : "pembeli lokal"}`,
    `Ringkasan produk: ${String(ringkasan || "").replace(/\[isi sendiri[^\]]*\]/g, "").trim() || "-"}`,
    "",
    "Tanggal:",
    ...hari.map((h) => `- ${h.tanggal} (${h.hari})`),
    "",
    "Hari raya dan masa libur di rentang ini:",
    ...(acara.length ? acara.map((a) => `- ${teksAcara(a)}`) : ["- tidak ada"]),
  ].join("\n");

  const { data, model } = await mintaTanpaKlaim({
    nama: produk.nama,
    minta: (koreksi) => mintaJsonAI({ sistem: SYSTEM, schema: KalenderSchema, teks: prompt + koreksi }),
    ambil: (d) => ({ teks: d.hari.map((h) => `${h.ide_posting}\n${h.caption_singkat}\n${h.alasan}`).join("\n"), tagar: [] }),
  });
  // Tanggal dan nama hari selalu dari server, bukan dari model.
  return { hari: data.hari.map((h, i) => ({ ...h, ...hari[i] })), acara, model };
}

// Rencana statis saat tidak ada API key AI. Hari raya tetap diambil dari data asli.
export function kalenderContoh({ produk, mulai }) {
  const hari = tujuhHari(mulai);
  const acara = acaraUntuk(hari);
  const ide = [
    ["Foto produk close-up dengan cahaya pagi", "Mulai minggu ini dengan {nama} yang baru jadi. Siap dipesan hari ini."],
    ["Foto detail produk dari dekat", "Lihat lebih dekat {nama}. Ada pertanyaan? Tulis di komentar."],
    ["Testimoni pembeli (minta izin dulu)", "Terima kasih sudah memilih {nama}. Cerita Anda bikin kami semangat."],
    ["Video 15 detik cara menikmati produk", "Begini cara kami menikmati {nama}. Sudah coba?"],
    ["Foto produk siap dibawa sebagai oleh-oleh", "Mau bawa {nama} untuk keluarga di rumah? Tanya lewat DM ya."],
    ["Kuis atau polling di story", "Mana yang Anda pilih? Jawab di story kami ya."],
    ["Rangkuman minggu dan ajakan pesan", "Terima kasih untuk minggu ini. Pesan {nama} lewat DM atau WhatsApp."],
  ];
  return {
    hari: hari.map((h, i) => {
      const hariRaya = acara.find((a) => a.tanggal === h.tanggal);
      const [ide_posting, caption] = ide[i];
      return {
        ...h,
        ide_posting: hariRaya ? `Ucapan selamat ${hariRaya.nama} dengan foto produk yang sederhana` : ide_posting,
        format: FORMAT[i % 3],
        caption_singkat: hariRaya
          ? `Selamat ${hariRaya.nama} untuk semeton yang merayakan. 🙏`
          : caption.replaceAll("{nama}", produk.nama),
        alasan: hariRaya
          ? `Bertepatan dengan ${hariRaya.nama}, jadi posting ucapan lebih pas daripada promosi.`
          : "Contoh statis: API key belum dipasang, jadi rencana ini belum disusun oleh AI.",
      };
    }),
    acara,
  };
}
