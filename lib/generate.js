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
  Kalau bahan/keunggulan tidak diisi: jangan menulis kalimat tentang data yang belum ada (misalnya "detail akan ditambahkan penjual") dan jangan mengarang sifat produk seperti ukuran, kepraktisan, kemasan atau cara membukanya, rasa, atau tekstur (misalnya "renyah", "crispy"), di semua bagian termasuk versi Inggris. Tulis singkat dari nama, kategori, dan target pasar saja, lalu sisipkan tepat satu penanda [isi sendiri: bahan atau keunggulan] di deskripsi_singkat. Bagian lain, termasuk versi Inggris, tidak memakai penanda.
- deskripsi_cerita: 2-5 kalimat bergaya cerita dari sudut pembeli: kapan dan untuk apa produk ini dipakai atau dinikmati, memakai fakta dari isian. Bukan asal-usul, sejarah, atau cara membuat. Kalau faktanya sedikit, tulis lebih pendek.
- caption: caption siap posting Instagram/WhatsApp, boleh 1-3 emoji, ada ajakan memesan tanpa kelangkaan atau promo. Tanpa hashtag di dalamnya.
- hashtags: 8-12 hashtag relevan, campuran umum dan khas Bali, diawali #, tanpa kata klaim.
- harga: rentang harga jual dalam Rupiah (angka bulat, tanpa titik). Kalau harga modal ada, hitung dari situ dengan margin yang masuk akal untuk kategorinya; harga minimum harus di atas modal. Alasan cukup 1-2 kalimat dan hanya menyebut modal, margin, dan target pasar. Kalau harga modal tidak diisi, isi min 0 dan max 0, dan jangan menebak harga.
- english: deskripsi dan caption dalam Bahasa Inggris untuk wisatawan asing, bukan terjemahan kata per kata, dengan aturan fakta yang sama. Periksa tata bahasa Inggrisnya sebelum menjawab (artikel a/an, bentuk kata kerja, jamak).`;

function formatRupiah(n) {
  return "Rp" + Math.round(n).toLocaleString("id-ID");
}

export function buildPrompt(input) {
  const lines = [
    `Nama produk: ${input.nama}`,
    `Kategori: ${input.kategori}`,
    `Bahan/keunggulan: ${input.keunggulan || "tidak diisi"}`,
    `Harga modal per unit: ${input.modal ? formatRupiah(input.modal) : "tidak diisi"}`,
    `Target pasar: ${input.target === "turis" ? "wisatawan (domestik dan asing)" : "pembeli lokal"}`,
  ];
  return lines.join("\n");
}

export const ALASAN_TANPA_MODAL = "Modal per unit belum diisi, jadi saran harga belum dihitung.";

// Rentang harga dari modal dengan margin per target pasar (dipakai mode contoh dan sebagai pengganti).
function hargaDariModal(modal, turis) {
  const kali = turis ? [1.8, 2.3] : [1.4, 1.7];
  return {
    min: roundTo(modal * kali[0], 1000),
    max: roundTo(modal * kali[1], 1000),
    alasan: turis
      ? `Dengan modal ${formatRupiah(modal)}, margin 80-130% masih wajar untuk pasar wisatawan yang biasanya membeli di toko oleh-oleh atau area wisata.`
      : `Dengan modal ${formatRupiah(modal)}, margin 40-70% memberi ruang untuk ongkir tanpa membuat harga terasa mahal bagi pembeli lokal.`,
  };
}

// Tanpa modal, Wicara tidak menebak harga: min = max = 0 berarti "saran harga belum dihitung".
// Dengan modal, angka model yang tidak masuk akal diganti rumus margin.
function pastikanHarga(harga, input) {
  if (!input.modal) return { min: 0, max: 0, alasan: ALASAN_TANPA_MODAL };
  const { min, max } = harga || {};
  if (!(min > 0) || !(max > 0) || min > max || max < input.modal) return hargaDariModal(input.modal, input.target === "turis");
  return harga;
}

const PENANDA = "[isi sendiri: bahan atau keunggulan]";
const META = /\[(isi sendiri|fill in)[^\]]*\]|akan ditambahkan|belum (diisi|ada|tersedia|ditambahkan)|(still |yet )?to be added|will be added/i;

// Tanpa keunggulan: tepat satu penanda di deskripsi_singkat, dan kalimat yang membicarakan data
// yang belum ada (atau penanda) dibuang dari bagian lain, termasuk versi Inggris.
function rapikanTanpaKeunggulan(r) {
  const buang = (t) => String(t).split(/(?<=[.!?])\s+/).filter((k) => !META.test(k)).join(" ").trim();
  const singkat = buang(r.deskripsi_singkat);
  return {
    ...r,
    deskripsi_singkat: `${singkat} ${PENANDA}`.trim(),
    deskripsi_cerita: buang(r.deskripsi_cerita),
    caption: String(r.caption).split("\n").map(buang).join("\n"),
    english: { description: buang(r.english.description), caption: buang(r.english.caption) },
  };
}

// Mengembalikan { data, model }.
// Kalau hasil memuat klaim kosong, server meminta ulang sekali (lib/klaim.js).
export async function generateWithAI(input) {
  const { data, model } = await mintaTanpaKlaim({
    nama: input.nama,
    minta: (koreksi) => mintaJsonAI({ teks: buildPrompt(input) + koreksi, sistem: SYSTEM, schema: ResultSchema }),
    ambil: (r) => ({
      teks: [r.deskripsi_singkat, r.deskripsi_cerita, r.caption, r.harga.alasan, r.english.description, r.english.caption].join("\n"),
      tagar: r.hashtags,
    }),
  });
  const rapi = input.keunggulan ? data : rapikanTanpaKeunggulan(data);
  return { data: { ...rapi, harga: pastikanHarga(data.harga, input) }, model };
}

function roundTo(n, step) {
  return Math.round(n / step) * step;
}

// Contoh hasil statis untuk demo tanpa API key. Nama dan data produk diselipkan
// supaya hasilnya tetap terasa nyambung dengan isian form.
export function generateMock(input) {
  const nama = input.nama;
  const kategori = input.kategori.toLowerCase();
  const unggul = input.keunggulan;
  const turis = input.target === "turis";
  const kategoriEn = {
    Kuliner: "food product",
    Kerajinan: "handicraft",
    Fashion: "fashion item",
    "Oleh-oleh": "souvenir",
  }[input.kategori] || "product";

  const harga = input.modal ? hargaDariModal(input.modal, turis) : { min: 0, max: 0, alasan: ALASAN_TANPA_MODAL };
  const kalimatUnggul = unggul ? ` ${unggul.charAt(0).toUpperCase() + unggul.slice(1)}.` : "";

  return {
    deskripsi_singkat: `${nama}, ${kategori} dari Bali: ${unggul || "[isi sendiri: bahan atau keunggulan]"}.`,
    deskripsi_cerita: `${nama} pas untuk ${turis ? "dibawa pulang sebagai oleh-oleh dari Bali" : "teman di rumah atau buah tangan saat berkunjung"}.${kalimatUnggul}`,
    caption: `${nama} 🌿\n\n${kalimatUnggul.trim() ? kalimatUnggul.trim() + "\n\n" : ""}Pesan lewat DM atau WhatsApp 🙏`,
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
    harga,
    english: {
      description: `${nama} is a ${kategoriEn} from Bali.`,
      caption: `Taking a piece of Bali home? Try ${nama} 🌴 Send us a DM to order.`,
    },
  };
}
