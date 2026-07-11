export type HpdkiPengurusGroup =
  | "pelindung"
  | "pembina"
  | "penasihat"
  | "harian";

export type HpdkiPengurus = {
  id: string;
  role: string;
  name: string;
  note?: string;
  group: HpdkiPengurusGroup;
  order: number;
};

export const hpdkiPengurusPeriod = {
  startYear: 2025,
  endYear: 2030,
  establishedAt: "Bogor",
  establishedDate: "2025-11-29",
  signerName: "Salman Asidiqi",
  signerRole: "Ketua DPC HPDKI Kabupaten Bogor",
} as const;

export const hpdkiPengurus: HpdkiPengurus[] = [
  {
    id: "dewan-pelindung",
    role: "Dewan Pelindung",
    name: "Kapolres Kabupaten Bogor",
    group: "pelindung",
    order: 1,
  },
  {
    id: "dewan-pembina",
    role: "Dewan Pembina",
    name: "Camat Dramaga",
    note: "Ketua DPC HPDKI Kabupaten Bogor",
    group: "pembina",
    order: 2,
  },
  {
    id: "dewan-penasihat",
    role: "Dewan Penasihat",
    name: "Deni",
    group: "penasihat",
    order: 3,
  },
  {
    id: "ketua",
    role: "Ketua",
    name: "Muhammad Imron",
    group: "harian",
    order: 4,
  },
  {
    id: "wakil-ketua",
    role: "Wakil Ketua",
    name: "Apriyan Susanto, S.T., M.T.",
    group: "harian",
    order: 5,
  },
  {
    id: "sekretaris",
    role: "Sekretaris",
    name: "Andri",
    group: "harian",
    order: 6,
  },
  {
    id: "bendahara",
    role: "Bendahara",
    name: "Ida Winarti",
    group: "harian",
    order: 7,
  },
];

export function getHpdkiPengurusByGroup(
  group: HpdkiPengurusGroup,
) {
  return hpdkiPengurus
    .filter((item) => item.group === group)
    .sort((a, b) => a.order - b.order);
}
