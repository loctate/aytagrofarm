import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getHpdkiKegiatanPostBySlug,
  hpdkiKegiatanPosts,
} from "@/data/hpdki-kegiatan";

type HpdkiKegiatanDetailPageProps = {
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
  return hpdkiKegiatanPosts
    .filter((post) => post.status === "published")
    .map((post) => ({
      slug: post.slug,
    }));
}

export async function generateMetadata({
  params,
}: HpdkiKegiatanDetailPageProps) {
  const { slug } = await params;
  const post = getHpdkiKegiatanPostBySlug(slug);

  if (!post) {
    return {
      title: "Kegiatan HPDKI Tidak Ditemukan",
    };
  }

  return {
    title: `${post.title} | Kegiatan HPDKI Dramaga`,
    description: post.excerpt,
  };
}

export default async function HpdkiKegiatanDetailPage({
  params,
}: HpdkiKegiatanDetailPageProps) {
  const { slug } = await params;
  const post = getHpdkiKegiatanPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="hpdki-kegiatan-detail-page">
      <article className="hpdki-kegiatan-detail">
        <Link href="/hpdki/kegiatan" className="hpdki-kegiatan-back-link">
          ← Kembali ke Kegiatan HPDKI
        </Link>

        <header>
          <p className="hpdki-kegiatan-eyebrow">{post.category}</p>

          <h1>{post.title}</h1>

          <div className="hpdki-kegiatan-detail-meta">
            <span>{formatDate(post.date)}</span>
            <span>{post.location}</span>
          </div>

          <p>{post.excerpt}</p>
        </header>

        <div className="hpdki-kegiatan-detail-image">
          <span>{post.category}</span>
          <strong>{post.imageLabel}</strong>
        </div>

        <div className="hpdki-kegiatan-detail-content">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <section className="hpdki-kegiatan-detail-cta">
          <h2>Ingin bergabung sebagai anggota peternak?</h2>

          <p>
            Peternak wilayah Dramaga dan sekitarnya dapat mendaftar melalui
            form pendaftaran anggota PAC HPDKI Kecamatan Dramaga.
          </p>

          <Link href="/hpdki/daftar">Daftar Anggota HPDKI</Link>
        </section>
      </article>
    </main>
  );
}
