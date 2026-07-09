import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ceritaAytPosts,
  getCeritaAytPostBySlug,
} from "@/data/cerita-ayt";

type CeritaAytDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function generateStaticParams() {
  return ceritaAytPosts
    .filter((post) => post.status === "published")
    .map((post) => ({
      slug: post.slug,
    }));
}

export async function generateMetadata({ params }: CeritaAytDetailPageProps) {
  const { slug } = await params;
  const post = getCeritaAytPostBySlug(slug);

  if (!post) {
    return {
      title: "Cerita AYT Tidak Ditemukan",
    };
  }

  return {
    title: `${post.title} | Cerita AYT`,
    description: post.excerpt,
  };
}

export default async function CeritaAytDetailPage({
  params,
}: CeritaAytDetailPageProps) {
  const { slug } = await params;
  const post = getCeritaAytPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="cerita-detail-page">
      <article className="cerita-detail">
        <Link href="/cerita-ayt" className="cerita-back-link">
          ← Kembali ke Cerita AYT
        </Link>

        <header>
          <p className="cerita-eyebrow">{post.category}</p>

          <h1>{post.title}</h1>

          <span className="cerita-detail-date">{formatDate(post.date)}</span>

          <p>{post.excerpt}</p>
        </header>

        <div className="cerita-detail-image">
          <span>{post.category}</span>
          <strong>{post.imageLabel}</strong>
        </div>

        <div className="cerita-detail-content">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <section className="cerita-detail-cta">
          <h2>Butuh informasi produk atau layanan AYT?</h2>

          <p>
            Lihat daftar produk AYT Agro Farm atau hubungi tim AYT untuk
            kebutuhan kambing, domba, breeding, fattening, trading, dan produk
            hilir.
          </p>

          <Link href="/produk">Lihat Produk AYT</Link>
        </section>
      </article>
    </main>
  );
}
