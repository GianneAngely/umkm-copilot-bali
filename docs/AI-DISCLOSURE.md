# AI & Technology Disclosure

Disusun mengikuti Lampiran C Panduan Peserta AI Web Innovation Challenge, Bali DigiFest 2026.

| Komponen | Isi Peserta |
| --- | --- |
| Nama Produk | Wicara |
| Framework / Frontend | Next.js 15 (App Router) dan React 19, dengan CSS biasa dan CSS Modules tanpa framework UI. Postingan Instagram digambar dengan Canvas API bawaan browser |
| Backend / Runtime | Next.js Route Handler di runtime Node.js: `POST /api/generate` (teks pemasaran), `POST /api/foto` (membaca foto produk), dan `POST /api/kalender` (rencana posting 7 hari). Setiap endpoint memvalidasi input, memanggil Claude (cadangan Gemini), dan memvalidasi jawaban sebelum dikirim ke browser |
| Database / Storage | Tidak memakai database. Riwayat lima produk terakhir disimpan di `localStorage` pada browser pengguna dan tidak dikirim ke server mana pun. Foto produk tidak disimpan di server |
| Hosting / Deployment | Vercel |
| AI Model / API / Method | Utama: Claude API dari Anthropic, model Claude Haiku 5.5 (`claude-haiku-5-5`), dipanggil dari sisi server dengan SDK resmi `@anthropic-ai/sdk`, *structured output* (`output_config.format` dari skema Zod), dan effort `low`. Model yang sama membaca teks dan foto. Cadangan otomatis kalau Claude galat, menolak, atau key kosong: Google Gemini API lewat SDK resmi `@google/genai` dengan API key free tier. Server mencoba berurutan `gemini-3.5-flash`, `gemini-3.6-flash`, `gemini-3.5-flash-lite`, lalu `gemini-3.8-flash`; model yang sibuk (503/429) atau tidak menjawab dalam 9 detik dilewati, dengan batas total 25 detik. Respons API mencantumkan model yang benar-benar menjawab. Metode: generative AI multimodal (teks dan gambar) dengan instruksi sistem yang sama di kedua penyedia dan keluaran JSON terstruktur (Claude: `output_config.format`; Gemini: `responseMimeType: application/json` + `responseJsonSchema`), lalu divalidasi ulang dengan Zod |
| Peran AI dalam Produk | AI adalah fungsi utama aplikasi. (1) Menyusun teks pemasaran dari data produk: deskripsi singkat dan bercerita, caption dan hashtag Bali, saran rentang harga jual beserta alasannya, serta versi Bahasa Inggris. (2) Membaca foto produk untuk mengisi nama, kategori, dan keunggulan, dengan instruksi hanya menulis yang terlihat dan mencatat keraguan. (3) Menyusun ide posting 7 hari yang memperhitungkan hari raya Bali dan libur yang disisipkan server dari data terverifikasi. Kalau server belum diberi API key, aplikasi menampilkan hasil contoh statis berlabel "Mode contoh", sehingga tidak tertukar dengan hasil AI |
| Dataset / Data Source | Tidak memakai dataset pelatihan. Data yang diolah adalah isian form dan foto dari pengguna. Kalender memakai data statis `lib/hari-raya-bali.js` yang disusun dari SKB 3 Menteri tentang Hari Libur Nasional dan Cuti Bersama 2026 dan 2027 ([setneg.go.id](https://setneg.go.id/baca/index/inilah_skb_3_menteri_libur_nasional_dan_cuti_bersama_2027)), Kalender Pendidikan Provinsi Bali 2026/2027 (SK Kadis Dikpora Bali No. B.10.400.3/5892/UPTD.BPTP/DIKPORA), dan daftar hari raya Bali 2027 dari nusapenida.org. Sumber tiap tanggal dicatat di berkas tersebut |
| Open-source Libraries | `next` (MIT), `react` dan `react-dom` (MIT), `@anthropic-ai/sdk` (MIT), `@google/genai` (Apache-2.0), `zod` (MIT), `gsap` (lisensi standar GSAP, gratis), `lenis` (MIT) |
| Template / Boilerplate | Tidak memakai template. Proyek disusun manual tanpa `create-next-app` |
| AI Coding Assistant | Claude Code (Anthropic) dipakai untuk membantu menulis dan menguji kode aplikasi. Seluruh kode ditinjau, dijalankan, dan dipertanggungjawabkan oleh peserta |
| Pre-existing Components | Tidak ada. Seluruh aplikasi dibuat selama periode kompetisi |
| Third-party Assets / Credits | Font Bricolage Grotesque dan Spline Sans Mono dari Google Fonts (SIL Open Font License 1.1), disimpan di `app/fonts/`. Foto di `public/foto/` dari Pexels (lisensi Pexels), nama fotografer dicantumkan di README. Ikon, struk, dan template postingan digambar sendiri dengan CSS, SVG inline, dan Canvas |

## Privasi dan penggunaan data

- Data produk yang diisi pengguna (nama produk, kategori, bahan atau keunggulan, harga modal, dan target pasar) dan foto produk yang diunggah dikirim dari server aplikasi ke Claude API (Anthropic) untuk diproses, atau ke Gemini API kalau Claude sedang galat. Aplikasi tidak menyimpan data atau foto ini di server.
- Claude API dipakai dengan akun berbayar (kredit). Menurut [Commercial Terms of Service Anthropic](https://www.anthropic.com/legal/commercial-terms), Anthropic tidak memakai input dan output API komersial untuk melatih model.
- Cadangan memakai **free tier (Unpaid Services)** Gemini API. Menurut [Gemini API Additional Terms of Service](https://ai.google.dev/gemini-api/terms), pada layanan tanpa biaya Google dapat memakai input dan output untuk mengembangkan dan meningkatkan produknya, dan peninjau manusia dapat membaca serta memberi anotasi pada input dan output tersebut setelah dipisahkan dari akun, API key, dan project. Google juga meminta agar informasi sensitif, rahasia, atau pribadi tidak dikirim ke layanan tanpa biaya.
- Karena itu, form hanya meminta data produk, bukan data pribadi. Pengguna diimbau tidak menulis nama orang, nomor telepon, alamat, atau informasi rahasia lain, dan tidak memotret wajah orang atau dokumen pribadi untuk fitur foto.
- Status free tier dicek pada [halaman harga Gemini API](https://ai.google.dev/gemini-api/docs/pricing) tanggal 6 November 2026. Di halaman itu `gemini-3.8-flash`, `gemini-3.6-flash`, dan `gemini-3.5-flash-lite` tercatat gratis untuk input dan output pada free tier, dengan keterangan "Used to improve our products: Yes". `gemini-3.5-flash` belum tercantum di halaman harga maupun daftar model resmi pada tanggal itu, tetapi dipanggil dengan API key free tier yang sama.
- API key disimpan sebagai environment variable `ANTHROPIC_API_KEY` dan `GEMINI_API_KEY` di server dan tidak pernah dikirim ke browser atau dimasukkan ke repository. Repository hanya berisi `.env.example` tanpa nilai.

## Pernyataan

Kami menyatakan bahwa informasi di atas benar dan lengkap. Kami bertanggung jawab atas penggunaan teknologi, source code, data, library, API, model AI, dan aset yang digunakan pada produk.
