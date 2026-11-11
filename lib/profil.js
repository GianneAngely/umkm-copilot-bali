import { z } from "zod";
import { mintaJsonAI } from "@/lib/ai";

// Batas dari Instagram.
export const BATAS_BIO = 150;
const BATAS_NAMA = 30;
const BATAS_USERNAME = 30;
const BATAS_SOROTAN = 15;

const ProfilSchema = z.object({
  nama_profil: z.string(),
  saran_username: z.array(z.string()),
  bio: z.array(z.object({ judul: z.string(), teks: z.string() })),
  kategori_akun: z.string(),
  sorotan: z.array(z.object({ nama: z.string(), ikon: z.string() })),
  postingan_pertama: z.array(z.object({ judul: z.string(), ide: z.string() })),
});

const SYSTEM = `Kamu membantu pelaku UMKM di Bali menyiapkan profil Instagram toko.
Tulis dalam Bahasa Indonesia yang wajar dan hangat. Hindari superlatif dan klaim yang tidak bisa dibuktikan.

Aturan paling penting: jangan mengarang alamat, nomor telepon atau WhatsApp, harga, jam buka, penghargaan, sertifikat, atau jumlah pelanggan. Pakai hanya data yang diberikan. Kalau bio butuh info yang tidak ada (misalnya nomor WA), tulis [isi sendiri].

Isi:
- nama_profil: nama yang tampil tebal di profil, paling panjang 30 karakter. Boleh nama toko ditambah kata kunci produk, misalnya "Bu Made · Pie Susu Bali".
- saran_username: 3 username, huruf kecil, hanya huruf, angka, titik, dan garis bawah, tanpa spasi, paling panjang 30 karakter.
- bio: 3 versi, MASING-MASING PALING PANJANG 150 KARAKTER termasuk spasi, emoji, dan baris baru. Tiap versi menyebut keunggulan dari isian dan cara memesan lewat DM/WA, dengan emoji secukupnya. Versi pertama singkat dan rapi, versi kedua lebih hangat, versi ketiga dwibahasa Indonesia dan Inggris untuk wisatawan. Judul tiap versi 1-3 kata.
- kategori_akun: satu kategori akun bisnis Instagram yang cocok, misalnya "Toko Makanan", "Kerajinan Tangan", "Toko Pakaian".
- sorotan: 4 sampai 5 nama Story Highlight, masing-masing paling panjang 15 karakter, dengan satu emoji sebagai ikon. Contoh: Menu, Testimoni, Cara Pesan, Lokasi.
- postingan_pertama: 3 ide postingan pertama untuk grid profil; judul pendek dan ide satu kalimat yang bisa langsung dipotret dengan HP.`;

function panjang(s) {
  return String(s).length;
}

// Bio yang lewat 150 karakter dipendekkan: buang baris tengah yang paling panjang dulu
// (baris terakhir biasanya ajakan memesan), lalu potong di batas kata kalau masih lewat.
export function pasBio(teks) {
  let baris = String(teks).trim().split(/\n+/).map((b) => b.trim()).filter(Boolean);
  while (panjang(baris.join("\n")) > BATAS_BIO && baris.length > 2) {
    const tengah = baris.slice(1, -1);
    const terpanjang = tengah.reduce((a, b) => (panjang(b) > panjang(a) ? b : a));
    baris.splice(baris.indexOf(terpanjang), 1);
  }
  let hasil = baris.join("\n");
  if (panjang(hasil) > BATAS_BIO) {
    hasil = hasil.slice(0, BATAS_BIO + 1);
    hasil = hasil.slice(0, Math.max(hasil.lastIndexOf(" "), BATAS_BIO - 20)).trim();
  }
  return hasil;
}

function bersihkanUsername(u) {
  return String(u)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9._]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, BATAS_USERNAME)
    .replace(/\.+$/, "");
}

const SOROTAN_UMUM = [
  { nama: "Produk", ikon: "🛍️" },
  { nama: "Cara Pesan", ikon: "📩" },
  { nama: "Testimoni", ikon: "💬" },
  { nama: "Lokasi", ikon: "📍" },
];

