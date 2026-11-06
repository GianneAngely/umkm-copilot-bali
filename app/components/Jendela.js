// Bingkai jendela aplikasi (ala peramban) untuk memamerkan layar Studio.

export function Jendela({ alamat = "umkmcopilot.id/studio", demo = false, className = "", children }) {
  return (
    <div className={`jendela ${className}`} aria-hidden={className.includes("jendela-cerita") || undefined}>
      <div className="jendela-bar" aria-hidden="true">
        <span className="jendela-titik"><i /><i /><i /></span>
        <span className="jendela-alamat">{alamat}</span>
        <span className="jendela-ruang">{demo && <span className="jendela-demo"><i />Demo langsung</span>}</span>
      </div>
      <div className="jendela-isi">{children}</div>
    </div>
  );
}
