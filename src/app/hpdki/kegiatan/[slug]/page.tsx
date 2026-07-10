import PublicHpdkiActivityDetail from "@/components/hpdki/PublicHpdkiActivityDetail";

type HpdkiKegiatanDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function HpdkiKegiatanDetailPage({
  params,
}: HpdkiKegiatanDetailPageProps) {
  const { slug } = await params;

  return (
    <PublicHpdkiActivityDetail slug={slug} />
  );
}