// 4-5 sorotan, nama paling panjang 15 karakter; kalau AI memberi kurang dari 4, tambah yang umum.
function lengkapiSorotan(daftar = []) {
  const hasil = daftar
    .map((s) => ({ nama: String(s.nama || "").trim().slice(0, BATAS_SOROTAN), ikon: [...String(s.ikon || "").trim()].slice(0, 2).join("") }))
    .filter((s) => s.nama)
    .slice(0, 5);
  for (const u of SOROTAN_UMUM) {
    if (hasil.length >= 4) break;
    if (!hasil.some((s) => s.nama.toLowerCase() === u.nama.toLowerCase())) hasil.push(u);
  }
  return hasil;
}

// Semua batas Instagram ditegakkan di server, apa pun jawaban AI.
export function rapikanProfil(d, cadanganNama) {
  const dasar = bersihkanUsername(cadanganNama).replace(/\./g, "_") || "toko_bali";
  const username = [...new Set([...(d.saran_username || []).map(bersihkanUsername), dasar, `${dasar}.bali`, `${dasar}_official`])]
    .filter((u) => u.length >= 3)
    .slice(0, 3);
  return {
    nama_profil: String(d.nama_profil || cadanganNama).trim().slice(0, BATAS_NAMA),
    saran_username: username,
    bio: (d.bio || []).slice(0, 3).map((b, i) => ({
      judul: String(b.judul || `Versi ${i + 1}`).slice(0, 30),
      teks: pasBio(b.teks),
    })),
    kategori_akun: String(d.kategori_akun || "").trim().slice(0, 40),
    sorotan: lengkapiSorotan(d.sorotan),
    postingan_pertama: (d.postingan_pertama || []).slice(0, 3),
  };
}

function buatPrompt({ produk, toko }) {
  return [
    `Nama toko: ${toko.nama || `(tidak diisi, pakai nama produk: ${produk.nama})`}`,
    `Kota/daerah: ${toko.kota || "tidak diisi"}`,
    `Produk utama: ${produk.nama}`,
    `Kategori: ${produk.kategori}`,
    `Bahan/keunggulan: ${produk.keunggulan || "-"}`,
    `Target pasar: ${produk.target === "turis" ? "wisatawan (domestik dan asing)" : "pembeli lokal"}`,
  ].join("\n");
}

// Mengembalikan { data, model }.
export async function buatProfil(input) {
  const { data, model } = await mintaJsonAI({ sistem: SYSTEM, schema: ProfilSchema, teks: buatPrompt(input) });
  return { data: rapikanProfil(data, input.toko.nama || input.produk.nama), model };
}

// Profil statis saat tidak ada API key AI.
export function profilContoh({ produk, toko }) {
  const nama = toko.nama || produk.nama;
  const kota = toko.kota || "Bali";
  const unggul = produk.keunggulan ? produk.keunggulan.split(/[,.;]/)[0].trim() : "[isi sendiri: keunggulan]";
  return rapikanProfil(
    {
      nama_profil: nama,
      saran_username: [nama, `${nama}.${kota}`, `${nama}_id`],
      bio: [
        { judul: "Singkat", teks: `${produk.nama} dari ${kota} 🌿\n${unggul}\n📩 Pesan via DM/WA [isi sendiri]` },
        { judul: "Hangat", teks: `Salam dari ${kota} 🙏\n${produk.nama}, ${unggul}\n💬 Tanya dan pesan lewat DM/WA [isi sendiri]` },
        { judul: "Bilingual", teks: `${produk.nama} · ${kota} 🌴\n${toko.kota ? `From ${toko.kota}, Bali` : "From Bali"}\n📩 DM/WA to order · Pesan via DM/WA [isi sendiri]` },
      ],
      kategori_akun: { Kuliner: "Toko Makanan", "Oleh-oleh": "Toko Makanan", Kerajinan: "Kerajinan Tangan", Fashion: "Toko Pakaian" }[produk.kategori] || "Toko",
      sorotan: [
        { nama: "Produk", ikon: "🛍️" },
        { nama: "Cara Pesan", ikon: "📩" },
        { nama: "Testimoni", ikon: "💬" },
        { nama: "Lokasi", ikon: "📍" },
      ],
      postingan_pertama: [
        { judul: "Kenalan", ide: `Foto ${produk.nama} di atas latar polos dengan cerita singkat tentang toko Anda.` },
        { judul: "Proses", ide: "Video pendek tangan yang sedang membuat atau mengemas produk." },
        { judul: "Cara pesan", ide: "Satu gambar berisi langkah memesan lewat DM atau WhatsApp." },
      ],
    },
    nama,
  );
}
