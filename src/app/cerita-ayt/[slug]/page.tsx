import PublicAytActivityDetail from "@/components/ayt/PublicAytActivityDetail";

type CeritaAytDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CeritaAytDetailPage({
  params,
}: CeritaAytDetailPageProps) {
  const { slug } = await params;

  return (
    <PublicAytActivityDetail slug={slug} />
  );
}
