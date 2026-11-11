"use client";

import { useState } from "react";
import f from "./fitur.module.css";
import s from "./profil.module.css";
import { mintaJson } from "../../../lib/klien";

const BATAS_BIO = 150;

function Salin({ teks, label = "Salin" }) {
  const [ok, setOk] = useState(false);
  async function salin() {
    try {
      await navigator.clipboard.writeText(teks);
      setOk(true);
      setTimeout(() => setOk(false), 1500);
    } catch {}
  }
  return (
    <button type="button" className={s.salin} onClick={salin}>
      {ok ? "Tersalin" : label}
    </button>
  );
}

function inisial(nama) {
  return (
    String(nama || "?")
      .split(/[\s·._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((k) => k[0])
      .join("")
      .toUpperCase() || "?"
  );
}

/**
 * Profil Instagram toko: AI menyusun nama profil, username, tiga versi bio (maks 150 karakter),
 * kategori akun, sorotan, dan ide tiga postingan pertama, lalu ditampilkan dalam pratinjau profil.
 * Props: produk { nama, kategori, keunggulan, target }, foto (URL opsional, misalnya hasil Foto Studio).
 */
export default function ProfilInstagram({ produk, foto }) {
  const [toko, setToko] = useState({ nama: "", kota: "" });
  const [memuat, setMemuat] = useState(false);
  const [error, setError] = useState("");
  const [contoh, setContoh] = useState(null);
  const [data, setData] = useState(null);
  const [versi, setVersi] = useState(0);
  const [username, setUsername] = useState(0);

  async function susun(e) {
    e.preventDefault();
    setMemuat(true);
    setError("");
    setContoh(null);
    try {
      setData(await mintaJson("/api/profil", { produk, toko }));
      setVersi(0);
      setUsername(0);
    } catch (err) {
      setError(err.message);
      setContoh(err.contoh || null);
    } finally {
      setMemuat(false);
    }
  }

  const r = data?.result;
  const bio = r?.bio[versi] || r?.bio[0];
  const ide = r?.postingan_pertama || [];

  return (
    <div className={s.profil}>
      <form className={s.kepala} onSubmit={susun}>
        <div className={s.judulBlok}>
          <p className={f.label}>Profil Instagram toko</p>
          <p className={f.bantu}>Nama profil, username, bio maksimal 150 karakter, sorotan, dan ide postingan pertama.</p>
        </div>
        <label className={s.isian}>
          <span>Nama toko <em>(opsional)</em></span>
          <input value={toko.nama} maxLength={60} placeholder={produk?.nama || "Contoh: Dapur Bu Made"}
            onChange={(e) => setToko({ ...toko, nama: e.target.value })} />
        </label>
        <label className={s.isian}>
          <span>Kota atau daerah <em>(opsional)</em></span>
          <input value={toko.kota} maxLength={60} placeholder="Contoh: Gianyar"
            onChange={(e) => setToko({ ...toko, kota: e.target.value })} />
        </label>
        <button type="submit" className={f.tombol} disabled={memuat || !produk?.nama}>
          {memuat ? "Menyusun..." : r ? "Susun ulang" : "Susun profil"}
        </button>
      </form>

      <div aria-live="polite">
        {memuat && (
          <p className={f.status} role="status">
            <span className={f.spinner} aria-hidden="true" /> Sedang menyusun profil...
          </p>
        )}
        {error && <p className={f.error} role="alert">{error}</p>}
        {contoh && (
          <button type="button" className={f.tombolGaris} onClick={() => { setData({ mode: "mock", result: contoh }); setError(""); setContoh(null); }}>
            Lihat contoh profil (Contoh)
          </button>
        )}
      </div>

      {r && (
        <>
          {data.mode === "mock" && (
            <p className={f.catatanContoh}>
              <strong>Mode contoh.</strong> API key belum dipasang, jadi profil di bawah adalah template statis.
            </p>
          )}
          <div className={s.isi}>
            {/* Pratinjau dengan tata letak mirip profil Instagram, tanpa logo atau aset resmi. */}
            <section className={s.hp} aria-label="Pratinjau profil Instagram">
              <p className={s.hpAtas}>
                <span>{r.saran_username[username]}</span>
              </p>
              <div className={s.hpProfil}>
                <div className={s.avatar}>
                  {foto ? <img src={foto} alt="" /> : <span>{inisial(r.nama_profil)}</span>}
                </div>
                <dl className={s.angka}>
                  <div><dt>Postingan</dt><dd>3</dd></div>
                  <div><dt>Pengikut</dt><dd>0</dd></div>
                  <div><dt>Mengikuti</dt><dd>0</dd></div>
                </dl>
              </div>
              <p className={s.hpNama}>{r.nama_profil}</p>
              {r.kategori_akun && <p className={s.hpKategori}>{r.kategori_akun}</p>}
              <p className={s.hpBio}>{bio?.teks}</p>
              <ul className={s.sorotan}>
                {r.sorotan.map((h) => (
                  <li key={h.nama}>
                    <span className={s.sorotanBulat} aria-hidden="true">{h.ikon || "•"}</span>
                    <span className={s.sorotanNama}>{h.nama}</span>
                  </li>
                ))}
              </ul>
              <div className={s.grid}>
                <div className={s.petak}>
                  {foto ? <img src={foto} alt="Foto produk" /> : <span className={s.petakIde}>{ide[0]?.judul}</span>}
                </div>
                {ide.slice(1, 3).map((p) => (
                  <div key={p.judul} className={s.petak}>
                    <span className={s.petakIde}>{p.judul}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className={s.bagian} aria-label="Isi profil untuk disalin">
              <div className={s.kartu}>
                <div className={s.kartuKepala}>
                  <p className={f.label}>Nama profil</p>
                  <Salin teks={r.nama_profil} />
                </div>
                <p className={s.nilai}>{r.nama_profil} <small>{r.nama_profil.length}/30</small></p>
              </div>

              <div className={s.kartu}>
                <div className={s.kartuKepala}>
                  <p className={f.label}>Saran username</p>
                  <Salin teks={r.saran_username[username]} />
                </div>
                <div className={s.pilihan} role="radiogroup" aria-label="Pilih username">
                  {r.saran_username.map((u, i) => (
                    <button key={u} type="button" role="radio" aria-checked={username === i}
                      className={username === i ? s.pilihAktif : s.pilih} onClick={() => setUsername(i)}>
                      @{u}
                    </button>
                  ))}
                </div>
                <p className={s.catatan}>Ketersediaan username belum dicek. Coba dulu di Instagram sebelum dipakai.</p>
              </div>

              <div className={s.kartu}>
                <div className={s.kartuKepala}>
                  <p className={f.label}>Bio</p>
                  <Salin teks={bio?.teks || ""} />
                </div>
                <div className={s.pilihan} role="radiogroup" aria-label="Pilih versi bio">
                  {r.bio.map((b, i) => (
                    <button key={i} type="button" role="radio" aria-checked={versi === i}
                      className={versi === i ? s.pilihAktif : s.pilih} onClick={() => setVersi(i)}>
                      {b.judul}
                    </button>
                  ))}
                </div>
                <p className={s.bio}>{bio?.teks}</p>
                <p className={(bio?.teks.length || 0) > BATAS_BIO ? s.hitungLewat : s.hitung}>
                  {bio?.teks.length || 0}/{BATAS_BIO} karakter
                </p>
              </div>

              <div className={s.kartu}>
                <div className={s.kartuKepala}>
                  <p className={f.label}>Kategori akun</p>
                  <Salin teks={r.kategori_akun} />
                </div>
                <p className={s.nilai}>{r.kategori_akun}</p>
              </div>

              <div className={s.kartu}>
                <div className={s.kartuKepala}>
                  <p className={f.label}>Sorotan (Story Highlight)</p>
                  <Salin teks={r.sorotan.map((h) => `${h.ikon} ${h.nama}`.trim()).join("\n")} />
                </div>
                <p className={s.nilai}>{r.sorotan.map((h) => `${h.ikon} ${h.nama}`.trim()).join(" · ")}</p>
              </div>

              <div className={s.kartu}>
                <div className={s.kartuKepala}>
                  <p className={f.label}>Tiga postingan pertama</p>
                  <Salin teks={ide.map((p, i) => `${i + 1}. ${p.judul}: ${p.ide}`).join("\n")} />
                </div>
                <ol className={s.daftar}>
                  {ide.map((p) => <li key={p.judul}><strong>{p.judul}.</strong> {p.ide}</li>)}
                </ol>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
