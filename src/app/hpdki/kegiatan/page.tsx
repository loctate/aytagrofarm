import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kegiatan PAC HPDKI Dramaga",
  description:
    "Dokumentasi kegiatan PAC HPDKI Kecamatan Dramaga Kabupaten Bogor.",
  alternates: {
    canonical: "/hpdki/kegiatan",
  },
};

const activityPlans = [
  "Dokumentasi pendataan anggota",
  "Pertemuan dan koordinasi pengurus",
  "Edukasi peternakan dan kesehatan ternak",
  "Kegiatan lapangan bersama anggota",
];

export default function HpdkiActivitiesPage() {
  return (
    <main className="hpdki-hub-page">
      <section className="hpdki-hub-hero hpdki-activities-hero">
        <div className="container">
          <div className="hpdki-hub-section-heading">
            <Link href="/hpdki" className="hpdki-hub-back-link">
              ← Kembali ke halaman HPDKI
            </Link>

            <p className="eyebrow">Kegiatan HPDKI</p>

            <h1 className="hpdki-activities-title">
              Dokumentasi kegiatan PAC HPDKI Dramaga.
            </h1>

            <p>
              Halaman ini disiapkan untuk menampilkan kegiatan yang sudah
              terlaksana. Konten kegiatan bisa ditambahkan bertahap setelah
              struktur admin siap.
            </p>
          </div>

          <div className="hpdki-activities-placeholder">
            {activityPlans.map((item, index) => (
              <article key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{item}</h2>
                <p>Konten kegiatan akan ditambahkan pada tahap berikutnya.</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
