# UMKM Copilot Bali

Web app untuk pelaku UMKM di Bali. Cukup isi nama produk, kategori, keunggulan, harga modal (opsional), dan target pasar. Aplikasi lalu menyusun:

- deskripsi produk dalam dua versi (singkat dan bercerita),
- caption promosi untuk Instagram/WhatsApp beserta hashtag khas Bali,
- saran rentang harga jual dan alasannya,
- versi Bahasa Inggris untuk wisatawan asing.

Setiap bagian punya tombol **Salin**. Lima hasil terakhir tersimpan di browser (localStorage).

Entri untuk AI Web Innovation Challenge, Bali Digifest 2026.

![Tampilan mode contoh](docs/screenshot-mock.png)

## Menjalankan

Butuh Node.js 20 atau lebih baru.

```bash
npm install
cp .env.example .env.local   # isi ANTHROPIC_API_KEY kalau ada
npm run dev
```

Buka http://localhost:3000.

Untuk versi produksi: `npm run build` lalu `npm start`.

### Mode contoh (tanpa API key)

Kalau `ANTHROPIC_API_KEY` kosong, server tidak memanggil AI dan mengembalikan contoh hasil statis yang diisi dengan data dari form. Mode ini dipakai untuk demo dan pengujian tanpa biaya. Di halaman muncul keterangan "Mode contoh" supaya tidak tertukar dengan hasil AI asli.

## Cara kerja

- `app/page.js` berisi form dan tampilan hasil (Next.js App Router, React).
- `app/api/generate/route.js` adalah endpoint `POST /api/generate`. Validasi input dilakukan di sini, lalu dipilih antara mode contoh atau panggilan AI.
- `lib/generate.js` berisi prompt, skema keluaran, panggilan ke Claude API, dan data mode contoh.

API key hanya dibaca di server. Browser tidak pernah memanggil API Anthropic secara langsung.

## Pengungkapan penggunaan AI

- Model: **Claude Haiku 5.5** (`claude-haiku-5-5`) dari Anthropic, dipanggil lewat Claude API dengan SDK resmi `@anthropic-ai/sdk`.
- Keluaran AI dibatasi dengan *structured output* (skema JSON) supaya setiap bagian selalu terisi.
- Pengembangan kode aplikasi dibantu Claude Code.
