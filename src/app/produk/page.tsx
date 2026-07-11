import Link from "next/link";

const whatsappNumber = "6287889124342";

const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  "Halo AYT Agro Farm, saya ingin bertanya tentang produk kambing, domba, dan layanan peternakan."
)}`;

const productCategories = [
  {
    title: "Kambing & Domba Siap Pilih",
    description:
      "Penyediaan kambing dan domba sesuai kebutuhan pelanggan, mulai dari kebutuhan pembibitan, penggemukan, aqiqah, kurban, hingga kebutuhan usaha.",
    items: ["Kambing", "Domba", "Bakalan", "Indukan", "Pejantan"],
  },
  {
    title: "Breeding & Fattening",
    description:
      "Dukungan kebutuhan ternak untuk pembibitan dan penggemukan, termasuk pemilihan ternak sesuai tujuan pemeliharaan.",
    items: ["Bibit", "Indukan", "Penggemukan", "Seleksi ternak"],
  },
  {
    title: "Trading Kambing & Domba",
    description:
      "Membantu kebutuhan pembelian ternak satuan maupun partai sesuai jenis, jumlah, bobot, lokasi, dan anggaran.",
    items: ["Satuan", "Partai", "Kebutuhan usaha", "Kebutuhan acara"],
  },
  {
    title: "Produk Hilir & Frozen",
    description:
      "Produk turunan kambing dan domba tersedia berdasarkan permintaan dan konfirmasi ketersediaan, termasuk daging segar, frozen, dan produk olahan lainnya.",
    items: ["Daging segar", "Frozen", "Olahan", "Paket kebutuhan"],
  },
  {
    title: "Penyembelihan",
    description:
      "Layanan pendukung untuk kebutuhan penyembelihan, distribusi, dan pengolahan sesuai permintaan pelanggan.",
    items: ["Penyembelihan", "Distribusi", "Paket acara", "Kebutuhan khusus"],
  },
  {
    title: "Konsultasi Kebutuhan Ternak",
    description:
      "Diskusi awal untuk membantu menentukan jenis ternak, jumlah, bobot, dan kebutuhan yang paling sesuai.",
    items: ["Pemilihan ternak", "Kebutuhan kandang", "Kebutuhan usaha", "Arahan awal"],
  },
];

export const metadata = {
  title: "Produk AYT Agro Farm",
  description:
    "Produk dan layanan AYT Agro Farm: kambing, domba, breeding, fattening, trading, produk hilir, frozen, dan penyembelihan.",
};

export default function ProdukPage() {
  return (
    <main className="produk-page">
      <section className="produk-hero">
        <p className="produk-eyebrow">Produk AYT Agro Farm</p>

        <h1>Produk Kambing, Domba, dan Layanan Peternakan</h1>

        <p className="produk-intro">
          AYT Agro Farm berfokus pada penyediaan kambing dan domba sesuai
          kebutuhan pelanggan, mulai dari breeding, fattening, trading, produk
          hilir, frozen, hingga layanan penyembelihan.
        </p>

        <div className="produk-actions">
          <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            Tanya Produk via WhatsApp
          </Link>

          <Link href="/" className="secondary">
            Kembali ke Beranda
          </Link>
        </div>
      </section>

      <section className="produk-grid">
        {productCategories.map((product) => (
          <article key={product.title} className="produk-card">
            <h2>{product.title}</h2>
            <p>{product.description}</p>

            <div className="produk-tags">
              {product.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="produk-cta">
        <div>
          <p>Hubungi AYT Agro Farm</p>
          <h2>Butuh kambing atau domba sesuai kebutuhan?</h2>
          <span>
            Sampaikan jenis ternak, jumlah, tujuan, kisaran bobot, lokasi, dan
            anggaran yang dibutuhkan. Tim AYT Agro Farm akan membantu
            mengarahkan pilihan yang sesuai.
          </span>
        </div>

        <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          Chat WhatsApp Sekarang
        </Link>
      </section>
    </main>
  );
}
