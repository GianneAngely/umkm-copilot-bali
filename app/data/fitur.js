// Daftar fitur yang benar-benar ada di /app. Dipakai mega menu di landing dan app.
// sasaran: elemen data-tur yang dituju; butuhHasil: bagian itu baru muncul setelah tulisan jadi.

export const IKON_FITUR = {
  pena: <><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></>,
  coret: <><path d="M5 8h14M5 12h9M5 16h11" /><path d="M3 14l18-4" /></>,
  chat: <><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9h8M8 12h5" /></>,
  kalender: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /><path d="M12 13.5l1 2 2 .3-1.5 1.4.4 2-1.9-1-1.9 1 .4-2L9 15.8l2-.3z" /></>,
  kamera: <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  studio: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M12 4v16" /><path d="M7 15l2.5-3 2.5 3M14 15l2-2.5 2 2.5" /></>,
  postingan: <><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><path d="M16.5 7.5h.01" /></>,
  profil: <><circle cx="12" cy="9" r="3.5" /><path d="M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5" /></>,
  tutorial: <><circle cx="12" cy="12" r="8.5" /><path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4M12 16.5h.01" /></>,
  riwayat: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></>,
  contoh: <><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></>,
};

export const KOLOM_FITUR = [
  {
    judul: "TULIS",
    item: [
      { id: "tulisan-jualan", nama: "Tulisan jualan", ket: "Deskripsi, caption, saran harga, dan versi bahasa Inggris sekali klik", ikon: "pena", sasaran: "nama" },
      { id: "lembar-suntingan", nama: "Lembar suntingan", ket: "Klaim kosong dicoret, fakta Anda distabilo", ikon: "coret", sasaran: "suntingan", butuhHasil: true, baru: true },
      { id: "balas-chat", nama: "Balas chat pembeli", ket: "Lima balasan WhatsApp siap salin", ikon: "chat", sasaran: "balas", butuhHasil: true, baru: true },
      { id: "kalender-konten", nama: "Kalender konten Bali", ket: "Rencana posting 7 hari yang memperhitungkan hari raya", ikon: "kalender", sasaran: "kalender", butuhHasil: true },
    ],
  },
  {
    judul: "FOTO",
    item: [
      { id: "isi-dari-foto", nama: "Isi dari foto", ket: "AI membaca foto produk, formulir terisi sendiri", ikon: "kamera", sasaran: "foto" },
      { id: "foto-studio", nama: "Foto Studio", ket: "AI menilai foto Anda, lalu merapikannya", ikon: "studio", sasaran: "studio", butuhHasil: true, baru: true },
    ],
  },
  {
    judul: "INSTAGRAM",
    item: [
      { id: "postingan-instagram", nama: "Postingan Instagram", ket: "Gambar untuk feed dan Story siap diunduh", ikon: "postingan", sasaran: "ig", butuhHasil: true },
      { id: "profil-instagram", nama: "Profil Instagram", ket: "Bio, nama profil, dan sorotan", ikon: "profil", sasaran: "profil", butuhHasil: true, baru: true },
    ],
  },
];

export const BAWAH_FITUR = [
  { id: "tutorial", nama: "Tutorial interaktif", ikon: "tutorial" },
  { id: "riwayat", nama: "Riwayat", ikon: "riwayat" },
  { id: "contoh", nama: "Contoh produk", ikon: "contoh" },
];

export const SEMUA_FITUR = KOLOM_FITUR.flatMap((k) => k.item);
