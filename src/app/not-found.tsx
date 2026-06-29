import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <Image
          src="/images/ayt-logo-mark.png"
          alt="Logo AYT Agro Farm"
          width={92}
          height={92}
          priority
        />
        <span>404</span>
        <h1>Halaman tidak ditemukan</h1>
        <p>Alamat yang Anda buka tidak tersedia atau sudah berubah.</p>
        <Link className="button button-primary" href="/">
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
