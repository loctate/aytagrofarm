import { Query } from "appwrite";

import { tablesDB } from "./client";
import { appwriteConfig } from "./config";

export type HpdkiMembershipStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "expired";

export type PublicHpdkiMemberRecord = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  member_number: string;
  farmer_name: string;
  farm_group_name: string | null;
  village: string;
  district: string;
  regency: string;
  member_year: number;
  member_sequence: number;
  approved_at: string | null;
  membership_status: HpdkiMembershipStatus;
  is_public: boolean;
};

function hasMembersConfig() {
  return Boolean(appwriteConfig.databaseId && appwriteConfig.membersTableId);
}

export async function listPublicHpdkiMembers(limit = 100) {
  if (!hasMembersConfig()) {
    return [];
  }

  const response = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.membersTableId,
    queries: [
      Query.equal("is_public", true),
      Query.equal("membership_status", "active"),
      Query.orderAsc("member_number"),
      Query.limit(limit),
    ],
  });

  return response.rows as unknown as PublicHpdkiMemberRecord[];
}
