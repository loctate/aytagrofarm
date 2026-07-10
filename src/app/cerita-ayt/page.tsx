import Link from "next/link";

import PublicAytActivities from "@/components/ayt/PublicAytActivities";

export const metadata = {
  title: "Cerita AYT | AYT Agro Farm",
  description:
    "Dokumentasi kegiatan, aktivitas kandang, breeding, fattening, perdagangan, produk, dan perkembangan AYT Agro Farm.",
};

export default function CeritaAytPage() {
  return (
    <main className="hpdki-kegiatan-page">
      <section className="hpdki-kegiatan-hero">
        <p className="hpdki-kegiatan-eyebrow">
          Cerita AYT Agro Farm
        </p>

        <h1>
          Dokumentasi dan Aktivitas AYT Agro Farm
        </h1>

        <p>
          Dokumentasi kegiatan farm, aktivitas kandang,
          breeding, fattening, perdagangan, produk hilir,
          dan perkembangan AYT Agro Farm dari waktu ke
          waktu.
        </p>

        <div className="hpdki-kegiatan-actions">
          <Link href="/">
            Kembali ke Beranda
          </Link>

          <Link
            href="/produk"
            className="secondary"
          >
            Lihat Produk
          </Link>
        </div>
      </section>

      <PublicAytActivities />

      <section className="hpdki-kegiatan-cta">
        <div>
          <p>Dokumentasi AYT</p>

          <h2>
            Perjalanan dan aktivitas AYT Agro Farm
          </h2>

          <span>
            Dokumentasi ini menampilkan aktivitas
            peternakan, pengembangan ternak, kegiatan
            kandang, dan pelayanan AYT Agro Farm.
          </span>
        </div>

        <Link href="/produk">
          Lihat Produk AYT
        </Link>
      </section>
    </main>
  );
}
