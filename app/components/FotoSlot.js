// Bingkai foto dengan rasio tetap. Foto dari public/foto/<nama>.jpg menutupi ilustrasi
// begitu filenya ada; selama belum ada, ilustrasi SVG dan labelnya yang terlihat.

const GAMBAR = {
  kuliner: (
    <>
      <ellipse cx="100" cy="92" rx="62" ry="14" fill="#e7dccb" />
      <path d="M44 74h112c0 22-25 34-56 34S44 96 44 74z" fill="#fffdf9" />
      <circle cx="78" cy="66" r="15" fill="#d6964a" /><circle cx="78" cy="66" r="10" fill="#f1d491" />
      <circle cx="104" cy="62" r="15" fill="#d6964a" /><circle cx="104" cy="62" r="10" fill="#f1d491" />
      <circle cx="128" cy="68" r="13" fill="#d6964a" /><circle cx="128" cy="68" r="8.5" fill="#f1d491" />
    </>
  ),
  kerajinan: (
    <>
      <path d="M52 56h96l-10 52H62z" fill="#c9a36b" />
      <path d="M58 70h84M60 82h80M62 94h76" stroke="#a7834f" strokeWidth="4" />
      <path d="M72 56v52M88 56v52M104 56v52M120 56v52M134 56l-4 52" stroke="#b8925a" strokeWidth="3" />
      <path d="M76 56c0-22 48-22 48 0" fill="none" stroke="#8a6a3c" strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  fesyen: (
    <>
      <path d="M100 30v8M86 44c0-10 28-10 28 0l42 22-6 10-14-6v44H64V70l-14 6-6-10z" fill="#3e6fb0" />
      <path d="M64 82h72M64 96h72" stroke="#fffdf9" strokeWidth="5" opacity=".7" />
      <path d="M86 44c0 8 28 8 28 0" fill="none" stroke="#2c5490" strokeWidth="3" />
    </>
  ),
  "oleh-oleh": (
    <>
      <rect x="56" y="56" width="88" height="54" rx="3" fill="#2f6a3f" />
      <rect x="52" y="46" width="96" height="16" rx="3" fill="#24532f" />
      <rect x="94" y="46" width="12" height="64" fill="#f7dc6f" />
      <path d="M100 46c-10-16-28-10-20 0M100 46c10-16 28-10 20 0" fill="none" stroke="#f7dc6f" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  pasar: (
    <>
      <path d="M30 50h140l-8 14H38z" fill="#c43a2c" />
      <path d="M44 50l8 14M68 50l6 14M92 50l4 14M116 50l2 14M140 50v14" stroke="#fffdf9" strokeWidth="5" />
      <rect x="40" y="64" width="120" height="44" fill="#e7dccb" />
      <rect x="52" y="78" width="26" height="18" fill="#2f6a3f" /><rect x="86" y="74" width="28" height="22" fill="#d6964a" /><rect x="122" y="80" width="26" height="16" fill="#3e6fb0" />
    </>
  ),
};

export default function FotoSlot({ nama, label, rasio = "16 / 10", className = "" }) {
  return (
    <div className={`foto-slot foto-${nama} ${className}`} style={{ aspectRatio: rasio }}>
      <svg viewBox="0 0 200 125" preserveAspectRatio="xMidYMid meet" aria-hidden="true">{GAMBAR[nama] || GAMBAR.pasar}</svg>
      <span className="foto-label">{label}</span>
      <span className="foto-isi" style={{ backgroundImage: `url(/foto/${nama}.jpg)` }} role="img" aria-label={label} />
    </div>
  );
}
