export type HpdkiKegiatanStatus = "published" | "draft";

export type HpdkiKegiatanCategory =
  | "Organisasi"
  | "Pendataan"
  | "Kunjungan"
  | "Edukasi"
  | "Silaturahmi"
  | "Peternakan";

export type HpdkiKegiatanPost = {
  slug: string;
  title: string;
  date: string;
  location: string;
  category: HpdkiKegiatanCategory;
  excerpt: string;
  content: string[];
  imageLabel: string;
  status: HpdkiKegiatanStatus;
};

export const hpdkiKegiatanPosts: HpdkiKegiatanPost[] = [
  {
    slug: "pendataan-anggota-pac-hpdki-dramaga",
    title: "Pendataan Anggota PAC HPDKI Kecamatan Dramaga",
    date: "2026-07-09",
    location: "Dramaga, Kabupaten Bogor",
    category: "Pendataan",
    excerpt:
      "Kegiatan pendataan anggota peternak sebagai bagian dari penguatan administrasi PAC HPDKI Kecamatan Dramaga.",
    imageLabel: "Pendataan Anggota",
    status: "published",
    content: [
      "PAC HPDKI Kecamatan Dramaga melakukan pendataan anggota peternak untuk memperkuat administrasi organisasi dan basis data anggota.",
      "Pendataan ini mencakup informasi dasar peternak, lokasi kandang, jenis ternak, serta kondisi awal populasi kambing dan domba.",
      "Data yang terkumpul akan menjadi dasar untuk pengembangan program, evaluasi anggota, dan kebutuhan administrasi organisasi ke depan.",
    ],
  },
  {
    slug: "silaturahmi-peternak-dramaga",
    title: "Silaturahmi Peternak Dramaga",
    date: "2026-07-09",
    location: "Kecamatan Dramaga",
    category: "Silaturahmi",
    excerpt:
      "Kegiatan silaturahmi antarpeternak untuk memperkuat komunikasi, kebersamaan, dan kolaborasi di wilayah Dramaga.",
    imageLabel: "Silaturahmi Peternak",
    status: "published",
    content: [
      "Silaturahmi antarpeternak menjadi bagian penting dalam membangun kebersamaan dan komunikasi di lingkungan PAC HPDKI Kecamatan Dramaga.",
      "Melalui kegiatan ini, peternak dapat saling bertukar informasi mengenai kondisi kandang, kebutuhan ternak, pakan, serta tantangan di lapangan.",
      "Kegiatan seperti ini diharapkan dapat memperkuat jaringan peternak dan mendukung pengembangan peternakan kambing dan domba di wilayah Dramaga.",
    ],
  },
  {
    slug: "kunjungan-kandang-anggota",
    title: "Kunjungan Kandang Anggota",
    date: "2026-07-09",
    location: "Wilayah Dramaga dan Sekitarnya",
    category: "Kunjungan",
    excerpt:
      "Dokumentasi kunjungan kandang anggota untuk melihat kondisi ternak, kandang, dan perkembangan peternakan anggota.",
    imageLabel: "Kunjungan Kandang",
    status: "published",
    content: [
      "Kunjungan kandang anggota dilakukan untuk melihat langsung kondisi kandang, populasi ternak, serta kebutuhan peternak di lapangan.",
      "Kegiatan ini dapat menjadi dasar evaluasi dan pembinaan anggota secara bertahap.",
      "Ke depan, kunjungan kandang juga dapat menjadi bagian dari riwayat evaluasi anggota di sistem administrasi HPDKI.",
    ],
  },
  {
    slug: "edukasi-dasar-pemeliharaan-kambing-domba",
    title: "Edukasi Dasar Pemeliharaan Kambing dan Domba",
    date: "2026-07-09",
    location: "PAC HPDKI Kecamatan Dramaga",
    category: "Edukasi",
    excerpt:
      "Kegiatan edukasi ringan mengenai perawatan kandang, pakan, kesehatan ternak, dan pengembangan usaha peternakan.",
    imageLabel: "Edukasi Peternak",
    status: "published",
    content: [
      "Edukasi peternak menjadi salah satu kegiatan yang dapat mendukung peningkatan kapasitas anggota.",
      "Materi edukasi dapat mencakup pemeliharaan kandang, pakan, kesehatan ternak, pencatatan populasi, dan pengembangan usaha.",
      "Dengan dokumentasi kegiatan edukasi, PAC HPDKI Kecamatan Dramaga dapat menunjukkan aktivitas pembinaan yang dilakukan secara bertahap.",
    ],
  },
];

export function getPublishedHpdkiKegiatanPosts() {
  return hpdkiKegiatanPosts.filter((post) => post.status === "published");
}

export function getHpdkiKegiatanPostBySlug(slug: string) {
  return hpdkiKegiatanPosts.find(
    (post) => post.slug === slug && post.status === "published"
  );
}
