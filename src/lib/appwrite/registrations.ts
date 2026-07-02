import { ID, Query } from "appwrite";
import { tablesDB } from "./client";
import { appwriteConfig } from "./config";

export const registrationStatuses = [
  "Pendaftaran Baru",
  "Sedang Diperiksa",
  "Data Belum Lengkap",
  "Menunggu Konfirmasi WhatsApp",
  "Lolos Validasi",
  "Disetujui",
  "Ditolak",
] as const;

export type RegistrationStatus =
  (typeof registrationStatuses)[number];

export type HpdkiRegistrationInput = {
  registration_number: string;
  farmer_name: string;
  whatsapp: string;
  farm_group_name: string;
  farm_address: string;
  village: string;
  district: string;
  regency: string;
  female_goats: number;
  male_goats: number;
  female_sheep: number;
  male_sheep: number;
  feed_type: string;
  farm_area_m2: number;
  total_population: number;
  notes?: string;
  status: RegistrationStatus;
  registered_at: string;
  agreement_accepted: boolean;
};

export type HpdkiRegistrationRecord = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;

  registration_number: string;
  member_data_number: string | null;

  farmer_name: string;
  whatsapp: string;
  farm_group_name: string;

  farm_address: string;
  village: string;
  district: string;
  regency: string;

  female_goats: number;
  male_goats: number;
  female_sheep: number;
  male_sheep: number;
  total_population: number;

  feed_type: string;
  farm_area_m2: number;

  notes: string | null;
  status: RegistrationStatus;
  admin_notes: string | null;

  registered_at: string;
  approved_at: string | null;
  agreement_accepted: boolean;
};

export type HpdkiRegistrationUpdate = {
  status?: RegistrationStatus;
  admin_notes?: string;
  approved_at?: string;
  member_data_number?: string;
};

function validateRegistrationConfig() {
  if (!appwriteConfig.databaseId) {
    throw new Error(
      "NEXT_PUBLIC_APPWRITE_DATABASE_ID belum dikonfigurasi."
    );
  }

  if (!appwriteConfig.registrationsTableId) {
    throw new Error(
      "NEXT_PUBLIC_APPWRITE_REGISTRATIONS_TABLE_ID belum dikonfigurasi."
    );
  }
}

export async function createHpdkiRegistration(
  data: HpdkiRegistrationInput
) {
  validateRegistrationConfig();

  return tablesDB.createRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.registrationsTableId,
    rowId: ID.unique(),
    data,
  });
}

export async function listHpdkiRegistrations() {
  validateRegistrationConfig();

  const response = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.registrationsTableId,
    queries: [
      Query.orderDesc("registered_at"),
      Query.limit(100),
    ],
  });

  return response.rows as unknown as HpdkiRegistrationRecord[];
}

export async function updateHpdkiRegistration(
  rowId: string,
  data: HpdkiRegistrationUpdate
) {
  validateRegistrationConfig();

  const response = await tablesDB.updateRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.registrationsTableId,
    rowId,
    data,
  });

  return response as unknown as HpdkiRegistrationRecord;
}
