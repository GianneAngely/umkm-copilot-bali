// Menandai kata di hasil yang asalnya dari isian pengguna. Murni tampilan:
// isian dicocokkan ke teks hasil di sisi klien, API tidak diubah.

function escape(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buatFakta(form) {
  if (!form) return [];
  const fakta = [form.nama, form.kategori];
  for (const bagian of String(form.keunggulan || "").split(/[,;.\n]|\sdan\s/i)) {
    fakta.push(bagian);
  }
  const modal = Number(form.modal);
  if (modal > 0) {
    const titik = Math.round(modal).toLocaleString("id-ID");
    fakta.push("Rp" + titik, "Rp " + titik, titik);
  }
  const bersih = fakta.map((f) => String(f || "").trim()).filter((f) => f.length >= 3);
  // Frasa panjang dicocokkan lebih dulu supaya tidak terpotong frasa pendek.
  return [...new Set(bersih)].sort((a, b) => b.length - a.length);
}

export function Stabilo({ text, fakta }) {
  if (!fakta?.length || !text) return text;
  const pola = new RegExp(`(${fakta.map(escape).join("|")})`, "gi");
  const potong = text.split(pola);
  return potong.map((p, i) =>
    i % 2 === 1 ? <mark className="stabilo" key={i}>{p}</mark> : p,
  );
}

export function hitungFakta(teks, fakta) {
  if (!fakta?.length) return 0;
  const pola = new RegExp(fakta.map(escape).join("|"), "gi");
  return teks.reduce((n, t) => n + (String(t).match(pola)?.length || 0), 0);
}
