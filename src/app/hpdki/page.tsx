import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import PublicMembersList from "@/components/hpdki/PublicMembersList";

export const metadata: Metadata = {
  title: "PAC HPDKI Kecamatan Dramaga Kabupaten Bogor",
  description:
    "Halaman resmi PAC HPDKI Kecamatan Dramaga Kabupaten Bogor untuk profil organisasi, pendaftaran anggota, kegiatan, daftar anggota terverifikasi, dan verifikasi KTA.",
  alternates: {
    canonical: "/hpdki",
  },
};

const navItems = [
  {
    title: "Profil",
    description: "Tentang PAC HPDKI Dramaga",
    href: "#profil",
    icon: "▤",
  },
  {
    title: "Struktur Pengurus",
    description: "Susunan pengurus 2025–2030",
    href: "/hpdki/pengurus",
    icon: "♜",
  },
  {
    title: "Anggota",
    description: "Daftar anggota terverifikasi",
    href: "/hpdki/anggota",
    icon: "♙",
  },
  {
    title: "Produk",
    description: "Katalog produk peternakan",
    href: "/hpdki/produk",
    icon: "◆",
  },
  {
    title: "Verifikasi KTA",
    description: "Cek nomor anggota",
    href: "/hpdki/verifikasi",
    icon: "▣",
  },
  {
    title: "Dokumentasi Kegiatan",
    description: "",
    href: "/hpdki/kegiatan",
    icon: "▦",
  },
];

const focusItems = [
  {
    title: "Pendataan Anggota",
    description:
      "Merapikan data peternak domba dan kambing agar lebih mudah dikelola, diverifikasi, dan diterbitkan KTA.",
  },
  {
    title: "Kebersamaan Peternak",
    description:
      "Menjadi wadah saling mengenal, saling membantu, dan berbagi pengalaman antarpeternak.",
  },
  {
    title: "Kegiatan Organisasi",
    description:
      "Menyiapkan ruang dokumentasi untuk kegiatan PAC HPDKI Dramaga yang sudah terlaksana.",
  },
];

const activityItems = [
  "Pendataan dan pelayanan anggota",
  "Silaturahmi dan koordinasi organisasi",
  "Edukasi peternakan dan kegiatan lapangan",
];

export default function HpdkiPage() {
  return (
    <main className="hpdki-locked-page">
      <section className="hpdki-locked-hero">
        <div className="container">
          <Link href="/" className="hpdki-locked-back">
            ← Kembali ke AYT Agro Farm
          </Link>

          <div className="hpdki-locked-hero-card">
            <Image
              src="/images/hpdki-pac-logo.png"
              alt="Logo HPDKI PAC Dramaga"
              width={360}
              height={190}
              priority
              className="hpdki-locked-logo"
            />

            <p className="hpdki-locked-badge">
              PAC HPDKI Kecamatan Dramaga
            </p>

            <div className="hpdki-locked-divider" aria-hidden="true">
              <span />
            </div>

            <h1>
              Himpunan Peternak Domba Kambing Indonesia
              <span>tingkat Pengurus Anak Cabang Kecamatan Dramaga.</span>
            </h1>

            <p className="hpdki-locked-description">
              Halaman resmi PAC HPDKI Kecamatan Dramaga, Kabupaten Bogor untuk
              profil organisasi, pendaftaran anggota, kegiatan, daftar anggota
              terverifikasi, dan verifikasi KTA.
            </p>

            <nav className="hpdki-locked-nav" aria-label="Menu HPDKI">
              {navItems.map((item) => (
                <Link key={item.title} href={item.href}>
<strong>{item.title}</strong>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </section>

      <section id="profil" className="hpdki-locked-section">
        <div className="container hpdki-locked-two-col">
          <div className="hpdki-locked-section-copy">
            <p className="hpdki-locked-small-badge">Profil Singkat</p>
            <h2>Pendataan yang rapi, komunitas yang saling menguatkan.</h2>
          </div>

          <div className="hpdki-locked-panel">
            <p>
              PAC HPDKI Kecamatan Dramaga menjadi wadah bagi peternak domba dan
              kambing untuk saling mengenal, bertukar informasi, memperkuat
              pendataan anggota, dan mendukung kegiatan yang bermanfaat bagi
              peternak lokal.
            </p>

            <div className="hpdki-locked-stats">
              <div>
                <strong>PAC</strong>
                <span>Tingkat Organisasi</span>
              </div>

              <div>
                <strong>Dramaga</strong>
                <span>Wilayah Kecamatan</span>
              </div>

              <div>
                <strong>Bogor</strong>
                <span>Kabupaten</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hpdki-locked-section hpdki-locked-soft-section">
        <div className="container">
          <div className="hpdki-locked-section-heading">
            <p className="hpdki-locked-small-badge">Fokus Organisasi</p>
            <h2>Sederhana, rapi, dan bermanfaat.</h2>
          </div>

          <div className="hpdki-locked-focus-grid">
            {focusItems.map((item, index) => (
              <article key={item.title} className="hpdki-locked-focus-card">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hpdki-locked-section">
        <div className="container hpdki-locked-two-col">
          <div className="hpdki-locked-section-copy">
            <p className="hpdki-locked-small-badge">Kegiatan HPDKI</p>
            <h2>Dokumentasi kegiatan PAC HPDKI Dramaga.</h2>
            <p>
              Temukan berbagai kegiatan PAC HPDKI Kecamatan Dramaga, mulai
              dari pendataan anggota, pertemuan pengurus, edukasi peternakan,
              hingga kegiatan lapangan.
            </p>

            <Link href="/hpdki/kegiatan" className="hpdki-locked-secondary">
              Lihat Dokumentasi Kegiatan
            </Link>
          </div>

          <div className="hpdki-locked-panel">
            <h3>Ruang Kegiatan HPDKI</h3>
            <p>Dokumentasi kegiatan organisasi ditampilkan setelah
              dipublikasikan oleh pengelola.</p>

            <ul className="hpdki-locked-list">
              {activityItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="hpdki-locked-section hpdki-locked-members-section">
        <div className="container">
          <div className="hpdki-locked-members-head">
            <div className="hpdki-locked-section-copy">
              <p className="hpdki-locked-small-badge">Anggota Terverifikasi</p>
              <h2>Daftar anggota aktif PAC HPDKI Dramaga.</h2>
              <p>
                Data publik hanya menampilkan informasi umum anggota yang sudah
                divalidasi admin.
              </p>
            </div>

          <Link href="/hpdki/anggota" className="hpdki-locked-secondary">
              Lihat Semua Anggota
            </Link>
          </div>

          <div className="hpdki-locked-members-card">
            <PublicMembersList variant="compact" limit={6} />
          </div>
        </div>
      </section>

      <section className="hpdki-locked-cta-section">
        <div className="container">
          <div className="hpdki-locked-cta">
            <div>
              <p className="hpdki-locked-small-badge">Pendaftaran Anggota</p>
              <h2>Siap bergabung bersama PAC HPDKI Dramaga?</h2>
              <p>
                Isi formulir pendaftaran untuk masuk ke proses pendataan dan
                validasi calon anggota.
              </p>
            </div>

            <Link href="/hpdki/daftar" className="hpdki-locked-primary">
              Buka Formulir Pendaftaran
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
