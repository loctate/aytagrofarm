import {
  ID,
  Permission,
  Query,
  Role,
} from "appwrite";

import { storage, tablesDB } from "./client";
import { appwriteConfig } from "./config";
import {
  isProductCategory,
  isProductStockStatus,
  slugifyProductName,
  type ProductCategory,
  type ProductStockStatus,
} from "@/lib/products/catalog";

const MAX_PRODUCT_IMAGE_SIZE = 2 * 1024 * 1024;

const ALLOWED_PRODUCT_IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
]);

export type ProductRecord = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;

  name: string;
  slug: string;
  category: ProductCategory;
  short_description: string;

  price_amount: number;
  unit_label: string;
  price_prefix: string | null;

  stock_status: ProductStockStatus;
  image_file_id: string | null;

  is_published: boolean;
  sort_order: number | null;
  price_updated_at: string;
};

export type ProductCreateInput = {
  name: string;
  slug?: string;
  category: ProductCategory;
  short_description: string;

  price_amount: number;
  unit_label: string;
  price_prefix?: string | null;

  stock_status: ProductStockStatus;
  image_file_id?: string | null;

  is_published?: boolean;
  sort_order?: number;
  price_updated_at?: string;
};

export type ProductUpdateInput =
  Partial<ProductCreateInput>;

type NormalizedProductData = {
  name: string;
  slug: string;
  category: ProductCategory;
  short_description: string;

  price_amount: number;
  unit_label: string;
  price_prefix: string | null;

  stock_status: ProductStockStatus;
  image_file_id: string | null;

  is_published: boolean;
  sort_order: number;
  price_updated_at: string;
};

function hasProductsTableConfig() {
  return Boolean(
    appwriteConfig.databaseId &&
      appwriteConfig.productsTableId,
  );
}

function validateProductsTableConfig() {
  if (!appwriteConfig.databaseId) {
    throw new Error(
      "NEXT_PUBLIC_APPWRITE_DATABASE_ID belum dikonfigurasi.",
    );
  }

  if (!appwriteConfig.productsTableId) {
    throw new Error(
      "NEXT_PUBLIC_APPWRITE_PRODUCTS_TABLE_ID belum dikonfigurasi.",
    );
  }
}

function validateProductStorageConfig() {
  if (!appwriteConfig.productImagesBucketId) {
    throw new Error(
      "NEXT_PUBLIC_APPWRITE_PRODUCT_IMAGES_BUCKET_ID " +
        "belum dikonfigurasi.",
    );
  }
}

function productPublicPermissions(
  isPublished: boolean,
) {
  return isPublished
    ? [Permission.read(Role.any())]
    : [];
}

