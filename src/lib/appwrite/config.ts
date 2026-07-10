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
  knowledgeTableId:
    process.env.NEXT_PUBLIC_APPWRITE_KNOWLEDGE_TABLE_ID ?? "",
  ktaSettingsTableId:
    process.env.NEXT_PUBLIC_APPWRITE_KTA_SETTINGS_TABLE_ID ?? "",
} as const;

export function validateAppwriteClientConfig() {
  if (!appwriteConfig.endpoint) {
    throw new Error(
      "NEXT_PUBLIC_APPWRITE_ENDPOINT belum dikonfigurasi."
    );
  }

  if (!appwriteConfig.projectId) {
    throw new Error(
      "NEXT_PUBLIC_APPWRITE_PROJECT_ID belum dikonfigurasi."
    );
  }
}
