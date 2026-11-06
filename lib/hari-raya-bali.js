// Hari raya Bali, libur nasional, dan masa ramai liburan, November 2026 sampai Desember 2027.
// Setiap tanggal punya sumber yang bisa dicek. Tanggal yang belum ditemukan sumbernya
// (misalnya Purnama/Tilem, Saraswati dan Pagerwesi Desember 2027) sengaja tidak dimasukkan.
// Dicek 6 November 2026.

const SUMBER = {
  // SKB 3 Menteri No. 1205/2026, 3/2026, 2/2026 tentang Hari Libur Nasional dan Cuti Bersama 2027.
  skb2027: "https://setneg.go.id/baca/index/inilah_skb_3_menteri_libur_nasional_dan_cuti_bersama_2027",
  // SKB 3 Menteri No. 1497/2025, 2/2025, 5/2025 tentang Hari Libur Nasional dan Cuti Bersama 2026.
  skb2026: "https://www.setneg.go.id/baca/index/inilah_skb_3_menteri_libur_nasional_dan_cuti_bersama_2026",
  // Kalender Pendidikan Provinsi Bali 2026/2027, SK Kadis Dikpora Bali No. B.10.400.3/5892/UPTD.BPTP/DIKPORA.
  // Hari raya 2027 di dalamnya masih ditandai "perkiraan" sambil menunggu SE Gubernur Bali.
  dikpora: "https://www.komunitasbelajar.id/2026/05/kalender-pendidikan-provinsi-bali.html",
  // Daftar hari raya Bali 2027; cocok dengan siklus pawukon 210 hari dari Galungan 13 Januari 2027.
  nusapenida: "https://nusapenida.org/celebrations-ceremonies-in-bali-and-nusa-penida/",
};

// jenis: "hari-raya" (Hindu Bali), "libur" (libur nasional/cuti bersama), "musim" (rentang ramai liburan)
export const KALENDER = [
  { tanggal: "2026-11-04", nama: "Hari Raya Pagerwesi", jenis: "hari-raya", sumber: SUMBER.dikpora },
  { tanggal: "2026-12-24", nama: "Cuti bersama Natal", jenis: "libur", sumber: SUMBER.skb2026 },
  { tanggal: "2026-12-25", nama: "Hari Natal", jenis: "libur", sumber: SUMBER.skb2026 },
  { mulai: "2026-12-21", selesai: "2027-01-02", nama: "Libur semester ganjil sekolah di Bali", jenis: "musim", sumber: SUMBER.dikpora },
  { tanggal: "2027-01-01", nama: "Tahun Baru 2027", jenis: "libur", sumber: SUMBER.skb2027 },
  { tanggal: "2027-01-05", nama: "Isra Mikraj", jenis: "libur", sumber: SUMBER.skb2027 },
  { tanggal: "2027-01-06", nama: "Hari Raya Siwaratri", jenis: "hari-raya", sumber: SUMBER.dikpora },
  { tanggal: "2027-01-12", nama: "Penampahan Galungan", jenis: "hari-raya", sumber: SUMBER.dikpora },
  { tanggal: "2027-01-13", nama: "Hari Raya Galungan", jenis: "hari-raya", sumber: SUMBER.dikpora },
  { tanggal: "2027-01-14", nama: "Umanis Galungan", jenis: "hari-raya", sumber: SUMBER.dikpora },
  { tanggal: "2027-01-23", nama: "Hari Raya Kuningan", jenis: "hari-raya", sumber: SUMBER.dikpora },
  { tanggal: "2027-02-05", nama: "Cuti bersama Tahun Baru Imlek", jenis: "libur", sumber: SUMBER.skb2027 },
  { tanggal: "2027-02-06", nama: "Tahun Baru Imlek 2578", jenis: "libur", sumber: SUMBER.skb2027 },
  { tanggal: "2027-03-08", nama: "Hari Suci Nyepi (Tahun Baru Saka 1949)", jenis: "hari-raya", sumber: SUMBER.skb2027 },
  { tanggal: "2027-03-09", nama: "Ngembak Geni", jenis: "hari-raya", sumber: SUMBER.dikpora },
  { tanggal: "2027-03-10", nama: "Idulfitri 1448 H", jenis: "libur", sumber: SUMBER.skb2027 },
  { tanggal: "2027-03-11", nama: "Idulfitri 1448 H", jenis: "libur", sumber: SUMBER.skb2027 },
  { tanggal: "2027-03-26", nama: "Wafat Yesus Kristus", jenis: "libur", sumber: SUMBER.skb2027 },
  { tanggal: "2027-03-28", nama: "Paskah", jenis: "libur", sumber: SUMBER.skb2027 },
  { tanggal: "2027-05-01", nama: "Hari Buruh Internasional", jenis: "libur", sumber: SUMBER.skb2027 },
  { tanggal: "2027-05-06", nama: "Kenaikan Yesus Kristus", jenis: "libur", sumber: SUMBER.skb2027 },
  { tanggal: "2027-05-17", nama: "Iduladha 1448 H", jenis: "libur", sumber: SUMBER.skb2027 },
  { tanggal: "2027-05-20", nama: "Hari Raya Waisak 2571 BE", jenis: "libur", sumber: SUMBER.skb2027 },
  { tanggal: "2027-05-29", nama: "Hari Raya Saraswati", jenis: "hari-raya", sumber: SUMBER.dikpora },
  { tanggal: "2027-06-01", nama: "Hari Lahir Pancasila", jenis: "libur", sumber: SUMBER.skb2027 },
  { tanggal: "2027-06-02", nama: "Hari Raya Pagerwesi", jenis: "hari-raya", sumber: SUMBER.dikpora },
  { tanggal: "2027-06-06", nama: "Tahun Baru Islam 1449 H", jenis: "libur", sumber: SUMBER.skb2027 },
  { mulai: "2027-06-14", selesai: "2027-07-10", nama: "Libur semester genap dan akhir tahun ajaran sekolah di Bali", jenis: "musim", sumber: SUMBER.dikpora },
  { tanggal: "2027-08-11", nama: "Hari Raya Galungan", jenis: "hari-raya", sumber: SUMBER.nusapenida },
  { tanggal: "2027-08-15", nama: "Maulid Nabi Muhammad SAW", jenis: "libur", sumber: SUMBER.skb2027 },
  { tanggal: "2027-08-17", nama: "Hari Kemerdekaan RI", jenis: "libur", sumber: SUMBER.skb2027 },
  { tanggal: "2027-08-21", nama: "Hari Raya Kuningan", jenis: "hari-raya", sumber: SUMBER.nusapenida },
  { tanggal: "2027-12-24", nama: "Cuti bersama Natal", jenis: "libur", sumber: SUMBER.skb2027 },
  { tanggal: "2027-12-25", nama: "Hari Natal", jenis: "libur", sumber: SUMBER.skb2027 },
  { tanggal: "2027-12-26", nama: "Isra Mikraj", jenis: "libur", sumber: SUMBER.skb2027 },
];

// Semua acara yang beririsan dengan rentang [mulai, selesai], tanggal "YYYY-MM-DD".
export function acaraDalamRentang(mulai, selesai) {
  return KALENDER.filter((a) =>
    a.tanggal ? a.tanggal >= mulai && a.tanggal <= selesai : a.mulai <= selesai && a.selesai >= mulai,
  );
}
