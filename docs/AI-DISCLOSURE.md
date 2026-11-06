# AI & Technology Disclosure

Disusun mengikuti Lampiran C Panduan Peserta AI Web Innovation Challenge, Bali DigiFest 2026.

| Komponen | Isi Peserta |
| --- | --- |
| Nama Produk | UMKM Copilot Bali |
| Framework / Frontend | Next.js 15 (App Router) dan React 19, dengan CSS biasa tanpa framework UI |
| Backend / Runtime | Next.js Route Handler (`POST /api/generate`) di runtime Node.js. Endpoint ini memvalidasi input, memanggil Gemini, dan memvalidasi jawaban sebelum dikirim ke browser |
| Database / Storage | Tidak memakai database. Riwayat lima produk terakhir disimpan di `localStorage` pada browser pengguna dan tidak dikirim ke server mana pun |
| Hosting / Deployment | Vercel |
| AI Model / API / Method | Google Gemini API, model `gemini-3.8-flash`, dipanggil dengan SDK resmi `@google/genai` dari sisi server. Metode: generative AI (LLM) dengan instruksi sistem dan *structured output* (`responseMimeType: application/json` + `responseJsonSchema`), lalu divalidasi ulang dengan Zod |
| Peran AI dalam Produk | AI menyusun teks pemasaran dari data produk: deskripsi singkat, deskripsi bercerita, caption promosi dan hashtag Bali, saran rentang harga jual beserta alasannya, serta versi Bahasa Inggris untuk wisatawan. Ini adalah fungsi utama aplikasi. Kalau server belum diberi API key, aplikasi menampilkan hasil contoh statis yang diberi label "Mode contoh", sehingga tidak tertukar dengan hasil AI |
| Dataset / Data Source | Tidak memakai dataset. Satu-satunya sumber data adalah isian form dari pengguna |
| Open-source Libraries | `next` (MIT), `react` dan `react-dom` (MIT), `@google/genai` (Apache-2.0), `zod` (MIT) |
| Template / Boilerplate | Tidak memakai template. Proyek disusun manual tanpa `create-next-app` |
| AI Coding Assistant | Claude Code (Anthropic) dipakai untuk membantu menulis dan menguji kode aplikasi. Seluruh kode ditinjau, dijalankan, dan dipertanggungjawabkan oleh peserta |
| Pre-existing Components | Tidak ada. Seluruh aplikasi dibuat selama periode kompetisi |
| Third-party Assets / Credits | Font Plus Jakarta Sans dan Young Serif dari Google Fonts (SIL Open Font License), dimuat lewat `next/font`. Ikon dan motif ikat endek digambar langsung sebagai SVG inline |

## Privasi dan penggunaan data

- Data produk yang diisi pengguna (nama produk, kategori, bahan atau keunggulan, harga modal, dan target pasar) dikirim dari server aplikasi ke Gemini API untuk diproses. Aplikasi tidak menyimpan data ini di server.
- Aplikasi memakai **free tier (Unpaid Services)** Gemini API. Menurut [Gemini API Additional Terms of Service](https://ai.google.dev/gemini-api/terms), pada layanan tanpa biaya Google dapat memakai input dan output untuk mengembangkan dan meningkatkan produknya, dan peninjau manusia dapat membaca serta memberi anotasi pada input dan output tersebut setelah dipisahkan dari akun, API key, dan project. Google juga meminta agar informasi sensitif, rahasia, atau pribadi tidak dikirim ke layanan tanpa biaya.
- Karena itu, form hanya meminta data produk, bukan data pribadi. Pengguna diimbau tidak menulis nama orang, nomor telepon, alamat, atau informasi rahasia lain di kolom isian.
- Status free tier dan modelnya dicek pada [halaman harga Gemini API](https://ai.google.dev/gemini-api/docs/pricing). Di halaman itu, `gemini-3.8-flash` tercatat gratis untuk input dan output pada free tier, dengan keterangan "Used to improve our products: Yes" untuk free tier.
- API key disimpan sebagai environment variable `GEMINI_API_KEY` di server dan tidak pernah dikirim ke browser atau dimasukkan ke repository. Repository hanya berisi `.env.example` tanpa nilai.

## Pernyataan

Kami menyatakan bahwa informasi di atas benar dan lengkap. Kami bertanggung jawab atas penggunaan teknologi, source code, data, library, API, model AI, dan aset yang digunakan pada produk.
