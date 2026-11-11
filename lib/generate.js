import { z } from "zod";
import { mintaJsonAI } from "@/lib/ai";
import { ATURAN_FAKTA, mintaTanpaKlaim } from "@/lib/klaim";

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
Tulis dalam Bahasa Indonesia yang wajar dan hangat, seperti penjual lokal yang jujur tentang produknya.

${ATURAN_FAKTA}

Isi setiap bagian:
- deskripsi_singkat: 2-3 kalimat untuk marketplace, berisi fakta dari isian.
- deskripsi_cerita: 2-5 kalimat bergaya cerita dari sudut pembeli: kapan dan untuk apa produk ini dipakai atau dinikmati, memakai fakta dari isian. Bukan asal-usul, sejarah, atau cara membuat. Kalau faktanya sedikit, tulis lebih pendek.
- caption: caption siap posting Instagram/WhatsApp, boleh 1-3 emoji, ada ajakan memesan tanpa kelangkaan atau promo. Tanpa hashtag di dalamnya.
- hashtags: 8-12 hashtag relevan, campuran umum dan khas Bali, diawali #, tanpa kata klaim.
- harga: rentang harga jual dalam Rupiah (angka bulat, tanpa titik). Kalau harga modal ada, hitung dari situ dengan margin yang masuk akal untuk kategorinya. Alasan cukup 1-2 kalimat dan hanya menyebut modal, margin, dan target pasar.
- english: deskripsi dan caption dalam Bahasa Inggris untuk wisatawan asing, bukan terjemahan kata per kata, dengan aturan fakta yang sama.`;

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
// Kalau hasil memuat klaim kosong, server meminta ulang sekali (lib/klaim.js).
export async function generateWithAI(input) {
  return mintaTanpaKlaim({
    nama: input.nama,
    minta: (koreksi) => mintaJsonAI({ teks: buildPrompt(input) + koreksi, sistem: SYSTEM, schema: ResultSchema }),
    ambil: (r) => ({
      teks: [r.deskripsi_singkat, r.deskripsi_cerita, r.caption, r.harga.alasan, r.english.description, r.english.caption].join("\n"),
      tagar: r.hashtags,
    }),
  });
}

function roundTo(n, step) {
  return Math.round(n / step) * step;
}

// Contoh hasil statis untuk demo tanpa API key. Nama dan data produk diselipkan
// supaya hasilnya tetap terasa nyambung dengan isian form.
export function generateMock(input) {
  const nama = input.nama;
  const kategori = input.kategori.toLowerCase();
  const unggul = input.keunggulan || "[isi sendiri: keunggulan produk]";
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
    deskripsi_singkat: `${nama}, ${kategori} dari Bali: ${unggul}.`,
    deskripsi_cerita: `${nama} pas untuk ${turis ? "dibawa pulang sebagai oleh-oleh dari Bali" : "teman di rumah atau buah tangan saat berkunjung"}. ${unggul.charAt(0).toUpperCase() + unggul.slice(1)}.`,
    caption: `${nama} 🌿\n\n${unggul.charAt(0).toUpperCase() + unggul.slice(1)}.\n\nPesan lewat DM atau WhatsApp 🙏`,
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
      description: `${nama} is a ${kategoriEn} from Bali.`,
      caption: `Taking a piece of Bali home? Try ${nama} 🌴 Send us a DM to order.`,
    },
  };
}
