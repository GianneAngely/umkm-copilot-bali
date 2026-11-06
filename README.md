# UMKM Copilot Bali

## Description

UMKM Copilot Bali adalah web app yang membantu pelaku UMKM di Bali menyiapkan materi pemasaran digital. Pengguna cukup mengisi data singkat tentang produknya, lalu AI menyusun deskripsi produk, caption promosi beserta hashtag, saran harga jual, dan versi Bahasa Inggris untuk wisatawan. Semua hasil bisa langsung disalin ke marketplace, Instagram, atau WhatsApp.

Entri AI Web Innovation Challenge, Bali DigiFest 2026, kategori UMKM & Bisnis.

![Tampilan aplikasi (mode contoh)](docs/screenshot-mock.png)

## Problem & Target User

Banyak UMKM di Bali, seperti warung, perajin, produsen kuliner, dan toko oleh-oleh, punya produk yang bagus tetapi kesulitan memasarkannya secara digital. Pemiliknya jarang punya waktu atau keterampilan menulis deskripsi dan caption yang menarik, sering ragu menentukan harga jual, dan belum bisa menjangkau wisatawan asing karena kendala bahasa. Akibatnya produk mereka kalah bersaing di marketplace dan media sosial.

Pengguna utama aplikasi ini adalah pemilik atau pengelola UMKM di Bali yang berjualan secara daring maupun di lokasi wisata, termasuk yang baru mulai memakai media sosial untuk berjualan.

## Key Features

Fitur berikut sudah berfungsi:

- **Form data produk**: nama produk, kategori, bahan atau keunggulan, harga modal (opsional), dan target pasar (pembeli lokal atau wisatawan).
- **Generate sekali klik** dengan hasil per bagian:
  - deskripsi produk dalam dua versi, singkat untuk marketplace dan bercerita untuk media sosial;
  - caption promosi untuk Instagram/WhatsApp dan 8–12 hashtag yang relevan dengan Bali;
  - saran rentang harga jual dalam Rupiah beserta alasannya, dihitung dari harga modal bila diisi;
  - versi Bahasa Inggris (deskripsi dan caption) untuk wisatawan asing.
- **Tombol Salin** di setiap bagian hasil.
- **Riwayat** lima produk terakhir, tersimpan di browser pengguna.
- **Mode contoh**: kalau server belum diberi API key, aplikasi tetap bisa dicoba dan menampilkan hasil contoh yang diberi label jelas.

## Tech Stack

| Bagian | Teknologi |
| --- | --- |
| Frontend | Next.js 15 (App Router), React 19, CSS biasa |
| Backend | Next.js Route Handler (`POST /api/generate`) di runtime Node.js |
| AI | Gemini API, model `gemini-3.8-flash`, lewat SDK resmi `@google/genai` |
| Database / storage | Tidak memakai database. Riwayat disimpan di `localStorage` browser |
| Hosting | Vercel |

## AI Implementation

AI adalah inti produk: tanpa model bahasa, aplikasi tidak bisa menyusun teks pemasaran yang menyesuaikan produk, kategori, dan target pasar.

- **Model**: Google Gemini `gemini-3.8-flash` melalui Gemini API (free tier).
- **Input**: data produk dari form, disusun menjadi prompt pendek di server. Instruksi sistem meminta bahasa yang wajar, melarang klaim berlebihan, dan melarang AI mengarang fakta yang tidak ada di data (misalnya sertifikat atau penghargaan).
- **Output**: JSON terstruktur yang dibatasi skema (`responseJsonSchema`), berisi `deskripsi_singkat`, `deskripsi_cerita`, `caption`, `hashtags`, `harga` (`min`, `max`, `alasan`), dan `english` (`description`, `caption`). Server memvalidasi hasil dengan Zod sebelum dikirim ke browser, sehingga setiap bagian di layar selalu terisi.
- **Penanganan galat**: kalau Gemini gagal dipanggil (kuota habis, key tidak valid, atau jawaban tidak sesuai skema), pengguna melihat pesan galat yang jelas. Aplikasi tidak diam-diam menggantinya dengan hasil contoh.
- **Keamanan key**: API key hanya dibaca di server dari environment variable `GEMINI_API_KEY`. Browser tidak pernah memanggil Gemini secara langsung.

