export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "",
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "",
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "",

  registrationsTableId:
    process.env.NEXT_PUBLIC_APPWRITE_REGISTRATIONS_TABLE_ID ?? "",

  membersTableId:
    process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_TABLE_ID ?? "",

  memberEvaluationsTableId:
    process.env.NEXT_PUBLIC_APPWRITE_MEMBER_EVALUATIONS_TABLE_ID ?? "",

  hpdkiActivitiesTableId:
    process.env.NEXT_PUBLIC_APPWRITE_HPDKI_ACTIVITIES_TABLE_ID ?? "",

  hpdkiActivityPhotosBucketId:
    process.env.NEXT_PUBLIC_APPWRITE_HPDKI_ACTIVITY_PHOTOS_BUCKET_ID ?? "",

  aytActivitiesTableId:
    process.env.NEXT_PUBLIC_APPWRITE_AYT_ACTIVITIES_TABLE_ID ?? "",

  aytActivityPhotosBucketId:
    process.env.NEXT_PUBLIC_APPWRITE_AYT_ACTIVITY_PHOTOS_BUCKET_ID ?? "",

  knowledgeTableId:
    process.env.NEXT_PUBLIC_APPWRITE_KNOWLEDGE_TABLE_ID ?? "",

  ktaSettingsTableId:
    process.env.NEXT_PUBLIC_APPWRITE_KTA_SETTINGS_TABLE_ID ?? "",

  productsTableId:
    process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_TABLE_ID ?? "",

  productImagesBucketId:
    process.env.NEXT_PUBLIC_APPWRITE_PRODUCT_IMAGES_BUCKET_ID ?? "",
} as const;

export function validateAppwriteClientConfig() {
  if (!appwriteConfig.endpoint) {
    throw new Error(
      "NEXT_PUBLIC_APPWRITE_ENDPOINT belum dikonfigurasi.",
    );
  }

  if (!appwriteConfig.projectId) {
    throw new Error(
      "NEXT_PUBLIC_APPWRITE_PROJECT_ID belum dikonfigurasi.",
    );
  }
}
