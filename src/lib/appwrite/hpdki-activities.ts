import {
  ID,
  Permission,
  Query,
  Role,
} from "appwrite";

import { storage, tablesDB } from "./client";
import { appwriteConfig } from "./config";

export type HpdkiActivityStatus = "draft" | "published";

export const hpdkiActivityCategories = [
  "Organisasi",
  "Pendataan",
  "Kunjungan",
  "Edukasi",
  "Silaturahmi",
  "Peternakan",
] as const;

export type HpdkiActivityCategory =
  (typeof hpdkiActivityCategories)[number];

export type HpdkiActivityRecord = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  title: string;
  slug: string;
  event_date: string;
  location: string;
  category: HpdkiActivityCategory;
  excerpt: string;
  content: string;
  image_label: string;
  cover_file_id: string;
  photo_file_ids: string[];
  status: HpdkiActivityStatus;
  published_at: string | null;
  created_by: string;
};

export type HpdkiActivityCreateData = {
  title: string;
  slug?: string;
  event_date: string;
  location: string;
  category: HpdkiActivityCategory;
  excerpt: string;
  content: string;
  image_label?: string;
  cover_file_id?: string;
  photo_file_ids?: string[];
  status: HpdkiActivityStatus;
  created_by?: string;
};

export type HpdkiActivityUpdateData =
  Partial<HpdkiActivityCreateData>;

function hasActivitiesConfig() {
  return Boolean(
    appwriteConfig.databaseId &&
      appwriteConfig.hpdkiActivitiesTableId,
  );
}

function validateActivitiesConfig() {
  if (!appwriteConfig.databaseId) {
    throw new Error(
      "NEXT_PUBLIC_APPWRITE_DATABASE_ID belum dikonfigurasi.",
    );
  }

  if (!appwriteConfig.hpdkiActivitiesTableId) {
    throw new Error(
      "NEXT_PUBLIC_APPWRITE_HPDKI_ACTIVITIES_TABLE_ID belum dikonfigurasi.",
    );
  }
}

function validateActivityPhotosConfig() {
  if (!appwriteConfig.hpdkiActivityPhotosBucketId) {
    throw new Error(
      "NEXT_PUBLIC_APPWRITE_HPDKI_ACTIVITY_PHOTOS_BUCKET_ID belum dikonfigurasi.",
    );
  }
}

function normalizeText(value: unknown, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim();
}

function normalizeRequiredText(
  value: unknown,
  label: string,
) {
  const normalized = normalizeText(value);

  if (!normalized) {
    throw new Error(`${label} wajib diisi.`);
  }

  return normalized;
}

export function createHpdkiActivitySlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 220);
}

function validateCategory(
  category: unknown,
): HpdkiActivityCategory {
  if (
    typeof category !== "string" ||
    !hpdkiActivityCategories.includes(
      category as HpdkiActivityCategory,
    )
  ) {
    throw new Error("Kategori kegiatan tidak valid.");
  }

  return category as HpdkiActivityCategory;
}

function validateStatus(
  status: unknown,
): HpdkiActivityStatus {
  if (status !== "draft" && status !== "published") {
    throw new Error("Status kegiatan tidak valid.");
  }

  return status;
}

function activityPermissions(
  status: HpdkiActivityStatus,
) {
  const permissions = [
    Permission.read(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ];

  if (status === "published") {
    permissions.unshift(Permission.read(Role.any()));
  }

  return permissions;
}

function activityFilePermissions(
  status: HpdkiActivityStatus,
) {
  const permissions = [
    Permission.read(Role.users()),
    Permission.update(Role.users()),
    Permission.delete(Role.users()),
  ];

  if (status === "published") {
    permissions.unshift(Permission.read(Role.any()));
  }

  return permissions;
}

function normalizePhotoIds(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

function normalizeCreateData(
  data: HpdkiActivityCreateData,
) {
  const title = normalizeRequiredText(data.title, "Judul");
  const generatedSlug = createHpdkiActivitySlug(
    normalizeText(data.slug) || title,
  );

  if (!generatedSlug) {
    throw new Error("Slug kegiatan tidak valid.");
  }

  const status = validateStatus(data.status);

  return {
    title,
    slug: generatedSlug,
    event_date: normalizeRequiredText(
      data.event_date,
      "Tanggal kegiatan",
    ),
    location: normalizeRequiredText(
      data.location,
      "Lokasi",
    ),
    category: validateCategory(data.category),
    excerpt: normalizeRequiredText(
      data.excerpt,
      "Ringkasan",
    ),
    content: normalizeRequiredText(
      data.content,
      "Isi kegiatan",
    ),
    image_label:
      normalizeText(data.image_label) || title,
    cover_file_id: normalizeText(data.cover_file_id),
    photo_file_ids: normalizePhotoIds(
      data.photo_file_ids,
    ),
    status,
    published_at:
      status === "published"
        ? new Date().toISOString()
        : null,
    created_by: normalizeText(
      data.created_by,
      "Admin",
    ),
  };
}

export async function createHpdkiActivity(
  data: HpdkiActivityCreateData,
) {
  validateActivitiesConfig();

  const safeData = normalizeCreateData(data);

  const row = await tablesDB.createRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.hpdkiActivitiesTableId,
    rowId: ID.unique(),
    data: safeData,
    permissions: activityPermissions(safeData.status),
  });

  return row as unknown as HpdkiActivityRecord;
}

