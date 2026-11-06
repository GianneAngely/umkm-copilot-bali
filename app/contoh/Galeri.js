"use client";

import { useState } from "react";
import FotoSlot from "../components/FotoSlot";
import { Stabilo, buatFakta } from "../components/Stabilo";
import { CopyButton, rupiah } from "../components/Struk";
import { CONTOH, FILTER } from "../data/contoh";

function Kartu({ c }) {
  const r = c.result;
  const fakta = buatFakta(c.form);
  const captionFull = `${r.caption}\n\n${r.hashtags.join(" ")}`;
  const hargaText = `${rupiah(r.harga.min)} – ${rupiah(r.harga.max)}\n${r.harga.alasan}`;
  const englishText = `${r.english.description}\n\n${r.english.caption}`;
  return (
    <article className="kartu contoh">
      <div className="contoh-kiri">
        <FotoSlot nama={c.foto} label={`Foto ${c.form.nama} menyusul`} />
        <div className="contoh-nota">
          <p className="nota-judul"><span>NOTA PRODUK</span><span className="cap cap-kecil">CONTOH</span></p>
          <h2>{c.form.nama}</h2>
          <dl className="contoh-isian">
            <div><dt>Kategori</dt><dd>{c.form.kategori}</dd></div>
            <div><dt>Modal</dt><dd>{rupiah(c.form.modal)}</dd></div>
            <div><dt>Pembeli</dt><dd>{c.form.target === "turis" ? "Wisatawan" : "Warga lokal"}</dd></div>
            <div className="penuh"><dt>Keunggulan</dt><dd>{c.form.keunggulan}</dd></div>
          </dl>
        </div>
      </div>
      <div className="contoh-kanan">
        <div className="contoh-baris">
          <div className="struk-head"><h3>DESKRIPSI</h3><CopyButton text={r.deskripsi_singkat} /></div>
          <p className="body"><Stabilo text={r.deskripsi_singkat} fakta={fakta} /></p>
        </div>
        <div className="contoh-baris">
          <div className="struk-head"><h3>CAPTION + HASHTAG</h3><CopyButton text={captionFull} /></div>
          <p className="body"><Stabilo text={r.caption} fakta={fakta} /></p>
          <ul className="chips">{r.hashtags.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        <div className="contoh-duo">
          <div className="contoh-baris">
            <div className="struk-head"><h3>HARGA</h3><CopyButton text={hargaText} /></div>
            <p className="price">{rupiah(r.harga.min)} – {rupiah(r.harga.max)}</p>
            <p className="body body-kecil"><Stabilo text={r.harga.alasan} fakta={fakta} /></p>
          </div>
          <div className="contoh-baris">
            <div className="struk-head"><h3>ENGLISH</h3><CopyButton text={englishText} /></div>
            <p className="body body-kecil" lang="en">{r.english.description}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Galeri() {
  const [pilih, setPilih] = useState("Semua");
  const tampil = CONTOH.filter((c) => pilih === "Semua" || c.form.kategori === pilih);
  return (
    <>
      <div className="filter" role="group" aria-label="Saring menurut kategori">
        {FILTER.map((f) => {
          const n = f === "Semua" ? CONTOH.length : CONTOH.filter((c) => c.form.kategori === f).length;
          return (
            <button key={f} type="button" aria-pressed={pilih === f} onClick={() => setPilih(f)}>
              {f} <span>{n}</span>
            </button>
          );
        })}
      </div>
      <div className="galeri" aria-live="polite">
        {tampil.length > 0 ? (
          tampil.map((c) => <Kartu c={c} key={c.id} />)
        ) : (
          <div className="kartu galeri-kosong">
            <p className="kosong-judul">Contoh {pilih.toLowerCase()} sedang disiapkan.</p>
            <p className="kosong-teks">Sementara itu, coba tulis nota produk Anda sendiri di Studio.</p>
          </div>
        )}
      </div>
    </>
  );
}
