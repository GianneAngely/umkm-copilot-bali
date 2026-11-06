// Ornamen garis tipis bermotif Bali, digambar sendiri. Hanya pola daun dan geometri tenun,
// tanpa simbol sakral. Dipakai hemat: sudut nota, pembatas band, strip di kaki halaman.

export function Patra({ className = "" }) {
  return (
    <svg className={`ornamen ${className}`} viewBox="0 0 120 120" aria-hidden="true" data-ornamen>
      <path d="M6 114 C 6 60, 30 30, 70 18 C 92 12, 108 14, 114 6" />
      <path d="M22 86 C 30 70, 46 62, 58 66 C 66 69, 64 80, 55 80 C 48 80, 47 72, 52 70" />
      <path d="M44 52 C 52 40, 66 34, 78 38 C 86 41, 84 51, 76 50 C 70 49, 70 43, 74 42" />
      <path d="M10 70 C 16 66, 20 58, 18 50" />
      <path d="M76 26 C 84 30, 92 30, 98 26" />
    </svg>
  );
}

export function Sulur({ className = "" }) {
  return (
    <svg className={`ornamen ${className}`} viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true" data-ornamen>
      <path d="M0 12 H150 C 165 12, 170 3, 182 3 C 192 3, 194 12, 200 12 C 206 12, 208 21, 218 21 C 230 21, 235 12, 250 12 H400" />
      <path d="M182 3 C 178 8, 182 12, 188 10 M218 21 C 222 16, 218 12, 212 14" />
    </svg>
  );
}

// Strip motif ikat: belah ketupat berulang, dibuat dengan pola SVG.
export function StripIkat({ className = "" }) {
  return (
    <svg className={`ornamen strip-ikat ${className}`} width="100%" height="14" aria-hidden="true">
      <defs>
        <pattern id="ikat" width="28" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 7 L7 0 L14 7 L7 14 Z M14 7 L21 0 L28 7 L21 14 Z" fill="none" />
          <path d="M5 7 L7 5 L9 7 L7 9 Z" />
        </pattern>
      </defs>
      <rect width="100%" height="14" fill="url(#ikat)" />
    </svg>
  );
}
