import type { Metadata } from "next";

import PublicProductsCatalog from "@/components/products/PublicProductsCatalog";

export const metadata: Metadata = {
  title: "Produk Turunan Kambing & Domba | AYT Agro Farm",
  description:
    "Katalog produk turunan kambing dan domba AYT Agro Farm, meliputi daging segar, frozen, susu dan turunannya, serta produk samping.",
};

export default function ProdukPage() {
  return <PublicProductsCatalog />;
}
