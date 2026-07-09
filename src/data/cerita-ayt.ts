export type CeritaAytCategory =
  | "Kandang"
  | "Breeding"
  | "Fattening"
  | "Trading"
  | "Kegiatan Farm"
  | "Produk Hilir";

export type CeritaAytPost = {
  slug: string;
  title: string;
  date: string;
  category: CeritaAytCategory;
  excerpt: string;
  content: string[];
  imageLabel: string;
  status: "published" | "draft";
};

export const ceritaAytPosts: CeritaAytPost[] = [
  {
    slug: "aktivitas-kandang-ayt-agro-farm",
    title: "Aktivitas Kandang AYT Agro Farm",
    date: "2026-07-09",
    category: "Kandang",
    excerpt:
      "Dokumentasi aktivitas kandang, perawatan ternak, dan kegiatan harian di lingkungan AYT Agro Farm.",
    imageLabel: "Dokumentasi Kandang",
    status: "published",
    content: [
      "AYT Agro Farm menjalankan aktivitas kandang secara bertahap dan terarah untuk mendukung kebutuhan breeding, fattening, dan penyediaan kambing serta domba.",
      "Kegiatan kandang meliputi pengecekan kondisi ternak, kebersihan area kandang, pemberian pakan, dan pemantauan perkembangan ternak.",
      "Dokumentasi ini menjadi bagian dari Cerita AYT agar pelanggan, calon mitra, dan anggota peternak dapat melihat aktivitas AYT Agro Farm secara lebih dekat.",
    ],
  },
  {
    slug: "breeding-dan-pengembangan-ternak",
    title: "Breeding dan Pengembangan Ternak",
    date: "2026-07-09",
    category: "Breeding",
    excerpt:
      "Cerita tentang pengembangan ternak, pemilihan indukan, dan arah breeding di AYT Agro Farm.",
    imageLabel: "Breeding",
    status: "published",
    content: [
      "Breeding menjadi salah satu fokus AYT Agro Farm dalam mendukung penyediaan kambing dan domba yang lebih terarah.",
      "Pengembangan ternak dilakukan dengan memperhatikan kebutuhan peternak, kualitas indukan, pejantan, dan tujuan pemeliharaan.",
      "Ke depan, dokumentasi breeding akan menjadi salah satu bagian penting untuk edukasi dan transparansi aktivitas peternakan.",
    ],
  },
  {
    slug: "fattening-kambing-dan-domba",
    title: "Fattening Kambing dan Domba",
    date: "2026-07-09",
    category: "Fattening",
    excerpt:
      "Dokumentasi proses penggemukan kambing dan domba untuk kebutuhan usaha, aqiqah, kurban, dan pelanggan umum.",
    imageLabel: "Fattening",
    status: "published",
    content: [
      "Fattening atau penggemukan ternak dilakukan untuk membantu memenuhi kebutuhan kambing dan domba dengan kondisi yang lebih siap sesuai permintaan.",
      "Proses ini memperhatikan pakan, kondisi kandang, kesehatan ternak, serta target kebutuhan pelanggan.",
      "AYT Agro Farm akan terus mengembangkan dokumentasi fattening sebagai bagian dari edukasi dan cerita perjalanan farm.",
    ],
  },
  {
    slug: "trading-kambing-dan-domba",
    title: "Trading Kambing dan Domba",
    date: "2026-07-09",
    category: "Trading",
    excerpt:
      "Aktivitas penyediaan kambing dan domba untuk kebutuhan pelanggan satuan maupun partai.",
    imageLabel: "Trading",
    status: "published",
    content: [
      "AYT Agro Farm membantu kebutuhan penyediaan kambing dan domba sesuai permintaan pelanggan.",
      "Kebutuhan pelanggan dapat berbeda-beda, mulai dari pembibitan, penggemukan, perdagangan, aqiqah, kurban, hingga kebutuhan usaha.",
      "Melalui Cerita AYT, aktivitas trading dapat terdokumentasi secara bertahap agar calon pelanggan lebih memahami layanan yang tersedia.",
    ],
  },
  {
    slug: "produk-hilir-dan-frozen",
    title: "Produk Hilir dan Frozen",
    date: "2026-07-09",
    category: "Produk Hilir",
    excerpt:
      "Rencana pengembangan produk turunan kambing dan domba, termasuk daging segar, frozen, dan produk olahan.",
    imageLabel: "Produk Hilir",
    status: "published",
    content: [
      "Selain penyediaan ternak hidup, AYT Agro Farm juga memiliki arah pengembangan ke produk hilir.",
      "Produk hilir dapat mencakup daging segar, frozen, dan produk olahan sesuai kebutuhan pasar.",
      "Halaman Cerita AYT akan menjadi tempat dokumentasi perkembangan produk hilir dari waktu ke waktu.",
    ],
  },
];

export function getPublishedCeritaAytPosts() {
  return ceritaAytPosts.filter((post) => post.status === "published");
}

export function getCeritaAytPostBySlug(slug: string) {
  return ceritaAytPosts.find(
    (post) => post.slug === slug && post.status === "published"
  );
}
