import {
  compareHpdkiMemberNumbers,
  extractMemberSequence,
  extractMemberYear,
} from "@/lib/hpdki/member-data-structure";

export type ExportableHpdkiMember = {
  member_number?: string | null;
  member_year?: number | null;
  member_sequence?: number | null;
  farmer_name?: string | null;
  phone?: string | null;
  farm_group_name?: string | null;
  village?: string | null;
  district?: string | null;
  regency?: string | null;
  province?: string | null;
  address?: string | null;
  livestock_type?: string | null;
  female_count?: number | null;
  male_count?: number | null;
  total_livestock_count?: number | null;
  female_goats?: number | null;
  male_goats?: number | null;
  female_sheep?: number | null;
  male_sheep?: number | null;
  total_population?: number | null;
  feed_type?: string | null;
  farm_area_m2?: number | null;
  membership_status?: string | null;
  inactive_reason?: string | null;
  admin_notes?: string | null;
  approved_at?: string | null;
  created_at?: string | null;
};

export type HpdkiMemberExportRow = {
  no: number;
  nomor_anggota: string;
  tahun: number | "";
  urutan: number | "";
  nama_peternak: string;
  nomor_hp: string;
  kelompok_kandang: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  alamat: string;
  jenis_ternak: string;
  kambing_betina: number | "";
  kambing_jantan: number | "";
  domba_betina: number | "";
  domba_jantan: number | "";
  total_betina: number | "";
  total_jantan: number | "";
  total_ternak: number | "";
  jenis_pakan: string;
  luas_kandang_m2: number | "";
  status: string;
  alasan_nonaktif: string;
  tanggal_disetujui: string;
  catatan_admin: string;
};

function toText(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsedValue = Number(value);

    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return 0;
}

function toNumberOrBlank(value: unknown) {
  const numberValue = toNumber(value);
  return numberValue === 0 ? "" : numberValue;
}

function sumOrBlank(firstValue: unknown, secondValue: unknown) {
  const total = toNumber(firstValue) + toNumber(secondValue);
  return total === 0 ? "" : total;
}

function getLivestockType(member: ExportableHpdkiMember) {
  if (member.livestock_type) {
    return member.livestock_type;
  }

  const goatTotal = toNumber(member.female_goats) + toNumber(member.male_goats);
  const sheepTotal =
    toNumber(member.female_sheep) + toNumber(member.male_sheep);

  if (goatTotal > 0 && sheepTotal > 0) {
    return "Kambing & Domba";
  }

  if (goatTotal > 0) {
    return "Kambing";
  }

  if (sheepTotal > 0) {
    return "Domba";
  }

  return "";
}

export function sortHpdkiMembersByOfficialNumber<T extends ExportableHpdkiMember>(
  members: T[],
) {
  return [...members].sort((firstMember, secondMember) => {
    const firstNumber = firstMember.member_number;
    const secondNumber = secondMember.member_number;

    if (!firstNumber && secondNumber) {
      return 1;
    }

    if (firstNumber && !secondNumber) {
      return -1;
    }

    if (!firstNumber && !secondNumber) {
      return toText(firstMember.farmer_name).localeCompare(
        toText(secondMember.farmer_name),
        "id-ID",
      );
    }

    const officialNumberComparison = compareHpdkiMemberNumbers(
      firstNumber,
      secondNumber,
    );

    if (officialNumberComparison !== 0) {
      return officialNumberComparison;
    }

    return toText(firstNumber).localeCompare(toText(secondNumber), "id-ID");
  });
}

export function buildHpdkiMemberExportRows(
  members: ExportableHpdkiMember[],
): HpdkiMemberExportRow[] {
  return sortHpdkiMembersByOfficialNumber(members).map((member, index) => {
    const memberNumber = toText(member.member_number);

    return {
      no: index + 1,
      nomor_anggota: memberNumber,
      tahun:
        typeof member.member_year === "number"
          ? member.member_year
          : extractMemberYear(memberNumber) || "",
      urutan:
        typeof member.member_sequence === "number"
          ? member.member_sequence
          : extractMemberSequence(memberNumber) || "",
      nama_peternak: toText(member.farmer_name),
      nomor_hp: toText(member.phone),
      kelompok_kandang: toText(member.farm_group_name),
      desa: toText(member.village),
      kecamatan: toText(member.district),
      kabupaten: toText(member.regency),
      provinsi: toText(member.province),
      alamat: toText(member.address),
      jenis_ternak: getLivestockType(member),
      kambing_betina: toNumberOrBlank(member.female_goats),
      kambing_jantan: toNumberOrBlank(member.male_goats),
      domba_betina: toNumberOrBlank(member.female_sheep),
      domba_jantan: toNumberOrBlank(member.male_sheep),
      total_betina:
        member.female_count ?? sumOrBlank(member.female_goats, member.female_sheep),
      total_jantan:
        member.male_count ?? sumOrBlank(member.male_goats, member.male_sheep),
      total_ternak:
        member.total_livestock_count ??
        member.total_population ??
        toNumberOrBlank(
          toNumber(member.female_goats) +
            toNumber(member.male_goats) +
            toNumber(member.female_sheep) +
            toNumber(member.male_sheep),
        ),
      jenis_pakan: toText(member.feed_type),
      luas_kandang_m2: toNumberOrBlank(member.farm_area_m2),
      status: toText(member.membership_status),
      alasan_nonaktif: toText(member.inactive_reason),
      tanggal_disetujui: toText(member.approved_at),
      catatan_admin: toText(member.admin_notes),
    };
  });
}

export const HPDKI_MEMBER_EXPORT_HEADERS: Record<
  keyof HpdkiMemberExportRow,
  string
> = {
  no: "No",
  nomor_anggota: "Nomor Anggota",
  tahun: "Tahun",
  urutan: "Urutan",
  nama_peternak: "Nama Peternak",
  nomor_hp: "Nomor HP",
  kelompok_kandang: "Kelompok/Kandang",
  desa: "Desa",
  kecamatan: "Kecamatan",
  kabupaten: "Kabupaten",
  provinsi: "Provinsi",
  alamat: "Alamat",
  jenis_ternak: "Jenis Ternak",
  kambing_betina: "Kambing Betina",
  kambing_jantan: "Kambing Jantan",
  domba_betina: "Domba Betina",
  domba_jantan: "Domba Jantan",
  total_betina: "Total Betina",
  total_jantan: "Total Jantan",
  total_ternak: "Total Ternak",
  jenis_pakan: "Jenis Pakan",
  luas_kandang_m2: "Luas Kandang m2",
  status: "Status",
  alasan_nonaktif: "Alasan Nonaktif",
  tanggal_disetujui: "Tanggal Disetujui",
  catatan_admin: "Catatan Admin",
};
