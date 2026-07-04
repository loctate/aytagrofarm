import { Query } from "appwrite";

import { tablesDB } from "./client";
import { appwriteConfig } from "./config";
import {
  type HpdkiRegistrationRecord,
  updateHpdkiRegistration,
} from "./registrations";

export const HPDKI_MEMBER_PREFIX = "HPDKI-PAC-DRAMAGA";

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

function validateMembersWriteConfig() {
  if (!appwriteConfig.databaseId) {
    throw new Error("NEXT_PUBLIC_APPWRITE_DATABASE_ID belum dikonfigurasi.");
  }

  if (!appwriteConfig.membersTableId) {
    throw new Error("NEXT_PUBLIC_APPWRITE_MEMBERS_TABLE_ID belum dikonfigurasi.");
  }
}

export function formatHpdkiMemberNumber(year: number, sequence: number) {
  return `${HPDKI_MEMBER_PREFIX}-${year}-${sequence
    .toString()
    .padStart(3, "0")}`;
}

async function getNextMemberSequence(year: number) {
  validateMembersWriteConfig();

  try {
    const response = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.membersTableId,
      queries: [
        Query.equal("member_year", year),
        Query.orderDesc("member_sequence"),
        Query.limit(1),
      ],
    });

    const [latestMember] =
      response.rows as unknown as PublicHpdkiMemberRecord[];

    return (latestMember?.member_sequence ?? 0) + 1;
  } catch (error) {
    console.warn(
      "Fallback sequence aktif. Pastikan index member_year/member_sequence sudah dibuat di Appwrite.",
      error,
    );

    const response = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.membersTableId,
      queries: [Query.limit(500)],
    });

    const rows = response.rows as unknown as PublicHpdkiMemberRecord[];

    return (
      rows
        .filter((member) => member.member_year === year)
        .reduce(
          (highest, member) => Math.max(highest, member.member_sequence ?? 0),
          0,
        ) + 1
    );
  }
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

export async function publishRegistrationAsMember(
  registration: HpdkiRegistrationRecord,
) {
  validateMembersWriteConfig();

  if (registration.member_data_number) {
    throw new Error("Pendaftaran ini sudah memiliki nomor anggota.");
  }

  const approvedAt = registration.approved_at ?? new Date().toISOString();
  const memberYear = new Date(approvedAt).getFullYear();
  const memberSequence = await getNextMemberSequence(memberYear);
  const memberNumber = formatHpdkiMemberNumber(memberYear, memberSequence);

  const createdMember = await tablesDB.createRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.membersTableId,
    rowId: registration.$id,
    data: {
      member_number: memberNumber,
      farmer_name: registration.farmer_name,
      farm_group_name: registration.farm_group_name || "",
      village: registration.village,
      district: registration.district,
      regency: registration.regency,
      member_year: memberYear,
      member_sequence: memberSequence,
      approved_at: approvedAt,
      membership_status: "active",
      is_public: true,
    },
  });

  const updatedRegistration = await updateHpdkiRegistration(registration.$id, {
    status: "Disetujui",
    approved_at: approvedAt,
    member_data_number: memberNumber,
  });

  return {
    member: createdMember as unknown as PublicHpdkiMemberRecord,
    registration: updatedRegistration,
  };
}

export async function updateHpdkiMemberStatusByNumber(
  memberNumber: string,
  membershipStatus: HpdkiMembershipStatus,
  isPublic: boolean,
) {
  validateMembersWriteConfig();

  const response = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.membersTableId,
    queries: [Query.equal("member_number", memberNumber), Query.limit(1)],
  });

  const [member] = response.rows as unknown as PublicHpdkiMemberRecord[];

  if (!member) {
    throw new Error(`Anggota dengan nomor ${memberNumber} tidak ditemukan.`);
  }

  return tablesDB.updateRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.membersTableId,
    rowId: member.$id,
    data: {
      membership_status: membershipStatus,
      is_public: isPublic,
    },
  });
}

export async function deactivateHpdkiMember(memberNumber: string) {
  return updateHpdkiMemberStatusByNumber(memberNumber, "inactive", false);
}

export async function reactivateHpdkiMember(memberNumber: string) {
  return updateHpdkiMemberStatusByNumber(memberNumber, "active", true);
}

export async function getHpdkiMemberByNumber(memberNumber: string) {
  if (!hasMembersConfig()) {
    return null;
  }

  const response = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.membersTableId,
    queries: [Query.equal("member_number", memberNumber), Query.limit(1)],
  });

  const [member] = response.rows as unknown as PublicHpdkiMemberRecord[];

  return member ?? null;
}

export async function listHpdkiMembers(limit = 300) {
  validateMembersWriteConfig();

  const response = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.membersTableId,
    queries: [Query.orderAsc("member_number"), Query.limit(limit)],
  });

  return response.rows as unknown as PublicHpdkiMemberRecord[];
}

