import type { Metadata } from "next";

import PublicProductsCatalog from "@/components/products/PublicProductsCatalog";

export const metadata: Metadata = {
  title:
    "Produk Kambing & Domba | PAC HPDKI Kecamatan Dramaga",
  description:
    "Katalog produk kambing, domba, dan produk turunannya yang ditampilkan melalui PAC HPDKI Kecamatan Dramaga.",
  alternates: {
    canonical: "/hpdki/produk",
  },
};

export default function HpdkiProdukPage() {
  return <PublicProductsCatalog />;
}
