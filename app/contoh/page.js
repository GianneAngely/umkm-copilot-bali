import Link from "next/link";
import Icon from "../components/Icon";
import Galeri from "./Galeri";

export const metadata = { title: "Contoh hasil" };

export default function ContohPage() {
  return (
    <>
      <section className="halaman-kepala">
        <div className="wrap duo-57 rata-bawah">
          <div className="kepala">
            <span className="cap">CONTOH HASIL</span>
            <h1 className="judul-1">Seperti ini nota yang sudah disunting.</h1>
          </div>
          <div>
            <p className="kepala-lead">
              Contoh di halaman ini ditulis sebagai ilustrasi dengan format yang sama seperti keluaran Studio. Bukan
              hasil milik pelanggan. Kata yang distabilo berasal dari isian nota.
            </p>
            <Link className="btn btn-utama btn-lg kepala-aksi" href="/studio">Coba dengan produk Anda <Icon name="arrow" /></Link>
          </div>
        </div>
      </section>
      <section className="bagian bagian-rapat">
        <div className="wrap">
          <Galeri />
        </div>
      </section>
    </>
  );
}