Rincian lengkap ada di [docs/AI-DISCLOSURE.md](docs/AI-DISCLOSURE.md).

## Architecture / Data Flow

```
Browser (form React)
   │  POST /api/generate  { nama, kategori, keunggulan, modal, target }
   ▼
Next.js Route Handler  (app/api/generate/route.js)
   │  validasi input
   ├── GEMINI_API_KEY kosong ──► hasil contoh statis (lib/generate.js) ──┐
   │                                                                     │
   └── GEMINI_API_KEY ada ──► Gemini API (gemini-3.8-flash)              │
                                 │  JSON sesuai skema                    │
                                 ▼                                       │
                           validasi Zod                                  │
                                 │                                       │
   ◄─────────────────────────────┴───────────────────────────────────────┘
Browser menampilkan hasil per bagian + tombol Salin, lalu menyimpan riwayat di localStorage
```

Struktur folder:

- `app/page.js`: form dan tampilan hasil.
- `app/api/generate/route.js`: endpoint dan validasi input.
- `lib/generate.js`: prompt, skema keluaran, panggilan Gemini, dan data mode contoh.

## Installation / Run Instructions

Butuh Node.js 20 atau lebih baru.

```bash
npm install
cp .env.example .env.local
```

Isi `GEMINI_API_KEY` di `.env.local` dengan API key dari [Google AI Studio](https://aistudio.google.com/apikey). Kalau dibiarkan kosong, aplikasi berjalan di mode contoh.

```bash
npm run dev
```

Buka http://localhost:3000.

Versi produksi: `npm run build` lalu `npm start`. Untuk Vercel, cukup tambahkan `GEMINI_API_KEY` di pengaturan Environment Variables proyek.

## Deployment URL

_[akan diisi setelah deploy]_

## Demo Account (jika diperlukan - jangan simpan password sensitif di public repo)

Tidak diperlukan. Aplikasi bisa dipakai tanpa login.

## Known Limitations

- Memakai free tier Gemini API, sehingga ada batas jumlah permintaan per menit dan per hari. Kalau batas tercapai, aplikasi menampilkan pesan agar pengguna mencoba lagi nanti.
- Pada free tier, Google dapat memakai input dan output untuk meningkatkan produknya. Pengguna sebaiknya tidak memasukkan data pribadi atau rahasia ke dalam form.
- Saran harga adalah perkiraan dari AI berdasarkan harga modal dan kategori, bukan hasil riset pasar. Pengguna tetap perlu menyesuaikan dengan kondisi di lapangan.
- Teks hasil AI bisa saja kurang tepat, jadi tetap perlu dibaca ulang sebelum diunggah.
- Riwayat hanya tersimpan di browser yang dipakai dan hilang kalau data browser dihapus. Belum ada akun pengguna atau sinkronisasi antarperangkat.
- Belum ada analisis foto produk; semua input masih berupa teks.

## Third-party Resources / Credits

- [Next.js](https://nextjs.org) dan [React](https://react.dev) (MIT)
- [@google/genai](https://www.npmjs.com/package/@google/genai), SDK resmi Gemini (Apache-2.0)
- [Zod](https://zod.dev) untuk skema dan validasi (MIT)
- Font [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans), [Newsreader](https://fonts.google.com/specimen/Newsreader), [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono), dan [Caveat](https://fonts.google.com/specimen/Caveat) dari Google Fonts (SIL Open Font License 1.1). Berkas WOFF2 subset Latin disimpan di `app/fonts/` dan dimuat lewat `next/font/local`, jadi build tidak bergantung pada server Google. Rincian lisensi di `app/fonts/LICENSE.md`
- Gemini API oleh Google
- Ilustrasi hero (taplak kotak, nota, struk, label harga, HP, pena) dan ikon digambar langsung dengan CSS dan SVG inline, tanpa pustaka ikon, foto, atau gambar hasil generator

## Team Members

| Nama | Peran |
| --- | --- |
| _[nama anggota]_ | _[peran]_ |
