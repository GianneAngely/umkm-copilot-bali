import Link from "next/link";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";

export const metadata = { title: "Cara kerja" };

function Kepala({ no, judul, id, lead }) {
  return (
    <div className="kepala">
      <span className="cap">NOTA No. {String(no).padStart(2, "0")}</span>
      <h2 id={id}>{judul}</h2>
      {lead && <p className="kepala-lead">{lead}</p>}
    </div>
  );
}

const SIMPUL = [
  ["PERAMBAN", "Anda", "Mengisi nota di Studio"],
  ["NEXT.JS", "Halaman", "Mengirim isian ke server"],
  ["SERVER", "/api/generate", "Memvalidasi isian, menyimpan API key"],
  ["GOOGLE", "Gemini", "gemini-3.8-flash, instruksi terkunci"],
  ["HASIL", "Struk", "Dicek ulang dengan Zod, lalu ditampilkan"],
];

function Diagram() {
  return (
    <svg className="diagram" viewBox="0 0 1000 250" role="img"
      aria-label="Alur data: peramban, halaman Next.js, server /api/generate, Google Gemini, lalu hasil berupa struk. Tanpa API key, server langsung mengembalikan contoh statis.">
      {SIMPUL.map(([cap, judul, teks], i) => {
        const x = i * 200 + 10;
        const hijau = i === 4;
        return (
          <g key={cap}>
            <rect x={x} y="30" width="180" height="120" rx="10" className={hijau ? "d-kotak d-hijau" : "d-kotak"} />
            <text x={x + 16} y="58" className="d-cap">{cap}</text>
            <text x={x + 16} y="92" className="d-judul">{judul}</text>
            <text x={x + 16} y="124" className="d-teks">{teks.length > 24 ? teks.slice(0, teks.lastIndexOf(" ", 24)) : teks}</text>
            {teks.length > 24 && <text x={x + 16} y="140" className="d-teks">{teks.slice(teks.lastIndexOf(" ", 24) + 1)}</text>}
            {i < 4 && <path d={`M${x + 182} 90 h14 m-6 -6 l6 6 l-6 6`} className="d-panah" />}
          </g>
        );
      })}
      <path d="M500 150 v40 h400 v-36" className="d-panah d-putus" />
      <text x="520" y="214" className="d-teks">Tanpa API key: server langsung mengembalikan contoh statis (mode contoh)</text>
    </svg>
  );
}

const ATURAN = [
  ["Bahasa yang wajar dan hangat", "Seperti penjual lokal yang paham produknya, bukan bahasa iklan."],
  ["Tanpa superlatif", "Kata seperti \"terbaik\" atau \"paling enak\" dihindari kalau tidak bisa dibuktikan."],
  ["Nol klaim karangan", "AI dilarang menambah fakta di luar isian, misalnya sertifikat, penghargaan, atau lokasi toko."],
  ["Bentuk keluaran dikunci", "Gemini wajib menjawab dalam skema JSON yang tetap, lalu dicek ulang di server sebelum ditampilkan."],
];

const BATAS = [
  "Memakai free tier Gemini, jadi ada batas permintaan per menit dan per hari. Kalau tercapai, aplikasi meminta Anda mencoba lagi nanti.",
  "Saran harga adalah perkiraan dari modal dan kategori, bukan hasil riset pasar.",
  "Teks hasil AI bisa kurang tepat. Tetap baca ulang sebelum diunggah.",
  "Riwayat hanya ada di peramban yang dipakai dan hilang kalau data peramban dihapus.",
  "Belum bisa membaca foto produk. Semua isian masih berupa teks.",
];

export default function CaraKerjaPage() {
  return (
    <>
      <section className="halaman-kepala">
        <div className="wrap duo-57 rata-bawah">
          <div className="kepala">
            <span className="cap">CARA KERJA</span>
            <h1 className="judul-1">Apa yang terjadi setelah Anda menekan tombol.</h1>
          </div>
          <p className="kepala-lead">
            Dari nota sampai struk, beserta aturan yang dikunci untuk AI, cara data Anda diperlakukan, dan hal yang
            belum bisa dilakukan aplikasi ini.
          </p>
        </div>
      </section>

      <section className="bagian" aria-labelledby="alur-judul">
        <div className="wrap">
          <Kepala no={1} id="alur-judul" judul="Alur teknologi" />
          <Reveal className="kartu diagram-kartu">
            <Diagram />
          </Reveal>
          <ol className="alur-hp">
            {SIMPUL.map(([cap, judul, teks]) => (
              <li key={cap} className={cap === "HASIL" ? "kartu hijau" : "kartu"}>
                <p className="langkah-no">{cap}</p><h3>{judul}</h3><p>{teks}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bagian band-gelap" aria-labelledby="aturan-judul">
        <div className="wrap duo-57">
          <Kepala no={2} id="aturan-judul" judul="Aturan yang dikunci di server"
            lead="Instruksi untuk Gemini disimpan di server. Pengguna tidak bisa mengubahnya dari peramban." />
          <ol className="aturan">
            {ATURAN.map(([judul, teks], i) => (
              <Reveal as="li" key={judul}>
                <span className="aturan-no">{String(i + 1).padStart(2, "0")}</span>
                <div><h3>{judul}</h3><p>{teks}</p></div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bagian" aria-labelledby="privasi-judul">
        <div className="wrap duo-57">
          <Kepala no={3} id="privasi-judul" judul="Privasi dan data" />
          <div className="kartu teks-kartu">
            <ul className="poin">
              <li><Icon name="peramban" /><p><b>Tidak disimpan di server kami.</b> Isian dikirim dari server aplikasi ke Gemini untuk diproses, lalu hasilnya dikembalikan. Tidak ada database.</p></li>
              <li><Icon name="kunci" /><p><b>API key tetap di server.</b> Kunci Gemini disimpan sebagai environment variable dan tidak pernah dikirim ke peramban.</p></li>
              <li><Icon name="coret" /><p><b>Catatan free tier.</b> Aplikasi memakai layanan Gemini API tanpa biaya. Menurut ketentuan Google, pada layanan tanpa biaya Google dapat memakai input dan output untuk meningkatkan produknya, dan peninjau manusia dapat membacanya setelah dipisahkan dari akun. Karena itu, isi data produk saja, jangan nama orang, nomor telepon, alamat, atau informasi rahasia.</p></li>
            </ul>
            <p className="sumber">Rujukan: Gemini API Additional Terms of Service dan halaman harga Gemini API (ai.google.dev).</p>
          </div>
        </div>
      </section>

      <section className="bagian" aria-labelledby="batas-judul">
        <div className="wrap duo-57">
          <Kepala no={4} id="batas-judul" judul="Batasan yang perlu Anda tahu" />
          <ol className="kartu batas">
            {BATAS.map((b, i) => (
              <li key={i}><span className="aturan-no">{String(i + 1).padStart(2, "0")}</span><p>{b}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="cta-akhir" aria-labelledby="akhir-judul">
        <div className="wrap cta-akhir-isi">
          <div>
            <h2 id="akhir-judul">Sudah paham alurnya?</h2>
            <p>Coba dengan produk Anda sendiri. Tidak perlu daftar.</p>
          </div>
          <div className="cta-akhir-aksi">
            <Link className="btn btn-terang btn-lg" href="/studio">Buka Studio <Icon name="arrow" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
