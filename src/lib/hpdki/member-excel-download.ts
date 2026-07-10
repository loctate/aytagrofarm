import {
  buildHpdkiMemberExportRows,
  HPDKI_MEMBER_EXPORT_HEADERS,
  type ExportableHpdkiMember,
  type HpdkiMemberExportRow,
} from "@/lib/hpdki/member-export-helpers";

type DownloadHpdkiMembersCsvOptions = {
  filename?: string;
};

function escapeCsvValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  const text = String(value).replace(/"/g, '""');

  return `"${text}"`;
}

function buildCsvContent(rows: HpdkiMemberExportRow[]) {
  const keys = Object.keys(
    HPDKI_MEMBER_EXPORT_HEADERS,
  ) as Array<keyof HpdkiMemberExportRow>;

  const headerRow = keys.map((key) =>
    escapeCsvValue(HPDKI_MEMBER_EXPORT_HEADERS[key]),
  );

  const dataRows = rows.map((row) =>
    keys.map((key) => escapeCsvValue(row[key])),
  );

  return [
    "sep=;",
    headerRow.join(";"),
    ...dataRows.map((row) => row.join(";")),
  ].join("\n");
}

function buildDefaultFilename() {
  const today = new Date().toISOString().slice(0, 10);
  return `anggota-hpdki-pac-dramaga-${today}.csv`;
}

export function downloadHpdkiMembersCsv(
  members: ExportableHpdkiMember[],
  options: DownloadHpdkiMembersCsvOptions = {},
) {
  if (typeof window === "undefined") {
    return;
  }

  const rows = buildHpdkiMemberExportRows(members);
  const csvContent = buildCsvContent(rows);
  const blob = new Blob([`\uFEFF${csvContent}`], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = options.filename ?? buildDefaultFilename();
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