export async function listAllHpdkiActivities(
  limit = 100,
) {
  validateActivitiesConfig();

  const response = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.hpdkiActivitiesTableId,
    queries: [
      Query.orderDesc("event_date"),
      Query.limit(limit),
    ],
  });

  return response.rows as unknown as HpdkiActivityRecord[];
}

export async function listPublishedHpdkiActivities(
  limit = 100,
) {
  if (!hasActivitiesConfig()) {
    return [];
  }

  const response = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.hpdkiActivitiesTableId,
    queries: [
      Query.equal("status", "published"),
      Query.orderDesc("event_date"),
      Query.limit(limit),
    ],
  });

  return response.rows as unknown as HpdkiActivityRecord[];
}

export async function getPublishedHpdkiActivityBySlug(
  slug: string,
) {
  if (!hasActivitiesConfig()) {
    return null;
  }

  const normalizedSlug = createHpdkiActivitySlug(slug);

  const response = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.hpdkiActivitiesTableId,
    queries: [
      Query.equal("slug", normalizedSlug),
      Query.equal("status", "published"),
      Query.limit(1),
    ],
  });

  return (
    (response.rows[0] as unknown as
      | HpdkiActivityRecord
      | undefined) ?? null
  );
}

export async function getHpdkiActivityById(
  rowId: string,
) {
  validateActivitiesConfig();

  const row = await tablesDB.getRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.hpdkiActivitiesTableId,
    rowId,
  });

  return row as unknown as HpdkiActivityRecord;
}

export async function updateHpdkiActivity(
  rowId: string,
  current: HpdkiActivityRecord,
  updates: HpdkiActivityUpdateData,
) {
  validateActivitiesConfig();

  const merged = normalizeCreateData({
    title: updates.title ?? current.title,
    slug: updates.slug ?? current.slug,
    event_date:
      updates.event_date ?? current.event_date,
    location: updates.location ?? current.location,
    category: updates.category ?? current.category,
    excerpt: updates.excerpt ?? current.excerpt,
    content: updates.content ?? current.content,
    image_label:
      updates.image_label ?? current.image_label,
    cover_file_id:
      updates.cover_file_id ?? current.cover_file_id,
    photo_file_ids:
      updates.photo_file_ids ?? current.photo_file_ids,
    status: updates.status ?? current.status,
    created_by:
      updates.created_by ?? current.created_by,
  });

  if (
    merged.status === "published" &&
    current.status === "published" &&
    current.published_at
  ) {
    merged.published_at = current.published_at;
  }

  const row = await tablesDB.updateRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.hpdkiActivitiesTableId,
    rowId,
    data: merged,
    permissions: activityPermissions(merged.status),
  });

  await Promise.all(
    merged.photo_file_ids.map(async (fileId) => {
      try {
        await storage.updateFile({
          bucketId:
            appwriteConfig.hpdkiActivityPhotosBucketId,
          fileId,
          permissions: activityFilePermissions(
            merged.status,
          ),
        });
      } catch (error) {
        console.error(
          `Gagal memperbarui permission foto ${fileId}:`,
          error,
        );
      }
    }),
  );

  return row as unknown as HpdkiActivityRecord;
}

export async function deleteHpdkiActivity(
  activity: HpdkiActivityRecord,
) {
  validateActivitiesConfig();

  const fileIds = normalizePhotoIds([
    activity.cover_file_id,
    ...activity.photo_file_ids,
  ]);

  await Promise.all(
    fileIds.map(async (fileId) => {
      try {
        await deleteHpdkiActivityPhoto(fileId);
      } catch (error) {
        console.error(
          `Gagal menghapus foto ${fileId}:`,
          error,
        );
      }
    }),
  );

  await tablesDB.deleteRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.hpdkiActivitiesTableId,
    rowId: activity.$id,
  });
}

export async function uploadHpdkiActivityPhoto(
  file: File,
  status: HpdkiActivityStatus = "draft",
) {
  validateActivityPhotosConfig();

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Format foto harus JPG, JPEG, PNG, atau WEBP.",
    );
  }

  const maximumSize = 5 * 1024 * 1024;

  if (file.size > maximumSize) {
    throw new Error(
      "Ukuran setiap foto maksimal 5 MB.",
    );
  }

  return storage.createFile({
    bucketId:
      appwriteConfig.hpdkiActivityPhotosBucketId,
    fileId: ID.unique(),
    file,
    permissions: activityFilePermissions(status),
  });
}

export async function deleteHpdkiActivityPhoto(
  fileId: string,
) {
  validateActivityPhotosConfig();

  await storage.deleteFile({
    bucketId:
      appwriteConfig.hpdkiActivityPhotosBucketId,
    fileId,
  });
}

export function getHpdkiActivityPhotoUrl(
  fileId: string,
) {
  if (
    !fileId ||
    !appwriteConfig.hpdkiActivityPhotosBucketId
  ) {
    return "";
  }

  return String(
    storage.getFileView({
      bucketId:
        appwriteConfig.hpdkiActivityPhotosBucketId,
      fileId,
    }),
  );
}
