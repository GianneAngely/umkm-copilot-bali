// Kartu fitur bernada lembut. Objek di pojok berupa potongan UI hasil, bukan ilustrasi kartun.
const FITUR = [
  {
    warna: "biru", judul: "Deskripsi jujur", teks: "Versi singkat untuk marketplace dan versi bercerita untuk Instagram.",
    ikon: <path d="M6 4h9l3 3v13H6z M9 10h6 M9 14h6" />,
    pojok: <span className="f-struk"><b>DESKRIPSI</b><i /><i /><i className="pendek" /></span>,
  },
  {
    warna: "kuning", judul: "Caption + hashtag", teks: "Siap tempel, dengan 8 sampai 12 hashtag khas Bali.",
    ikon: <path d="M5 9h14 M5 15h14 M10 4 8 20 M16 4l-2 16" />,
    pojok: <span className="f-chip"><span>#OlehOlehBali</span><span>#UMKMBali</span></span>,
  },
  {
    warna: "kuning", judul: "Saran harga", teks: "Rentang harga jual dari modal dan target pembeli, beserta alasannya.",
    ikon: <path d="M4 12l8-8h8v8l-8 8z M15.5 8.5h.01" />,
    pojok: <span className="f-harga">Rp27rb – 35rb</span>,
  },
  {
    warna: "biru", judul: "Versi Inggris", teks: "Ditulis ulang untuk wisatawan, bukan terjemahan kata per kata.",
    ikon: <><circle cx="12" cy="12" r="8" /><path d="M4 12h16 M12 4a12 12 0 0 1 0 16 M12 4a12 12 0 0 0 0 16" /></>,
    pojok: <span className="f-en"><b>EN</b>A sweet souvenir to bring home.</span>,
  },
];

export default function Fitur() {
  return (
    <section className="fitur" aria-labelledby="fitur-judul">
      <div className="wrap">
        <div className="b-kepala">
          <h2 id="fitur-judul">Yang bisa dikerjakan dari satu nota</h2>
        </div>
        <ul className="fitur-grid">
          {FITUR.map((f) => (
            <li key={f.judul} className={`fitur-kartu fitur-${f.warna}`} data-muncul>
              <span className="fitur-ikon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{f.ikon}</svg>
              </span>
              <h3>{f.judul}</h3>
              <p>{f.teks}</p>
              <span className="fitur-pojok" aria-hidden="true">{f.pojok}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
