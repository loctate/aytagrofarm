import { Query } from "appwrite";

import { tablesDB } from "./client";
import { appwriteConfig } from "./config";
import { sortHpdkiMembersByOfficialNumber } from "@/lib/hpdki/member-export-helpers";
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
  female_goats: number;
  male_goats: number;
  female_sheep: number;
  male_sheep: number;
  total_population: number;
  feed_type: string;
  farm_area_m2: number;
  registration_id?: string | null;
  kta_status?: string | null;
  kta_issued_at?: string | null;
  kta_expired_at?: string | null;
};

export type HpdkiMemberUpdateData = {
  farmer_name: string;
  farm_group_name: string;
  village: string;
  district: string;
  regency: string;
  female_goats: number;
  male_goats: number;
  female_sheep: number;
  male_sheep: number;
  feed_type: string;
  farm_area_m2: number;
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

  try {
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

    return sortHpdkiMembersByOfficialNumber(response.rows as unknown as PublicHpdkiMemberRecord[]);
  } catch {
    return [];
  }
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
      registration_id: registration.$id,
      female_goats: registration.female_goats ?? 0,
      male_goats: registration.male_goats ?? 0,
      female_sheep: registration.female_sheep ?? 0,
      male_sheep: registration.male_sheep ?? 0,
      total_population:
        (registration.female_goats ?? 0) +
        (registration.male_goats ?? 0) +
        (registration.female_sheep ?? 0) +
        (registration.male_sheep ?? 0),
      feed_type: registration.feed_type || "",
      farm_area_m2: registration.farm_area_m2 ?? 0,
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

const BLOCKED_MEMBER_UPDATE_FIELDS = [
  "$id",
  "$createdAt",
  "$updatedAt",
  "document_id",
  "registration_id",
  "registration_number",
  "member_data_number",
  "member_number",
  "member_year",
  "member_sequence",
  "approved_at",
  "kta_status",
  "kta_issued_at",
  "kta_expired_at",
  "membership_status",
  "is_public",
] as const;

function assertNoBlockedMemberUpdateFields(data: Record<string, unknown>) {
  const blockedFields = Object.keys(data).filter((fieldName) =>
    (BLOCKED_MEMBER_UPDATE_FIELDS as readonly string[]).includes(fieldName),
  );

  if (blockedFields.length > 0) {
    throw new Error(
      `Field anggota tidak boleh diubah dari form edit: ${blockedFields.join(
        ", ",
      )}`,
    );
  }
}

function normalizeMemberUpdateText(
  value: unknown,
  label: string,
  required = true,
) {
  const text = typeof value === "string" ? value.trim() : "";

  if (required && !text) {
    throw new Error(`${label} wajib diisi.`);
  }

  return text;
}

function normalizeMemberUpdateNumber(value: unknown, label: string) {
  const numberValue =
    typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    throw new Error(`${label} harus berupa angka 0 atau lebih.`);
  }

  return numberValue;
}

export async function updateHpdkiMemberData(
  memberId: string,
  data: HpdkiMemberUpdateData,
) {
  validateMembersWriteConfig();

  const rawData = data as unknown as Record<string, unknown>;
  assertNoBlockedMemberUpdateFields(rawData);

  const safeData = {
    farmer_name: normalizeMemberUpdateText(data.farmer_name, "Nama peternak"),
    farm_group_name: normalizeMemberUpdateText(
      data.farm_group_name,
      "Nama kandang/kelompok",
      false,
    ),
    village: normalizeMemberUpdateText(data.village, "Desa"),
    district: normalizeMemberUpdateText(data.district, "Kecamatan"),
    regency: normalizeMemberUpdateText(data.regency, "Kabupaten"),
    female_goats: normalizeMemberUpdateNumber(
      data.female_goats,
      "Kambing betina",
    ),
    male_goats: normalizeMemberUpdateNumber(
      data.male_goats,
      "Kambing jantan",
    ),
    female_sheep: normalizeMemberUpdateNumber(
      data.female_sheep,
      "Domba betina",
    ),
    male_sheep: normalizeMemberUpdateNumber(
      data.male_sheep,
      "Domba jantan",
    ),
    feed_type: normalizeMemberUpdateText(data.feed_type, "Jenis pakan"),
    farm_area_m2: normalizeMemberUpdateNumber(
      data.farm_area_m2,
      "Luas kandang",
    ),
  };

  const totalPopulation =
    safeData.female_goats +
    safeData.male_goats +
    safeData.female_sheep +
    safeData.male_sheep;

  const updatedMember = await tablesDB.updateRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.membersTableId,
    rowId: memberId,
    data: {
      ...safeData,
      total_population: totalPopulation,
    },
  });

  return updatedMember as unknown as PublicHpdkiMemberRecord;
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

