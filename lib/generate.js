import { z } from "zod";
import { mintaJsonAI } from "@/lib/ai";

export { AiError } from "@/lib/gemini";

const ResultSchema = z.object({
  deskripsi_singkat: z.string(),
  deskripsi_cerita: z.string(),
  caption: z.string(),
  hashtags: z.array(z.string()),
  harga: z.object({
    min: z.number(),
    max: z.number(),
    alasan: z.string(),
  }),
  english: z.object({
    description: z.string(),
    caption: z.string(),
  }),
});

const SYSTEM = `Kamu membantu pelaku UMKM di Bali menyiapkan materi pemasaran digital.
Tulis dalam Bahasa Indonesia yang wajar dan hangat, seperti penjual lokal yang paham produknya. Hindari klaim berlebihan dan kata-kata superlatif yang tidak bisa dibuktikan. Jangan mengarang fakta di luar data yang diberikan (misalnya sertifikat, penghargaan, atau lokasi toko).

Isi setiap bagian:
- deskripsi_singkat: 2-3 kalimat untuk marketplace.
- deskripsi_cerita: satu paragraf 4-6 kalimat bergaya cerita (asal-usul, cara buat, suasana Bali) tanpa mengarang detail spesifik yang tidak ada di data.
- caption: caption siap posting Instagram/WhatsApp, boleh 1-3 emoji, ada ajakan membeli. Tanpa hashtag di dalamnya.
- hashtags: 8-12 hashtag relevan, campuran umum dan khas Bali, diawali #.
- harga: rentang harga jual dalam Rupiah (angka bulat, tanpa titik). Kalau harga modal ada, hitung dari situ dengan margin yang masuk akal untuk kategorinya. Alasan cukup 1-2 kalimat.
- english: deskripsi dan caption dalam Bahasa Inggris untuk wisatawan asing, bukan terjemahan kata per kata.`;

function formatRupiah(n) {
  return "Rp" + Math.round(n).toLocaleString("id-ID");
}

export function buildPrompt(input) {
  const lines = [
    `Nama produk: ${input.nama}`,
    `Kategori: ${input.kategori}`,
    `Bahan/keunggulan: ${input.keunggulan || "-"}`,
    `Harga modal per unit: ${input.modal ? formatRupiah(input.modal) : "tidak diisi"}`,
    `Target pasar: ${input.target === "turis" ? "wisatawan (domestik dan asing)" : "pembeli lokal"}`,
  ];
  return lines.join("\n");
}

// Mengembalikan { data, model }.
export async function generateWithAI(input) {
  return mintaJsonAI({ teks: buildPrompt(input), sistem: SYSTEM, schema: ResultSchema });
}

function roundTo(n, step) {
  return Math.round(n / step) * step;
}

// Contoh hasil statis untuk demo tanpa API key. Nama dan data produk diselipkan
// supaya hasilnya tetap terasa nyambung dengan isian form.
export function generateMock(input) {
  const nama = input.nama;
  const kategori = input.kategori.toLowerCase();
  const unggul = input.keunggulan || "dibuat dengan bahan pilihan oleh perajin setempat";
  const turis = input.target === "turis";
  const kategoriEn = {
    Kuliner: "food product",
    Kerajinan: "handicraft",
    Fashion: "fashion item",
    "Oleh-oleh": "souvenir",
  }[input.kategori] || "product";

  let min = 35000;
  let max = 50000;
  let alasan =
    "Harga modal belum diisi, jadi rentang ini mengikuti harga produk sejenis di marketplace dan toko oleh-oleh di Bali.";
  if (input.modal) {
    const kali = turis ? [1.8, 2.3] : [1.4, 1.7];
    min = roundTo(input.modal * kali[0], 1000);
    max = roundTo(input.modal * kali[1], 1000);
    alasan = turis
      ? `Dengan modal ${formatRupiah(input.modal)}, margin 80-130% masih wajar untuk pasar wisatawan yang biasanya membeli di toko oleh-oleh atau area wisata.`
      : `Dengan modal ${formatRupiah(input.modal)}, margin 40-70% memberi ruang untuk diskon atau ongkir tanpa membuat harga terasa mahal bagi pembeli lokal.`;
  }

  return {
    deskripsi_singkat: `${nama} adalah ${kategori} khas Bali yang ${unggul}. Cocok untuk dinikmati sendiri maupun dijadikan oleh-oleh.`,
    deskripsi_cerita: `Di sebuah tempat kerja kecil di Bali, ${nama} dibuat sedikit demi sedikit setiap harinya. Prosesnya tidak terburu-buru, karena kami ingin setiap orang yang mencobanya merasakan hal yang sama seperti keluarga kami dulu. ${unggul.charAt(0).toUpperCase() + unggul.slice(1)}. Dari tangan perajin lokal, ${nama} kini bisa sampai ke rumah Anda, membawa sedikit suasana Pulau Dewata.`,
    caption: `Lagi cari ${kategori} yang beda dari biasanya? ${nama} jawabannya 🌿\n\n${unggul.charAt(0).toUpperCase() + unggul.slice(1)}. Stok terbatas tiap minggu, jadi jangan sampai kehabisan ya.\n\nPesan sekarang lewat DM atau WhatsApp 🙏`,
    hashtags: [
      "#UMKMBali",
      "#ProdukLokalBali",
      "#OlehOlehBali",
      "#BanggaBuatanIndonesia",
      "#BaliLocalBrand",
      "#KulinerBali",
      "#SupportLocalBali",
      "#Denpasar",
      turis ? "#BaliTrip" : "#BaliHits",
      "#" + nama.replace(/[^a-zA-Z0-9]/g, ""),
    ],
    harga: { min, max, alasan },
    english: {
      description: `${nama} is a small-batch ${kategoriEn} from Bali, made by local makers. A simple, honest product that makes a good souvenir to bring home.`,
      caption: `Taking a piece of Bali home? Try ${nama} 🌴 Made in small batches by local makers. Send us a DM to order.`,
    },
  };
}
