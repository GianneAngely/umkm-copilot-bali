// Contoh hasil untuk galeri /contoh. Ditulis sebagai ilustrasi dengan format yang sama
// seperti keluaran /api/generate, bukan hasil milik pelanggan.
// Konten lengkap dari Staff Proposal nanti masuk dari Bali Digifest 2026/konten-web/.

export const CONTOH = [
  {
    id: "kopi-kintamani",
    foto: "kuliner",
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
    foto: "kerajinan",
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
];

export const FILTER = ["Semua", "Kuliner", "Kerajinan", "Fashion", "Oleh-oleh"];
