// Grafik kecil buatan sendiri. Semua angka berasal dari isian, hasil AI, atau riwayat di peramban; tidak ada data contoh.

const rp = (n) => "Rp" + Math.round(n).toLocaleString("id-ID");
const persen = (n) => Math.round(n).toLocaleString("id-ID") + "%";

// Batang bertumpuk modal | margin untuk harga terendah dan tertinggi.
export function GrafikHarga({ modal, min, max }) {
  const m = Number(modal) > 0 ? Number(modal) : 0;
  const atas = m ? Math.max(max, m) * 1.04 : max * 1.02;
  const lebar = (n) => `${Math.max(0, (n / atas) * 100)}%`;

  if (!m) {
    return (
      <figure className="gr gr-harga" aria-label={`Rentang harga jual ${rp(min)} sampai ${rp(max)}. Modal tidak diisi.`}>
        <div className="gr-rentang" aria-hidden="true">
          <span className="gr-rentang-isi" style={{ left: lebar(min), width: lebar(max - min) }} />
          <i style={{ left: lebar(min) }} /><i style={{ left: lebar(max) }} />
        </div>
        <div className="gr-sumbu" aria-hidden="true"><span>Rp0</span><span>{rp(max)}</span></div>
        <figcaption>Rentang harga jual {rp(min)} sampai {rp(max)}. Isi modal untuk melihat besar margin.</figcaption>
      </figure>
    );
  }

  const baris = [["Terendah", min], ["Tertinggi", max]];
  return (
    <figure className="gr gr-harga" aria-label={`Modal ${rp(m)}. ${baris.map(([l, h]) => `Harga ${l.toLowerCase()} ${rp(h)}, margin ${persen(((h - m) / m) * 100)}`).join(". ")}.`}>
      {baris.map(([label, harga], i) => {
        const margin = harga - m;
        return (
          <div className="gr-baris" key={label} aria-hidden="true">
            <span className="gr-label">{label}</span>
            <div className="gr-batang">
              <span className="gr-isi gr-modal" style={{ width: lebar(Math.min(m, harga)), "--i": i }}>modal</span>
              {margin > 0 && <span className="gr-isi gr-margin" style={{ width: lebar(margin), "--i": i + 0.4 }}>+{persen((margin / m) * 100)}</span>}
              <i className="gr-penanda" style={{ left: lebar(harga) }} />
            </div>
            <span className="gr-nilai">{rp(harga)}</span>
          </div>
        );
      })}
      <figcaption>
        <span><i className="gr-kunci gr-modal" />Modal {rp(m)}</span>
        <span><i className="gr-kunci gr-margin" />Margin {persen(((min - m) / m) * 100)} sampai {persen(((max - m) / m) * 100)}</span>
      </figcaption>
    </figure>
  );
}

// Meter panjang terhadap batas nyata (misalnya caption Instagram 2.200 karakter).
export function MeterTeks({ label, nilai, batas, satuan }) {
  const p = Math.min(100, (nilai / batas) * 100);
  const lewat = nilai > batas;
  return (
    <div className={`gr-meter${lewat ? " lewat" : ""}`} role="meter" aria-valuenow={nilai} aria-valuemin={0} aria-valuemax={batas} aria-label={`${label}: ${nilai} dari batas ${batas} ${satuan}`}>
      <p><span>{label}</span><b>{nilai.toLocaleString("id-ID")} / {batas.toLocaleString("id-ID")} {satuan}</b></p>
      <span className="gr-garis" aria-hidden="true"><span className="gr-isi" style={{ width: `${Math.max(p, 1.5)}%` }} /></span>
    </div>
  );
}

// Dua batang: fakta yang dipakai dibanding klaim yang dicoret.
export function BatangSuntingan({ fakta, klaim }) {
  const atas = Math.max(fakta, klaim, 1);
  return (
    <figure className="gr gr-sunting" aria-label={`${fakta} fakta dipakai, ${klaim} klaim dicoret`}>
      {[["Fakta dipakai", fakta, "gr-fakta"], ["Klaim dicoret", klaim, "gr-klaim"]].map(([l, n, k], i) => (
        <div className="gr-baris" key={l} aria-hidden="true">
          <span className="gr-label">{l}</span>
          <div className="gr-batang tipis"><span className={`gr-isi ${k}`} style={{ width: `${n ? (n / atas) * 100 : 0}%`, "--i": i }} /></div>
          <span className="gr-nilai">{n}</span>
        </div>
      ))}
    </figure>
  );
}

// Meter setengah lingkaran untuk nilai 1–10 dari AI.
export function MeterSkor({ nilai }) {
  const n = Math.max(0, Math.min(10, Number(nilai) || 0));
  const kelas = n >= 8 ? "baik" : n >= 5 ? "cukup" : "kurang";
  return (
    <figure className={`gr-skor ${kelas}`} aria-label={`Nilai foto asli ${n} dari 10`}>
      <svg viewBox="0 0 120 68" aria-hidden="true">
        <path d="M10 62a50 50 0 0 1 100 0" pathLength="10" className="gr-skor-latar" />
        <path d="M10 62a50 50 0 0 1 100 0" pathLength="10" className="gr-skor-isi" style={{ strokeDasharray: `${n} 10` }} />
      </svg>
      <figcaption><b>{n}</b>/10</figcaption>
    </figure>
  );
}

// Dasbor kecil dari riwayat di peramban.
export function DasborRiwayat({ jumlah, perKategori, fakta, klaim }) {
  const atas = Math.max(1, ...perKategori.map(([, n]) => n));
  return (
    <section className="dasbor" aria-label="Ringkasan riwayat">
      <div className="dasbor-angka">
        <p><b>{jumlah}</b><span>tulisan dibuat</span></p>
        <p><b>{fakta}</b><span>fakta dari isian dipakai</span></p>
        <p><b>{klaim}</b><span>klaim kosong dicoret</span></p>
      </div>
      <figure className="gr" aria-label={`Sebaran per kategori: ${perKategori.map(([k, n]) => `${k} ${n}`).join(", ")}`}>
        <p className="dasbor-judul">Sebaran per kategori</p>
        {perKategori.map(([k, n], i) => (
          <div className="gr-baris" key={k} aria-hidden="true">
            <span className="gr-label">{k}</span>
            <div className="gr-batang tipis"><span className="gr-isi gr-fakta" style={{ width: `${(n / atas) * 100}%`, "--i": i * 0.3 }} /></div>
            <span className="gr-nilai">{n}</span>
          </div>
        ))}
      </figure>
      <p className="dasbor-catat">Dihitung dari lima tulisan terakhir yang tersimpan di peramban ini.</p>
    </section>
  );
}
