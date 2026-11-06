import { buatFakta, Stabilo } from "./Stabilo";
import { CONTOH } from "../data/contoh";

const ribu = (n) => Number(n).toLocaleString("id-ID");

// Galeri nota contoh. Di desktop dengan gerak aktif, BerandaGerak menggesernya mendatar
// sambil bagian ini dipaku; di HP nota bertumpuk biasa.
export default function GaleriNota() {
  return (
    <div className="galeri" data-galeri>
      <div className="galeri-jalur" data-galeri-jalur>
        {CONTOH.map((c, i) => {
          const r = c.result;
          const fakta = buatFakta(c.form);
          return (
            <article className="g-nota" key={c.id}>
              <p className="g-kepala"><span>NOTA No. {String(i + 1).padStart(2, "0")}</span><span>{c.form.kategori.toUpperCase()}</span></p>
              <h3>{c.form.nama}</h3>
              <p className="g-isian"><span>TULISAN</span>{c.form.keunggulan}</p>
              <p className="g-hasil"><Stabilo text={r.deskripsi_singkat} fakta={fakta} /></p>
              <p className="g-tagar">{r.hashtags.slice(0, 3).join(" ")}</p>
              <p className="g-total"><span>SARAN HARGA</span><b>Rp{ribu(r.harga.min)}–{ribu(r.harga.max)}</b></p>
              <p className="g-cap">CONTOH</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