function normalizeText(
  value: string,
  label: string,
  maximumLength: number,
) {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${label} wajib diisi.`);
  }

  if (normalized.length > maximumLength) {
    throw new Error(
      `${label} maksimal ${maximumLength} karakter.`,
    );
  }

  return normalized;
}

function normalizeOptionalText(
  value: string | null | undefined,
  label: string,
  maximumLength: number,
) {
  const normalized = value?.trim() ?? "";

  if (normalized.length > maximumLength) {
    throw new Error(
      `${label} maksimal ${maximumLength} karakter.`,
    );
  }

  return normalized || null;
}

function normalizePriceUpdatedAt(value?: string) {
  const candidate = value ? new Date(value) : new Date();

  if (Number.isNaN(candidate.getTime())) {
    throw new Error(
      "Tanggal pembaruan harga tidak valid.",
    );
  }

  return candidate.toISOString();
}

function normalizeProductData(
  data: ProductCreateInput,
): NormalizedProductData {
  const name = normalizeText(
    data.name,
    "Nama produk",
    160,
  );

  const slug = slugifyProductName(
    data.slug?.trim() || name,
  );

  if (!slug) {
    throw new Error("Slug produk tidak valid.");
  }

  if (!isProductCategory(data.category)) {
    throw new Error("Kategori produk tidak valid.");
  }

  if (!isProductStockStatus(data.stock_status)) {
    throw new Error(
      "Status ketersediaan produk tidak valid.",
    );
  }

  const priceAmount = Number(data.price_amount);

  if (
    !Number.isFinite(priceAmount) ||
    priceAmount <= 0
  ) {
    throw new Error(
      "Harga eceran harus lebih besar dari Rp0.",
    );
  }

  const sortOrder = Number(data.sort_order ?? 0);

  if (
    !Number.isInteger(sortOrder) ||
    sortOrder < 0 ||
    sortOrder > 10000
  ) {
    throw new Error(
      "Urutan produk harus berupa angka 0 sampai 10000.",
    );
  }

  const imageFileId = normalizeOptionalText(
    data.image_file_id,
    "ID gambar produk",
    36,
  );

  const isPublished = Boolean(data.is_published);

  if (isPublished && !imageFileId) {
    throw new Error(
      "Produk harus memiliki gambar sebelum dipublikasikan.",
    );
  }

  return {
    name,
    slug,
    category: data.category,
    short_description: normalizeText(
      data.short_description,
      "Deskripsi singkat",
      600,
    ),

    price_amount: Math.round(priceAmount),
    unit_label: normalizeText(
      data.unit_label,
      "Satuan harga",
      50,
    ),
    price_prefix: normalizeOptionalText(
      data.price_prefix,
      "Awalan harga",
      30,
    ),

    stock_status: data.stock_status,
    image_file_id: imageFileId,

    is_published: isPublished,
    sort_order: sortOrder,
    price_updated_at: normalizePriceUpdatedAt(
      data.price_updated_at,
    ),
  };
}

function normalizeLimit(limit: number) {
  if (!Number.isFinite(limit)) {
    return 100;
  }

  return Math.min(
    500,
    Math.max(1, Math.floor(limit)),
  );
}

function sortProductRecords(
  products: ProductRecord[],
) {
  return [...products].sort((first, second) => {
    const firstOrder = first.sort_order ?? 0;
    const secondOrder = second.sort_order ?? 0;

    if (firstOrder !== secondOrder) {
      return firstOrder - secondOrder;
    }

    return first.name.localeCompare(
      second.name,
      "id-ID",
    );
  });
}

export async function listPublicProducts(
  limit = 100,
) {
  if (!hasProductsTableConfig()) {
    return [];
  }

  try {
    const response = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.productsTableId,
      queries: [
        Query.equal("is_published", true),
        Query.orderAsc("sort_order"),
        Query.limit(normalizeLimit(limit)),
      ],
    });

    return sortProductRecords(
      response.rows as unknown as ProductRecord[],
    );
  } catch (error) {
    console.warn(
      "Daftar produk publik belum dapat dimuat:",
      error,
    );

    return [];
  }
}

export async function listProductsForAdmin(
  limit = 300,
) {
  validateProductsTableConfig();

  const response = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.productsTableId,
    queries: [
      Query.limit(normalizeLimit(limit)),
    ],
  });

  return sortProductRecords(
    response.rows as unknown as ProductRecord[],
  );
}

export async function getProductById(
  rowId: string,
) {
  validateProductsTableConfig();

  const row = await tablesDB.getRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.productsTableId,
    rowId,
  });

  return row as unknown as ProductRecord;
}

export async function createProduct(
  data: ProductCreateInput,
) {
  validateProductsTableConfig();

  const safeData = normalizeProductData(data);

  const row = await tablesDB.createRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.productsTableId,
    rowId: ID.unique(),
    data: safeData,
    permissions: productPublicPermissions(
      safeData.is_published,
    ),
  });

  return row as unknown as ProductRecord;
}

export async function updateProduct(
  rowId: string,
  data: ProductUpdateInput,
) {
  validateProductsTableConfig();

  const current = await getProductById(rowId);

  const mergedData: ProductCreateInput = {
    name: data.name ?? current.name,
    slug: data.slug ?? current.slug,
    category: data.category ?? current.category,
    short_description:
      data.short_description ??
      current.short_description,

    price_amount:
      data.price_amount ?? current.price_amount,
    unit_label:
      data.unit_label ?? current.unit_label,
    price_prefix:
      data.price_prefix === undefined
        ? current.price_prefix
        : data.price_prefix,

    stock_status:
      data.stock_status ?? current.stock_status,
    image_file_id:
      data.image_file_id === undefined
        ? current.image_file_id
        : data.image_file_id,

    is_published:
      data.is_published ?? current.is_published,
    sort_order:
      data.sort_order ?? current.sort_order ?? 0,
    price_updated_at:
      data.price_updated_at ??
      current.price_updated_at,
  };

  const safeData = normalizeProductData(mergedData);

  const row = await tablesDB.updateRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.productsTableId,
    rowId,
    data: safeData,
    permissions: productPublicPermissions(
      safeData.is_published,
    ),
  });

  return row as unknown as ProductRecord;
}

export async function setProductPublished(
  rowId: string,
  isPublished: boolean,
) {
  return updateProduct(rowId, {
    is_published: isPublished,
  });
}

export async function deleteProduct(
  rowId: string,
) {
  validateProductsTableConfig();

  await tablesDB.deleteRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.productsTableId,
    rowId,
  });
}

export async function uploadProductImage(
  file: File,
) {
  validateProductStorageConfig();

  if (!file || file.size <= 0) {
    throw new Error(
      "Pilih file gambar produk yang valid.",
    );
  }

  if (file.size > MAX_PRODUCT_IMAGE_SIZE) {
    throw new Error(
      "Ukuran gambar produk maksimal 2 MB.",
    );
  }

  const extension =
    file.name.split(".").pop()?.toLowerCase() ?? "";

  if (
    !ALLOWED_PRODUCT_IMAGE_EXTENSIONS.has(
      extension,
    )
  ) {
    throw new Error(
      "Format gambar harus JPG, JPEG, PNG, atau WEBP.",
    );
  }

  return storage.createFile({
    bucketId:
      appwriteConfig.productImagesBucketId,
    fileId: ID.unique(),
    file,
  });
}

export async function deleteProductImage(
  fileId: string | null | undefined,
) {
  if (!fileId?.trim()) {
    return;
  }

  validateProductStorageConfig();

  await storage.deleteFile({
    bucketId:
      appwriteConfig.productImagesBucketId,
    fileId,
  });
}

export function getProductImageUrl(
  fileId: string | null | undefined,
) {
  if (!fileId?.trim()) {
    return "";
  }

  validateProductStorageConfig();

  return String(
    storage.getFileView({
      bucketId:
        appwriteConfig.productImagesBucketId,
      fileId,
    }),
  );
}

export async function deleteProductAndImage(
  product: ProductRecord,
) {
  await deleteProduct(product.$id);

  if (!product.image_file_id) {
    return;
  }

  try {
    await deleteProductImage(
      product.image_file_id,
    );
  } catch (error) {
    console.warn(
      "Row produk sudah dihapus, tetapi file gambar " +
        "belum berhasil dibersihkan:",
      error,
    );
  }
}
