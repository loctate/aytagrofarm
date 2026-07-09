import Link from "next/link";
import { getPublishedHpdkiKegiatanPosts } from "@/data/hpdki-kegiatan";

export const metadata = {
  title: "Kegiatan HPDKI | PAC HPDKI Kecamatan Dramaga",
  description:
    "Dokumentasi kegiatan PAC HPDKI Kecamatan Dramaga, termasuk pendataan anggota, kunjungan kandang, edukasi peternak, dan silaturahmi.",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function HpdkiKegiatanPage() {
  const posts = getPublishedHpdkiKegiatanPosts();

  return (
    <main className="hpdki-kegiatan-page">
      <section className="hpdki-kegiatan-hero">
        <p className="hpdki-kegiatan-eyebrow">
          PAC HPDKI Kecamatan Dramaga
        </p>

        <h1>Kegiatan dan Dokumentasi HPDKI Dramaga</h1>

        <p>
          Dokumentasi kegiatan PAC HPDKI Kecamatan Dramaga, mulai dari
          pendataan anggota, silaturahmi peternak, kunjungan kandang, edukasi,
          hingga aktivitas organisasi lainnya.
        </p>

        <div className="hpdki-kegiatan-actions">
          <Link href="/hpdki">Kembali ke HPDKI</Link>
          <Link href="/hpdki/daftar" className="secondary">
            Daftar Anggota
          </Link>
        </div>
      </section>

      <section className="hpdki-kegiatan-grid">
        {posts.map((post) => (
          <article key={post.slug} className="hpdki-kegiatan-card">
            <div className="hpdki-kegiatan-card-image">
              <span>{post.category}</span>
              <strong>{post.imageLabel}</strong>
            </div>

            <div className="hpdki-kegiatan-card-body">
              <div className="hpdki-kegiatan-meta">
                <span>{formatDate(post.date)}</span>
                <span>{post.location}</span>
              </div>

              <h2>{post.title}</h2>

              <p>{post.excerpt}</p>

              <Link href={`/hpdki/kegiatan/${post.slug}`}>
                Lihat Kegiatan
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="hpdki-kegiatan-cta">
        <div>
          <p>Dokumentasi HPDKI</p>
          <h2>Kegiatan organisasi dapat dipublikasikan bertahap</h2>
          <span>
            Ke depan, halaman ini dapat dihubungkan ke dashboard admin agar
            pengurus dapat menambahkan kegiatan, foto, lokasi, dan status
            publish/draft secara mandiri.
          </span>
        </div>

        <Link href="/hpdki/daftar">Daftar Anggota Peternak</Link>
      </section>
    </main>
  );
}
