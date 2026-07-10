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
  betina: number | "";
  jantan: number | "";
  total_ternak: number | "";
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

function toNumberOrBlank(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsedValue = Number(value);

    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
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
      jenis_ternak: toText(member.livestock_type),
      betina: toNumberOrBlank(member.female_count),
      jantan: toNumberOrBlank(member.male_count),
      total_ternak: toNumberOrBlank(member.total_livestock_count),
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
  betina: "Betina",
  jantan: "Jantan",
  total_ternak: "Total Ternak",
  status: "Status",
  alasan_nonaktif: "Alasan Nonaktif",
  tanggal_disetujui: "Tanggal Disetujui",
  catatan_admin: "Catatan Admin",
};
