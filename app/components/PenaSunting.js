// Tampilan saat menunggu: isian pengguna disunting pena merah baris demi baris,
// lalu struk mulai tercetak. Animasi ini menjelaskan proses, bukan hiasan.

export default function PenaSunting({ form }) {
  const baris = [
    form.nama,
    ...String(form.keunggulan || "").split(/[,;\n]/),
    form.modal ? `modal Rp${Number(form.modal).toLocaleString("id-ID")}` : "",
  ]
    .map((b) => b.trim())
    .filter(Boolean)
    .slice(0, 5);

  return (
    <div className="sunting" role="status">
      <p className="sunting-status">
        <span className="spinner" aria-hidden="true" />
        Pena merah sedang menyunting nota Anda...
      </p>
      <div className="kertas sunting-nota" aria-hidden="true">
        {baris.map((b, i) => (
          <p className="sunting-baris" key={i} style={{ "--i": i }}>
            <span>{b}</span>
            <i className="sunting-garis" />
          </p>
        ))}
        <svg className="sunting-pena" viewBox="0 0 160 28">
          <rect x="22" y="6" width="104" height="16" rx="3" fill="#c43a2c" />
          <rect x="96" y="6" width="44" height="16" rx="3" fill="#a52f23" />
          <path d="M22 6 L4 14 L22 22 Z" fill="#e9d9bf" />
          <path d="M4 14 L10 11.3 L10 16.7 Z" fill="#1f1a15" />
        </svg>
      </div>
      <div className="kertas sunting-struk" aria-hidden="true">
        <span className="bar bar-judul" />
        <span className="bar" />
        <span className="bar" />
        <span className="bar bar-pendek" />
      </div>
    </div>
  );
}
