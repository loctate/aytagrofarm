import { ID, Query } from "appwrite";

import { tablesDB } from "./client";
import { appwriteConfig } from "./config";

export type HpdkiMemberEvaluationRecord = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  member_id: string;
  member_number: string;
  farmer_name: string;
  evaluation_date: string;
  female_goats: number;
  male_goats: number;
  female_sheep: number;
  male_sheep: number;
  total_population: number;
  feed_type: string;
  farm_area_m2: number;
  cage_condition: string;
  livestock_condition: string;
  health_notes: string;
  feed_notes: string;
  business_notes: string;
  follow_up: string;
  admin_notes: string;
  created_by: string;
};

export type HpdkiMemberEvaluationCreateData = {
  member_id: string;
  member_number: string;
  farmer_name: string;
  evaluation_date: string;
  female_goats: number;
  male_goats: number;
  female_sheep: number;
  male_sheep: number;
  feed_type: string;
  farm_area_m2: number;
  cage_condition: string;
  livestock_condition: string;
  health_notes: string;
  feed_notes: string;
  business_notes: string;
  follow_up: string;
  admin_notes: string;
  created_by: string;
};

function hasMemberEvaluationsConfig() {
  return Boolean(
    appwriteConfig.databaseId && appwriteConfig.memberEvaluationsTableId,
  );
}

function validateMemberEvaluationsConfig() {
  if (!appwriteConfig.databaseId) {
    throw new Error("NEXT_PUBLIC_APPWRITE_DATABASE_ID belum dikonfigurasi.");
  }

  if (!appwriteConfig.memberEvaluationsTableId) {
    throw new Error(
      "NEXT_PUBLIC_APPWRITE_MEMBER_EVALUATIONS_TABLE_ID belum dikonfigurasi.",
    );
  }
}

function normalizeText(value: unknown, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim();
}

function normalizeRequiredText(value: unknown, label: string) {
  const text = normalizeText(value);

  if (!text) {
    throw new Error(`${label} wajib diisi.`);
  }

  return text;
}

function normalizeNumber(value: unknown, label: string) {
  const numberValue =
    typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    throw new Error(`${label} harus berupa angka 0 atau lebih.`);
  }

  return numberValue;
}

export async function createHpdkiMemberEvaluation(
  data: HpdkiMemberEvaluationCreateData,
) {
  validateMemberEvaluationsConfig();

  const safeData = {
    member_id: normalizeRequiredText(data.member_id, "ID anggota"),
    member_number: normalizeRequiredText(data.member_number, "Nomor anggota"),
    farmer_name: normalizeRequiredText(data.farmer_name, "Nama peternak"),
    evaluation_date: normalizeRequiredText(
      data.evaluation_date,
      "Tanggal evaluasi",
    ),
    female_goats: normalizeNumber(data.female_goats, "Kambing betina"),
    male_goats: normalizeNumber(data.male_goats, "Kambing jantan"),
    female_sheep: normalizeNumber(data.female_sheep, "Domba betina"),
    male_sheep: normalizeNumber(data.male_sheep, "Domba jantan"),
    feed_type: normalizeRequiredText(data.feed_type, "Jenis pakan"),
    farm_area_m2: normalizeNumber(data.farm_area_m2, "Luas kandang"),
    cage_condition: normalizeText(data.cage_condition),
    livestock_condition: normalizeText(data.livestock_condition),
    health_notes: normalizeText(data.health_notes),
    feed_notes: normalizeText(data.feed_notes),
    business_notes: normalizeText(data.business_notes),
    follow_up: normalizeText(data.follow_up),
    admin_notes: normalizeText(data.admin_notes),
    created_by: normalizeText(data.created_by, "Admin"),
  };

  const totalPopulation =
    safeData.female_goats +
    safeData.male_goats +
    safeData.female_sheep +
    safeData.male_sheep;

  const row = await tablesDB.createRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.memberEvaluationsTableId,
    rowId: ID.unique(),
    data: {
      ...safeData,
      total_population: totalPopulation,
    },
  });

  return row as unknown as HpdkiMemberEvaluationRecord;
}

export async function listHpdkiMemberEvaluations(
  memberNumber: string,
  limit = 50,
) {
  if (!hasMemberEvaluationsConfig()) {
    return [];
  }

  const response = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.memberEvaluationsTableId,
    queries: [
      Query.equal("member_number", memberNumber),
      Query.orderDesc("evaluation_date"),
      Query.limit(limit),
    ],
  });

  return response.rows as unknown as HpdkiMemberEvaluationRecord[];
}

export async function listRecentHpdkiMemberEvaluations(limit = 100) {
  if (!hasMemberEvaluationsConfig()) {
    return [];
  }

  const response = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.memberEvaluationsTableId,
    queries: [Query.orderDesc("evaluation_date"), Query.limit(limit)],
  });

  return response.rows as unknown as HpdkiMemberEvaluationRecord[];
}
