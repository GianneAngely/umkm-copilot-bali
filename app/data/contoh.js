// Contoh hasil untuk galeri di landing dan menu Contoh di /app. Ditulis sebagai ilustrasi dengan format yang sama
// seperti keluaran /api/generate, bukan hasil milik pelanggan.
// Konten lengkap dari Staff Proposal nanti masuk dari Bali Digifest 2026/konten-web/.
// Belum ada foto asli tiap produk, jadi kartu contoh tampil sebagai struk tanpa gambar.

export const CONTOH = [
  {
    id: "pie-susu",
    form: {
      nama: "Pie Susu Bu Made",
      kategori: "Oleh-oleh",
      keunggulan: "susu sapi asli, tanpa pengawet, tahan 7 hari",
      modal: "15000",
      target: "turis",
    },
    result: {
      deskripsi_singkat:
        "Pie Susu Bu Made adalah oleh-oleh khas Bali dari susu sapi asli, tanpa pengawet, dan tahan 7 hari. Pas dibawa pulang setelah liburan.",
      caption:
        "Lagi cari oleh-oleh yang beda? Pie Susu Bu Made dibuat dari susu sapi asli dan tahan 7 hari di koper. Pesan lewat DM ya, kami siapkan hari ini juga.",
      hashtags: ["#PieSusuBali", "#OlehOlehBali", "#JajananBali", "#Gianyar", "#ProdukLokalBali", "#UMKMBali"],
      harga: {
        min: 27000,
        max: 35000,
        alasan: "Dengan modal Rp15.000, margin 80-130% masih wajar untuk pasar wisatawan yang biasanya membeli di toko oleh-oleh atau area wisata.",
      },
      english: {
        description: "A small-batch milk pie from Bali, made with fresh cow's milk and no preservatives. It keeps for 7 days.",
        caption: "Taking a piece of Bali home? Our milk pie keeps for 7 days, so it survives the flight. Message us to order.",
      },
    },
  },
  {
    id: "kopi-kintamani",
    form: {
      nama: "Kopi Bubuk Kintamani",
      kategori: "Kuliner",
      keunggulan: "arabika Kintamani, sangrai medium, bubuk 200 gram",
      modal: "40000",
      target: "turis",
    },
    result: {
      deskripsi_singkat:
        "Kopi Bubuk Kintamani dibuat dari arabika Kintamani dengan sangrai medium. Dikemas bubuk 200 gram, tinggal diseduh di rumah atau dibawa pulang sebagai oleh-oleh.",
      caption:
        "Bawa pulang rasa pagi di Bali ☕ Kopi Bubuk Kintamani, arabika Kintamani dengan sangrai medium, bubuk 200 gram. Pesan lewat DM atau WhatsApp, kami kirim minggu ini.",
      hashtags: ["#KopiKintamani", "#KopiBali", "#ArabikaBali", "#OlehOlehBali", "#ProdukLokalBali", "#UMKMBali"],
      harga: {
        min: 72000,
        max: 92000,
        alasan: "Dengan modal Rp40.000, margin 80-130% masih wajar untuk kopi kemasan yang dibeli wisatawan sebagai oleh-oleh.",
      },
      english: {
        description: "Ground arabica coffee from Kintamani, medium roast, packed in 200 gram bags.",
        caption: "Take a Bali morning home ☕ Kintamani arabica, medium roast, 200 g ground. Message us to order.",
      },
    },
  },
  {
    id: "tas-ate",
    form: {
      nama: "Tas Anyaman Ate",
      kategori: "Kerajinan",
      keunggulan: "dianyam tangan dari rumput ate, diameter 20 cm, tali kulit sintetis",
      modal: "120000",
      target: "lokal",
    },
    result: {
      deskripsi_singkat:
        "Tas Anyaman Ate dianyam tangan dari rumput ate, berdiameter 20 cm dengan tali kulit sintetis. Ringan untuk dibawa sehari-hari maupun ke acara.",
      caption:
        "Tas bulat yang dianyam tangan dari rumput ate 🌾 Diameter 20 cm, tali kulit sintetis, muat dompet dan HP. Stoknya sedikit karena dibuat satu per satu. Tanya warna lewat DM ya.",
      hashtags: ["#TasAte", "#AnyamanBali", "#KerajinanBali", "#BuatanTangan", "#UMKMBali", "#ProdukLokalBali"],
      harga: {
        min: 170000,
        max: 205000,
        alasan: "Dengan modal Rp120.000, margin 40-70% memberi ruang untuk diskon atau ongkir tanpa membuat harga terasa mahal bagi pembeli lokal.",
      },
      english: {
        description: "A round bag hand-woven from ate grass, 20 cm across, with a synthetic leather strap.",
        caption: "Hand-woven ate grass bag, 20 cm, synthetic leather strap. Each one is made by hand, so stock is limited.",
      },
    },
  },
  {
    id: "kain-tenun",
    form: {
      nama: "Kain Tenun Ikat Ibu Sari",
      kategori: "Fashion",
      keunggulan: "tenun tangan, pewarna alami, panjang 2 meter",
      modal: "250000",
      target: "turis",
    },
    result: {
      deskripsi_singkat:
        "Kain Tenun Ikat Ibu Sari dibuat dengan tenun tangan dan pewarna alami, panjang 2 meter. Bisa dipakai sebagai kain, selendang, atau hiasan dinding.",
      caption:
        "Setiap helai ditenun tangan, jadi motifnya tidak pernah persis sama. Kain Tenun Ikat Ibu Sari memakai pewarna alami, panjang 2 meter. Tanya motif yang tersedia lewat DM.",
      hashtags: ["#TenunIkat", "#KainTenun", "#PewarnaAlami", "#BuatanTangan", "#WastraNusantara", "#UMKMBali"],
      harga: {
        min: 450000,
        max: 575000,
        alasan: "Dengan modal Rp250.000, margin 80-130% masih wajar untuk kain tenun tangan yang dibeli wisatawan sebagai cendera mata.",
      },
      english: {
        description: "Hand-woven ikat cloth coloured with natural dyes, 2 metres long. Wear it as a sarong or scarf, or hang it on a wall.",
        caption: "Every piece is woven by hand, so no two patterns are exactly alike. Natural dyes, 2 metres long. Message us for available motifs.",
      },
    },
  },
];

export const FILTER = ["Semua", "Kuliner", "Kerajinan", "Fashion", "Oleh-oleh"];
