export const AYT_WHATSAPP_NUMBER = "6287889124342";

export const productCategoryOptions = [
  {
    value: "daging_segar",
    label: "Daging Segar",
  },
  {
    value: "frozen",
    label: "Frozen",
  },
  {
    value: "susu_turunan",
    label: "Susu & Turunan",
  },
  {
    value: "produk_samping",
    label: "Produk Samping",
  },
] as const;

export type ProductCategory =
  (typeof productCategoryOptions)[number]["value"];

export const productStockStatusOptions = [
  {
    value: "available",
    label: "Tersedia",
  },
  {
    value: "preorder",
    label: "Pre-order",
  },
  {
    value: "out_of_stock",
    label: "Stok Habis",
  },
  {
    value: "contact_admin",
    label: "Hubungi Admin",
  },
] as const;

export type ProductStockStatus =
  (typeof productStockStatusOptions)[number]["value"];

export type ProductPriceData = {
  price_amount: number;
  unit_label: string;
  price_prefix?: string | null;
};

export type ProductWhatsappData = ProductPriceData & {
  name: string;
};

export function isProductCategory(
  value: string,
): value is ProductCategory {
  return productCategoryOptions.some(
    (option) => option.value === value,
  );
}

export function isProductStockStatus(
  value: string,
): value is ProductStockStatus {
  return productStockStatusOptions.some(
    (option) => option.value === value,
  );
}

export function getProductCategoryLabel(value: string) {
  return (
    productCategoryOptions.find(
      (option) => option.value === value,
    )?.label ?? value
  );
}

export function getProductStockStatusLabel(value: string) {
  return (
    productStockStatusOptions.find(
      (option) => option.value === value,
    )?.label ?? value
  );
}

export function slugifyProductName(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

export function formatRupiah(value: number) {
  const safeValue = Number.isFinite(value)
    ? Math.max(0, Math.round(value))
    : 0;

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(safeValue)
    .replace(/\u00a0/g, " ");
}

export function formatProductPrice(
  product: ProductPriceData,
) {
  const prefix = product.price_prefix?.trim() ?? "";
  const unit = product.unit_label.trim();

  return [
    prefix,
    formatRupiah(product.price_amount),
    unit ? `/ ${unit}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function buildProductWhatsappUrl(
  product: ProductWhatsappData,
  whatsappNumber = AYT_WHATSAPP_NUMBER,
) {
  const safeNumber = whatsappNumber.replace(/\D/g, "");

  const message = encodeURIComponent(
    `Halo AYT Agro Farm, saya tertarik dengan produk ` +
      `${product.name} dengan harga ` +
      `${formatProductPrice(product)}. ` +
      `Mohon informasi ketersediaan dan cara pemesanannya.`,
  );

  return `https://wa.me/${safeNumber}?text=${message}`;
}
