// Panggilan API dari browser dengan cache sessionStorage: isian yang persis sama tidak memanggil AI lagi.
const AWALAN = "wicara-cache:";

export class GalatApi extends Error {
  constructor(message, contoh) {
    super(message);
    this.contoh = contoh;
  }
}

export async function mintaJson(url, body) {
  const kunci = AWALAN + url + ":" + JSON.stringify(body);
  try {
    const simpan = sessionStorage.getItem(kunci);
    if (simpan) return JSON.parse(simpan);
  } catch {}
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new GalatApi(json.error || "Terjadi kesalahan. Coba lagi.", json.contoh);
  try {
    sessionStorage.setItem(kunci, JSON.stringify(json));
  } catch {}
  return json;
}
