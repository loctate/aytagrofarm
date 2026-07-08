import { ID, Query } from "appwrite";

import { tablesDB } from "./client";
import { appwriteConfig } from "./config";

export const HPDKI_KTA_SETTING_KEY = "default";

export type HpdkiKtaSettingsRecord = {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
  setting_key: string;
  chairman_name: string;
  vice_chairman_name: string;
  chairman_title: string;
  vice_chairman_title: string;
  validity_years: number;
  secretariat_address: string | null;
  secretariat_contact: string | null;
  card_terms: string | null;
  updated_by: string | null;
};

export type HpdkiKtaSettingsFormData = {
  chairman_name: string;
  vice_chairman_name: string;
  chairman_title: string;
  vice_chairman_title: string;
  validity_years: number;
  secretariat_address: string;
  secretariat_contact: string;
  card_terms: string;
  updated_by: string;
};

export const defaultHpdkiKtaSettings: HpdkiKtaSettingsRecord = {
  $id: HPDKI_KTA_SETTING_KEY,
  setting_key: HPDKI_KTA_SETTING_KEY,
  chairman_name: "Salman Asidiqi",
  vice_chairman_name: "-",
  chairman_title: "Ketua PAC HPDKI Kec. Dramaga",
  vice_chairman_title: "Wakil Ketua PAC HPDKI Kec. Dramaga",
  validity_years: 5,
  secretariat_address:
    "Kp. Sukabakti, Sukawening, Dramaga, Kabupaten Bogor",
  secretariat_contact:
    "0812 1025 001 • sekretariat.dramaga@hpdki.or.id",
  card_terms:
    "Kartu Tanda Anggota (KTA) ini adalah milik PAC HPDKI Kecamatan Dramaga.\n" +
    "Kartu ini berlaku selama anggota terdaftar dan masih aktif dalam organisasi.\n" +
    "Kartu ini berlaku sesuai masa berlaku yang ditetapkan pengurus.\n" +
    "Anggota wajib mematuhi AD/ART, peraturan, dan keputusan organisasi.\n" +
    "Kartu ini tidak dapat dipindahtangankan kepada pihak lain.\n" +
    "Jika kartu hilang atau rusak, harap segera menghubungi Sekretariat PAC HPDKI Kecamatan Dramaga.",
  updated_by: "",
};

function hasKtaSettingsConfig() {
  return Boolean(
    appwriteConfig.databaseId && appwriteConfig.ktaSettingsTableId,
  );
}

function validateKtaSettingsConfig() {
  if (!appwriteConfig.databaseId) {
    throw new Error("NEXT_PUBLIC_APPWRITE_DATABASE_ID belum dikonfigurasi.");
  }

  if (!appwriteConfig.ktaSettingsTableId) {
    throw new Error(
      "NEXT_PUBLIC_APPWRITE_KTA_SETTINGS_TABLE_ID belum dikonfigurasi.",
    );
  }
}

function normalizeKtaSettings(
  row: Partial<HpdkiKtaSettingsRecord> | null,
): HpdkiKtaSettingsRecord {
  return {
    ...defaultHpdkiKtaSettings,
    ...row,
    $id: row?.$id || defaultHpdkiKtaSettings.$id,
    setting_key: row?.setting_key || HPDKI_KTA_SETTING_KEY,
    validity_years:
      typeof row?.validity_years === "number" && row.validity_years > 0
        ? row.validity_years
        : defaultHpdkiKtaSettings.validity_years,
  };
}

export async function getHpdkiKtaSettings() {
  if (!hasKtaSettingsConfig()) {
    return defaultHpdkiKtaSettings;
  }

  const response = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.ktaSettingsTableId,
    queries: [
      Query.equal("setting_key", HPDKI_KTA_SETTING_KEY),
      Query.limit(1),
    ],
  });

  const [settings] =
    response.rows as unknown as HpdkiKtaSettingsRecord[];

  return normalizeKtaSettings(settings ?? null);
}

export async function saveHpdkiKtaSettings(
  data: HpdkiKtaSettingsFormData,
) {
  validateKtaSettingsConfig();

  const payload = {
    setting_key: HPDKI_KTA_SETTING_KEY,
    chairman_name: data.chairman_name,
    vice_chairman_name: data.vice_chairman_name,
    chairman_title: data.chairman_title,
    vice_chairman_title: data.vice_chairman_title,
    validity_years: data.validity_years,
    secretariat_address: data.secretariat_address,
    secretariat_contact: data.secretariat_contact,
    card_terms: data.card_terms,
    updated_by: data.updated_by,
  };

  const existing = await getHpdkiKtaSettings();

  if (existing.$id && existing.$id !== HPDKI_KTA_SETTING_KEY) {
    const updated = await tablesDB.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.ktaSettingsTableId,
      rowId: existing.$id,
      data: payload,
    });

    return normalizeKtaSettings(
      updated as unknown as HpdkiKtaSettingsRecord,
    );
  }

  try {
    const updated = await tablesDB.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.ktaSettingsTableId,
      rowId: HPDKI_KTA_SETTING_KEY,
      data: payload,
    });

    return normalizeKtaSettings(
      updated as unknown as HpdkiKtaSettingsRecord,
    );
  } catch {
    const created = await tablesDB.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.ktaSettingsTableId,
      rowId: ID.unique(),
      data: payload,
    });

    return normalizeKtaSettings(
      created as unknown as HpdkiKtaSettingsRecord,
    );
  }
}
