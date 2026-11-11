import { z } from "zod";
import { mintaJsonAI } from "@/lib/ai";
import { ATURAN_FAKTA, mintaTanpaKlaim } from "@/lib/klaim";

// Lima pertanyaan pembeli yang paling sering masuk lewat WhatsApp.
export const JENIS = [
  { id: "harga", label: "Tanya harga" },
  { id: "stok", label: "Tanya stok" },
  { id: "cara_pesan", label: "Cara pesan" },
  { id: "ongkir", label: "Ongkir dan pengiriman" },
  { id: "turis_en", label: "Turis (English)" },
];

const Kartu = z.object({ pertanyaan: z.string(), balasan: z.string() });
const BalasanSchema = z.object(Object.fromEntries(JENIS.map((j) => [j.id, Kartu])));

const SYSTEM = `Kamu membantu pelaku UMKM di Bali menyiapkan template balasan WhatsApp untuk pertanyaan pembeli.
Tulis seperti penjual lokal yang ramah dan sopan: sapa dengan "Kak", kalimat pendek, paling banyak satu emoji per balasan. Hindari klaim berlebihan dan superlatif.

${ATURAN_FAKTA}

Aturan paling penting: jangan mengarang informasi yang tidak ada di data. Ongkos kirim, alamat toko, nomor rekening, nomor WhatsApp, jam buka, jumlah stok, kurir, dan lama pengiriman TIDAK pernah diberikan, jadi tulis placeholder dalam kurung siku, misalnya [isi sendiri: ongkir ke kota tujuan] atau [isi sendiri: nomor rekening]. Untuk harga, pakai hanya rentang harga yang diberikan; kalau tidak ada, pakai [isi sendiri: harga]. Jangan menyebut varian, ukuran, isi atau satuan kemasan (kotak, pcs, toples), dan jangan bilang stok masih ada atau habis, kecuali semua itu tertulis di data. Status stok selalu memakai placeholder.

Untuk setiap jenis, isi:
- pertanyaan: contoh pertanyaan singkat dari pembeli, seperti yang biasa diketik di WhatsApp.
- balasan: template balasan siap salin, 2-4 kalimat.

Jenis:
- harga: pembeli menanyakan harga.
- stok: pembeli menanyakan apakah barang masih ada.
- cara_pesan: pembeli menanyakan cara memesan dan membayar.
- ongkir: pembeli menanyakan ongkos kirim dan pengiriman.
- turis_en: wisatawan asing bertanya dalam Bahasa Inggris (harga atau cara membeli); pertanyaan dan balasan dalam Bahasa Inggris yang natural, tanpa sapaan "Kak", dan placeholder ditulis [fill in: ...].`;

function rupiah(n) {
  return "Rp" + Math.round(n).toLocaleString("id-ID");
}

export function teksHarga(harga) {
  if (!harga?.min || !harga?.max) return "";
  return harga.min === harga.max ? rupiah(harga.min) : `${rupiah(harga.min)} sampai ${rupiah(harga.max)}`;
}

function hargaInggris(harga) {
  if (!harga?.min || !harga?.max) return "";
  const f = (n) => "Rp" + Math.round(n).toLocaleString("en-US");
  return harga.min === harga.max ? f(harga.min) : `${f(harga.min)} to ${f(harga.max)}`;
}

function buatPrompt({ produk, ringkasan, harga }) {
  return [
    `Nama produk: ${produk.nama}`,
    `Kategori: ${produk.kategori}`,
    `Bahan/keunggulan: ${produk.keunggulan || "-"}`,
    `Target pasar: ${produk.target === "turis" ? "wisatawan (domestik dan asing)" : "pembeli lokal"}`,
    `Ringkasan produk: ${String(ringkasan || "").replace(/\[isi sendiri[^\]]*\]/g, "").trim() || "-"}`,
    `Rentang harga jual: ${teksHarga(harga) || "tidak diisi"}`,
  ].join("\n");
}

// Mengembalikan { balasan: [{ id, label, pertanyaan, balasan }], model }.
export async function buatBalasan(input) {
  const { data, model } = await mintaTanpaKlaim({
    nama: input.produk.nama,
    minta: (koreksi) => mintaJsonAI({ sistem: SYSTEM, schema: BalasanSchema, teks: buatPrompt(input) + koreksi }),
    ambil: (d) => ({ teks: JENIS.map((j) => d[j.id].balasan).join("\n"), tagar: [] }),
  });
  return { balasan: JENIS.map((j) => ({ ...j, ...data[j.id] })), model };
}

// Template statis saat tidak ada API key AI.
export function balasanContoh({ produk, harga }) {
  const h = teksHarga(harga) || "[isi sendiri: harga]";
  const isi = {
    harga: [
      "Kak, ini harganya berapa ya?",
      `Halo Kak, terima kasih sudah bertanya 🙏 Harga ${produk.nama} ${h}. Kalau mau, saya bantu pilihkan.`,
    ],
    stok: [
      "Masih ada stoknya, Kak?",
      `Terima kasih sudah bertanya, Kak. Stok ${produk.nama} saat ini [isi sendiri: status stok]. Mau dipesan berapa?`,
    ],
    cara_pesan: [
      "Gimana cara pesannya?",
      "Gampang, Kak. Kirim nama, alamat lengkap, dan jumlah pesanan lewat chat ini ya. Pembayaran bisa transfer ke [isi sendiri: nomor rekening].",
    ],
    ongkir: [
      "Ongkir ke Surabaya berapa?",
      "Ongkir ke kota Kakak [isi sendiri: ongkir ke kota tujuan], dikirim lewat [isi sendiri: kurir]. Biasanya sampai dalam [isi sendiri: lama pengiriman].",
    ],
    turis_en: [
      "Hi, how much is this and can I buy it today?",
      `Hi, thank you for asking! ${produk.nama} is ${hargaInggris(harga) || "[fill in: price]"}. You can visit us at [fill in: shop address] or order through this chat.`,
    ],
  };
  return { balasan: JENIS.map((j) => ({ ...j, pertanyaan: isi[j.id][0], balasan: isi[j.id][1] })) };
}
