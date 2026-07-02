import { ID } from "appwrite";
import { tablesDB } from "./client";
import { appwriteConfig } from "./config";

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
  status: string;
  registered_at: string;
  agreement_accepted: boolean;
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
