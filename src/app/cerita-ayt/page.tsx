import Link from "next/link";
import { getPublishedCeritaAytPosts } from "@/data/cerita-ayt";

export const metadata = {
  title: "Cerita AYT | AYT Agro Farm",
  description:
    "Dokumentasi aktivitas AYT Agro Farm, mulai dari kandang, breeding, fattening, trading, kegiatan farm, hingga produk hilir.",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function CeritaAytPage() {
  const posts = getPublishedCeritaAytPosts();

  return (
    <main className="cerita-page">
      <section className="cerita-hero">
        <p className="cerita-eyebrow">Cerita AYT</p>

        <h1>Dokumentasi dan Aktivitas AYT Agro Farm</h1>

        <p>
          Cerita AYT berisi dokumentasi kegiatan farm, aktivitas kandang,
          breeding, fattening, trading, produk hilir, dan perkembangan AYT Agro
          Farm dari waktu ke waktu.
        </p>
      </section>

      <section className="cerita-grid">
        {posts.map((post) => (
          <article key={post.slug} className="cerita-card">
            <div className="cerita-card-image">
              <span>{post.category}</span>
              <strong>{post.imageLabel}</strong>
            </div>

            <div className="cerita-card-body">
              <div className="cerita-meta">
                <span>{formatDate(post.date)}</span>
                <span>{post.category}</span>
              </div>

              <h2>{post.title}</h2>

              <p>{post.excerpt}</p>

              <Link href={`/cerita-ayt/${post.slug}`}>Baca Cerita</Link>
            </div>
          </article>
        ))}
      </section>

      <section className="cerita-cta">
        <div>
          <p>Dokumentasi AYT</p>
          <h2>Kegiatan farm akan terus diperbarui</h2>
          <span>
            Ke depan, halaman ini dapat dihubungkan ke admin agar tim AYT bisa
            menambahkan cerita, foto, dan dokumentasi kegiatan secara mandiri.
          </span>
        </div>

        <Link href="/produk">Lihat Produk AYT</Link>
      </section>
    </main>
  );
}
