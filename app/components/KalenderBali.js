import { acaraDalamRentang } from "@/lib/hari-raya-bali";

const HARI = 86400000;
const tgl = (s) => new Date(s + "T00:00:00+08:00");
const fmt = (d, o) => d.toLocaleDateString("id-ID", { timeZone: "Asia/Makassar", ...o });

// Garis waktu tiga bulan dari data hari raya terverifikasi (lib/hari-raya-bali.js).
// Tanggal mulai dihitung saat halaman dibangun.
export default function KalenderBali() {
  const mulai = new Date(new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Makassar" }) + "T00:00:00+08:00");
  const selesai = new Date(mulai.getTime() + 90 * HARI);
  const iso = (d) => d.toLocaleDateString("en-CA", { timeZone: "Asia/Makassar" });
  const acara = acaraDalamRentang(iso(mulai), iso(selesai)).filter((a) => a.tanggal);
  const posisi = (s) => ((tgl(s) - mulai) / (selesai - mulai)) * 100;

  const bulan = [];
  for (let d = new Date(mulai); d <= selesai; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    const awal = d < mulai ? mulai : d;
    bulan.push([fmt(awal, { month: "short" }), ((awal - mulai) / (selesai - mulai)) * 100]);
  }

  return (
    <div className="kb">
      <div className="kb-garis" aria-hidden="true">
        <span className="kb-sumbu" data-kb-sumbu />
        {bulan.map(([n, x]) => <span key={n + x} className="kb-bulan" style={{ left: `${x}%` }}>{n}</span>)}
        {acara.map((a) => (
          <i key={a.tanggal + a.nama} className={`kb-titik ${a.jenis}`} style={{ left: `${posisi(a.tanggal)}%` }} data-kb-titik />
        ))}
      </div>
      <ol className="kb-daftar">
        {acara.map((a) => (
          <li key={a.tanggal + a.nama} className={a.jenis} data-kb-item>
            <time dateTime={a.tanggal}>{fmt(tgl(a.tanggal), { day: "numeric", month: "short" })}</time>
            <span>{a.nama}</span>
          </li>
        ))}
      </ol>
      <p className="kb-catat">Hari raya Hindu Bali dan libur nasional {fmt(mulai, { day: "numeric", month: "long" })} sampai {fmt(selesai, { day: "numeric", month: "long", year: "numeric" })}. Sumber: Kalender Pendidikan Provinsi Bali 2026/2027 dan SKB 3 Menteri.</p>
    </div>
  );
}
