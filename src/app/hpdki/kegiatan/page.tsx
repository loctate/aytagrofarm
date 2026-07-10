import Link from "next/link";

import PublicHpdkiActivities from "@/components/hpdki/PublicHpdkiActivities";

export const metadata = {
  title:
    "Kegiatan HPDKI | PAC HPDKI Kecamatan Dramaga",
  description:
    "Dokumentasi kegiatan PAC HPDKI Kecamatan Dramaga, termasuk pendataan anggota, kunjungan kandang, edukasi peternak, dan silaturahmi.",
};

export default function HpdkiKegiatanPage() {
  return (
    <main className="hpdki-kegiatan-page">
      <section className="hpdki-kegiatan-hero">
        <p className="hpdki-kegiatan-eyebrow">
          PAC HPDKI Kecamatan Dramaga
        </p>

        <h1>
          Kegiatan dan Dokumentasi HPDKI Dramaga
        </h1>

        <p>
          Dokumentasi kegiatan PAC HPDKI Kecamatan
          Dramaga, mulai dari pendataan anggota,
          silaturahmi peternak, kunjungan kandang,
          edukasi, hingga aktivitas organisasi lainnya.
        </p>

        <div className="hpdki-kegiatan-actions">
          <Link href="/hpdki">
            Kembali ke HPDKI
          </Link>

          <Link
            href="/hpdki/daftar"
            className="secondary"
          >
            Daftar Anggota
          </Link>
        </div>
      </section>

      <PublicHpdkiActivities />

      <section className="hpdki-kegiatan-cta">
        <div>
          <p>Dokumentasi HPDKI</p>

          <h2>
            Aktivitas dan kebersamaan peternak Dramaga
          </h2>

          <span>
            Dokumentasi ini menjadi bagian dari
            transparansi kegiatan, pembinaan anggota,
            dan pengembangan organisasi peternak di
            Kecamatan Dramaga.
          </span>
        </div>

        <Link href="/hpdki/daftar">
          Daftar Anggota Peternak
        </Link>
      </section>
    </main>
  );
}
