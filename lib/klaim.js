// Daftar klaim kosong yang tidak bisa dibuktikan, dipakai bersama oleh server (cek dan minta ulang)
// dan lembar suntingan di peramban (coretan dan penghitung "klaim ditambahkan").
export const KLAIM = [
  "nomor satu", "no. 1", "no 1", "100%", "pokoknya", "dijamin", "terjamin", "terbaik", "terenak", "terlezat",
  "termurah", "terlaris", "ternikmat", "terpercaya", "paling", "enak", "lezat", "kelezatan", "nikmat", "kenikmatan",
  "murah", "mantap", "mantul", "juara", "sempurna", "istimewa", "premium", "viral", "legendaris", "luar biasa",
  "stok terbatas", "jangan sampai kehabisan", "best", "cheapest", "finest", "number one", "delicious", "tasty",
  "perfect", "amazing", "limited stock", "berkualitas", "bermutu", "kualitas tinggi", "high quality", "high-quality",
];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Akhiran -nya ikut tertangkap (kelezatannya, enaknya).
export const POLA_KLAIM = new RegExp(
  `(?<![\\p{L}\\d])(${KLAIM.map(esc).join("|")})(?:nya)?(?![\\p{L}\\d])`,
  "giu",
);

// Kata klaim (bentuk dasar, huruf kecil) yang muncul di teks.
export function cariKlaim(teks) {
  return [...String(teks || "").matchAll(POLA_KLAIM)].map((m) => m[1].toLowerCase());
}

// Tagar ditulis menyambung (#CamilanEnak), jadi dicek per kata pembentuknya.
export function cariKlaimTagar(tagar = []) {
  return tagar.flatMap((t) =>
    cariKlaim(String(t).replace(/^#/, "").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_\d]+/g, " ")),
  );
}

// Aturan yang disisipkan ke instruksi sistem setiap fitur teks.
export const ATURAN_FAKTA = `Aturan fakta (wajib):
- Semua fakta hanya boleh berasal dari isian pengguna. Jangan menambah asal-usul, sejarah keluarga, cara membuat atau memasak, bahan, lokasi, kelangkaan stok ("stok terbatas", "jangan sampai kehabisan"), promo, diskon, garansi, testimoni, atau angka yang tidak diisi.
- Jangan menggambarkan rasa, tekstur, aroma, kesegaran, karakter rasa (misalnya "seimbang", "kaya", "lembut"), atau kemasan produk kecuali tertulis di isian. Fakta seperti "sangrai sedang" cukup disebut apa adanya tanpa ditafsirkan.
- Jangan memakai kata klaim kosong berikut atau turunannya, termasuk di tagar dan teks bahasa Inggris: ${KLAIM.join(", ")}. Kata seperti itu hanya boleh muncul kalau menjadi bagian dari nama produk.
- Klaim kosong yang ditulis pengguna di isian (misalnya "enak", "murah", "mantap", "pokoknya") jangan diteruskan ke hasil; pakai hanya fakta yang bisa dicek, seperti bahan, daya tahan, atau tanpa pengawet.`;

// Klaim di hasil yang tidak berasal dari nama produk.
export function klaimDiHasil({ teks, tagar, nama }) {
  const dariNama = new Set(cariKlaim(nama));
  return [...new Set([...cariKlaim(teks), ...cariKlaimTagar(tagar)])].filter((k) => !dariNama.has(k));
}

// Minta ke AI, cek klaim di hasil, dan kalau ada, minta ulang SEKALI dengan koreksi yang menyebut katanya.
// minta(koreksi) mengembalikan { data, model }; ambil(data) mengembalikan { teks, tagar }.
// Hasil kedua dikembalikan apa adanya meski masih ada klaim; penghitung di peramban tetap menampilkannya.
export async function mintaTanpaKlaim({ minta, ambil, nama }) {
  const pertama = await minta("");
  const klaim = klaimDiHasil({ ...ambil(pertama.data), nama });
  if (!klaim.length) return pertama;
  console.warn(`Klaim kosong di hasil, minta ulang sekali: ${klaim.join(", ")}`);
  const koreksi = `\n\nKoreksi: jawaban sebelumnya memakai kata klaim kosong: ${klaim.join(", ")}. Tulis ulang seluruh jawaban tanpa kata-kata itu dan tanpa turunannya, dan tanpa menambah fakta yang tidak ada di isian.`;
  try {
    return await minta(koreksi);
  } catch (err) {
    console.warn(`Minta ulang gagal, pakai hasil pertama: ${err.message}`);
    return pertama;
  }
}
