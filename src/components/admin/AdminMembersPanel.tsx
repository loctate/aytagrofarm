"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import HpdkiMemberCard from "@/components/admin/HpdkiMemberCard";
import {
  defaultHpdkiKtaSettings,
  getHpdkiKtaSettings,
  type HpdkiKtaSettingsRecord,
} from "@/lib/appwrite/kta-settings";

import {
  deactivateHpdkiMember,
  listHpdkiMembers,
  reactivateHpdkiMember,
  updateHpdkiMemberData,
  type HpdkiMemberUpdateData,
  type HpdkiMembershipStatus,
  type PublicHpdkiMemberRecord,
} from "@/lib/appwrite/members";
import { downloadHpdkiMembersCsv } from "@/lib/hpdki/member-excel-download";

type MemberStatusFilter = "all" | HpdkiMembershipStatus;

type MemberEditForm = {
  farmer_name: string;
  farm_group_name: string;
  village: string;
  district: string;
  regency: string;
  female_goats: string;
  male_goats: string;
  female_sheep: string;
  male_sheep: string;
  feed_type: string;
  farm_area_m2: string;
};

const emptyMemberEditForm: MemberEditForm = {
  farmer_name: "",
  farm_group_name: "",
  village: "",
  district: "",
  regency: "",
  female_goats: "0",
  male_goats: "0",
  female_sheep: "0",
  male_sheep: "0",
  feed_type: "",
  farm_area_m2: "0",
};

const statusLabels: Record<HpdkiMembershipStatus, string> = {
  active: "Aktif",
  inactive: "Nonaktif",
  suspended: "Dibekukan",
  expired: "Kedaluwarsa",
};

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}


function getVerificationPath(memberNumber: string) {
  return `/hpdki/verifikasi?nomor=${encodeURIComponent(memberNumber)}`;
}

function getLocation(member: PublicHpdkiMemberRecord) {
  return [member.village, member.district, member.regency]
    .filter(Boolean)
    .join(", ");
}

function formatDateForExport(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function sortMembersByOfficialNumber(
  first: PublicHpdkiMemberRecord,
  second: PublicHpdkiMemberRecord,
) {
  return (
    (first.member_year ?? 0) - (second.member_year ?? 0) ||
    (first.member_sequence ?? 0) - (second.member_sequence ?? 0) ||
    first.member_number.localeCompare(second.member_number, "id-ID", {
      numeric: true,
      sensitivity: "base",
    })
  );
}

const memberExportHeaders = [
  "Nomor Anggota",
  "Nama Peternak",
  "Kelompok/Kandang",
  "Desa",
  "Kecamatan",
  "Kabupaten",
  "Tahun Anggota",
  "Urutan Anggota",
  "Kambing Betina",
  "Kambing Jantan",
  "Total Kambing",
  "Domba Betina",
  "Domba Jantan",
  "Total Domba",
  "Total Populasi",
  "Jenis Pakan",
  "Luas Kandang m2",
  "Status Membership",
  "Status Publik",
  "Status KTA",
  "Tanggal Disetujui",
  "KTA Diterbitkan",
  "Masa Berlaku KTA",
];

function buildMemberExportRows(members: PublicHpdkiMemberRecord[]) {
  return [...members]
    .sort(sortMembersByOfficialNumber)
    .map((member) => [
      member.member_number,
      member.farmer_name,
      member.farm_group_name || "",
      member.village,
      member.district,
      member.regency,
      member.member_year,
      member.member_sequence,
      member.female_goats ?? 0,
      member.male_goats ?? 0,
      (member.female_goats ?? 0) + (member.male_goats ?? 0),
      member.female_sheep ?? 0,
      member.male_sheep ?? 0,
      (member.female_sheep ?? 0) + (member.male_sheep ?? 0),
      member.total_population ?? 0,
      member.feed_type || "",
      member.farm_area_m2 ?? 0,
      statusLabels[member.membership_status] ?? member.membership_status,
      member.is_public ? "Publik" : "Tidak Publik",
      member.kta_status || "",
      formatDateForExport(member.approved_at),
      formatDateForExport(member.kta_issued_at),
      formatDateForExport(member.kta_expired_at),
    ]);
}

function getInitialMemberEditForm(member: PublicHpdkiMemberRecord): MemberEditForm {
  return {
    farmer_name: member.farmer_name,
    farm_group_name: member.farm_group_name || "",
    village: member.village,
    district: member.district,
    regency: member.regency,
    female_goats: String(member.female_goats ?? 0),
    male_goats: String(member.male_goats ?? 0),
    female_sheep: String(member.female_sheep ?? 0),
    male_sheep: String(member.male_sheep ?? 0),
    feed_type: member.feed_type || "",
    farm_area_m2: String(member.farm_area_m2 ?? 0),
  };
}

function parseRequiredNonNegativeNumber(value: string, label: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${label} harus diisi dengan angka 0 atau lebih.`);
  }

  return parsed;
}

function buildMemberEditPayload(form: MemberEditForm): HpdkiMemberUpdateData {
  const farmerName = form.farmer_name.trim();
  const village = form.village.trim();
  const district = form.district.trim();
  const regency = form.regency.trim();
  const feedType = form.feed_type.trim();

  if (!farmerName || !village || !district || !regency || !feedType) {
    throw new Error(
      "Nama peternak, desa, kecamatan, kabupaten, dan jenis pakan wajib diisi.",
    );
  }

  return {
    farmer_name: farmerName,
    farm_group_name: form.farm_group_name.trim(),
    village,
    district,
    regency,
    female_goats: parseRequiredNonNegativeNumber(
      form.female_goats,
      "Kambing betina",
    ),
    male_goats: parseRequiredNonNegativeNumber(
      form.male_goats,
      "Kambing jantan",
    ),
    female_sheep: parseRequiredNonNegativeNumber(
      form.female_sheep,
      "Domba betina",
    ),
    male_sheep: parseRequiredNonNegativeNumber(
      form.male_sheep,
      "Domba jantan",
    ),
    feed_type: feedType,
    farm_area_m2: parseRequiredNonNegativeNumber(
      form.farm_area_m2,
      "Luas kandang",
    ),
  };
}

// KTA_FIXED_EXPORT_2026
const KTA_EXPORT_CARD_WIDTH = 540;
const KTA_EXPORT_CARD_HEIGHT = 341;
const KTA_EXPORT_GAP = 32;
const KTA_EXPORT_TOTAL_WIDTH =
  KTA_EXPORT_CARD_WIDTH * 2 + KTA_EXPORT_GAP;

export default function AdminMembersPanel() {
  const [members, setMembers] = useState<PublicHpdkiMemberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingNumber, setActionLoadingNumber] = useState("");
  const [selectedKtaMember, setSelectedKtaMember] =
    useState<PublicHpdkiMemberRecord | null>(null);
  const [ktaSettings, setKtaSettings] =
    useState<HpdkiKtaSettingsRecord>(defaultHpdkiKtaSettings);
  const [editingMember, setEditingMember] =
    useState<PublicHpdkiMemberRecord | null>(null);
  const [memberEditForm, setMemberEditForm] =
    useState<MemberEditForm>(emptyMemberEditForm);
  const [memberEditSaving, setMemberEditSaving] = useState(false);
  const [copiedKtaLink, setCopiedKtaLink] = useState("");
  const [ktaExportLoading, setKtaExportLoading] =
    useState<"" | "png" | "pdf">("");
  const [membersExportLoading, setMembersExportLoading] = useState(false);
  const ktaExportRef = useRef<HTMLDivElement | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<MemberStatusFilter>("all");

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const [rows, settings] = await Promise.all([
        listHpdkiMembers(),
        getHpdkiKtaSettings(),
      ]);

      setMembers(rows);
      setKtaSettings(settings);
    } catch (error) {
      console.error("Gagal memuat data anggota:", error);
      setErrorMessage(
        "Data anggota belum dapat dimuat. Periksa koneksi lalu coba kembali.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadMembers();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadMembers]);

  const filteredMembers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return members.filter((member) => {
      const searchableText = [
        member.member_number,
        member.farmer_name,
        member.farm_group_name,
        member.village,
        member.district,
        member.regency,
        member.membership_status,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !keyword || searchableText.includes(keyword);
      const matchesStatus =
        statusFilter === "all" || member.membership_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [members, search, statusFilter]);

  const activeCount = members.filter(
    (member) => member.membership_status === "active",
  ).length;

  const inactiveCount = members.filter(
    (member) => member.membership_status === "inactive",
  ).length;

  const exportAllMembers = () => {
    downloadHpdkiMembersCsv(members, {
      filename: "anggota-hpdki-pac-dramaga-semua.csv",
    });
  };

  const exportActiveMembers = () => {
    const activeMembers = members.filter(
      (member) => member.membership_status === "active",
    );

    downloadHpdkiMembersCsv(activeMembers, {
      filename: "anggota-hpdki-pac-dramaga-aktif.csv",
    });
  };

  const exportFilteredMembers = () => {
    downloadHpdkiMembersCsv(filteredMembers, {
      filename: "anggota-hpdki-pac-dramaga-filter.csv",
    });
  };

  const memberEditTotalPopulation = useMemo(
    () =>
      Number(memberEditForm.female_goats || 0) +
      Number(memberEditForm.male_goats || 0) +
      Number(memberEditForm.female_sheep || 0) +
      Number(memberEditForm.male_sheep || 0),
    [memberEditForm],
  );

  const updateMemberEditField = (
    field: keyof MemberEditForm,
    value: string,
  ) => {
    setMemberEditForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const openMemberEditModal = (member: PublicHpdkiMemberRecord) => {
    setEditingMember(member);
    setMemberEditForm(getInitialMemberEditForm(member));
    setErrorMessage("");
  };

  const closeMemberEditModal = () => {
    if (memberEditSaving) {
      return;
    }

    setEditingMember(null);
    setMemberEditForm(emptyMemberEditForm);
  };

  const saveMemberEdit = async () => {
    if (!editingMember) {
      return;
    }

    setMemberEditSaving(true);
    setErrorMessage("");

    try {
      const payload = buildMemberEditPayload(memberEditForm);
      const updatedMember = await updateHpdkiMemberData(
        editingMember.$id,
        payload,
      );

      setMembers((current) =>
        current.map((member) =>
          member.$id === editingMember.$id
            ? {
                ...member,
                ...updatedMember,
              }
            : member,
        ),
      );

      setEditingMember(null);
      setMemberEditForm(emptyMemberEditForm);
    } catch (error) {
      console.error("Gagal menyimpan perubahan anggota:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Data anggota belum berhasil disimpan. Silakan coba kembali.",
      );
    } finally {
      setMemberEditSaving(false);
    }
  };

  const toggleMemberStatus = async (member: PublicHpdkiMemberRecord) => {
    const nextActive = member.membership_status !== "active";
    const confirmed = window.confirm(
      nextActive
        ? `Aktifkan kembali anggota ${member.member_number}? Anggota akan tampil lagi di halaman publik.`
        : `Nonaktifkan anggota ${member.member_number}? Anggota tidak akan tampil lagi di halaman publik.`,
    );

    if (!confirmed) {
      return;
    }

    setActionLoadingNumber(member.member_number);
    setErrorMessage("");

    try {
      if (nextActive) {
        await reactivateHpdkiMember(member.member_number);
      } else {
        await deactivateHpdkiMember(member.member_number);
      }

      setMembers((current) =>
        current.map((item) =>
          item.member_number === member.member_number
            ? {
                ...item,
                membership_status: nextActive ? "active" : "inactive",
                is_public: nextActive,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Gagal mengubah status anggota:", error);
      setErrorMessage(
        "Status anggota belum berhasil diubah. Silakan coba kembali.",
      );
    } finally {
      setActionLoadingNumber("");
    }
  };


  const downloadMembersExcel = async () => {
    setMembersExportLoading(true);
    setErrorMessage("");

    try {
      const XLSX = await import("xlsx");
      const today = new Date().toISOString().slice(0, 10);
      const exportRows = buildMemberExportRows(members);
      const worksheet = XLSX.utils.aoa_to_sheet([
        memberExportHeaders,
        ...exportRows,
      ]);

      worksheet["!cols"] = memberExportHeaders.map((header) => ({
        wch: Math.max(header.length + 4, 16),
      }));

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Anggota");
      XLSX.writeFile(
        workbook,
        `anggota-hpdki-dramaga-${today}.xlsx`,
        { compression: true },
      );
    } catch (error) {
      console.error("Gagal export Excel anggota:", error);
      setErrorMessage(
        "Excel anggota belum berhasil dibuat. Silakan muat ulang data anggota lalu coba kembali.",
      );
    } finally {
      setMembersExportLoading(false);
    }
  };

  const getAbsoluteVerificationUrl = (memberNumber: string) => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";

    return `${origin}${getVerificationPath(memberNumber)}`;
  };

  const copyKtaVerificationLink = async (memberNumber: string) => {
    try {
      await navigator.clipboard.writeText(
        getAbsoluteVerificationUrl(memberNumber),
      );

      setCopiedKtaLink(memberNumber);

      window.setTimeout(() => {
        setCopiedKtaLink((current) =>
          current === memberNumber ? "" : current,
        );
      }, 1800);
    } catch (error) {
      console.error("Gagal menyalin link verifikasi KTA:", error);
      setErrorMessage(
        "Link verifikasi belum berhasil disalin. Silakan buka verifikasi lalu salin URL dari browser.",
      );
    }
  };


  const getKtaExportNode = () => {
    const node = ktaExportRef.current;

    if (!node) {
      throw new Error("Canvas export KTA belum tersedia.");
    }

    return node;
  };

  const getKtaExportCards = () => {
    const node = getKtaExportNode();
    const cards = node.querySelectorAll<HTMLElement>(".kta-card-design");

    const front = cards.item(0);
    const back = cards.item(1);

    if (!front || !back) {
      throw new Error("Sisi depan atau belakang KTA belum tersedia.");
    }

    return { front, back };
  };

  const waitForKtaAssets = async () => {
    const node = getKtaExportNode();

    if ("fonts" in document) {
      await document.fonts.ready;
    }

    const images = Array.from(node.querySelectorAll("img"));

    await Promise.all(
      images.map(
        (image) =>
          new Promise<void>((resolve) => {
            if (image.complete) {
              resolve();
              return;
            }

            const timeout = window.setTimeout(resolve, 4000);

            const finish = () => {
              window.clearTimeout(timeout);
              resolve();
            };

            image.addEventListener("load", finish, { once: true });
            image.addEventListener("error", finish, { once: true });
          }),
      ),
    );

    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => resolve());
      });
    });
  };

  const downloadKtaPng = async () => {
    if (!selectedKtaMember) {
      return;
    }

    setKtaExportLoading("png");
    setErrorMessage("");

    try {
      const { toPng } = await import("html-to-image");

      await waitForKtaAssets();

      const dataUrl = await toPng(getKtaExportNode(), {
        backgroundColor: "#fffaf0",
        cacheBust: true,
        pixelRatio: 3,
        width: KTA_EXPORT_TOTAL_WIDTH,
        height: KTA_EXPORT_CARD_HEIGHT,
        style: {
          width: `${KTA_EXPORT_TOTAL_WIDTH}px`,
          height: `${KTA_EXPORT_CARD_HEIGHT}px`,
          maxWidth: "none",
          margin: "0",
          padding: "0",
        },
      });

      const link = document.createElement("a");
      link.download = `${selectedKtaMember.member_number}-kta.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Gagal download PNG KTA:", error);
      setErrorMessage(
        "PNG KTA belum berhasil dibuat. Pastikan logo dan tanda tangan sudah termuat.",
      );
    } finally {
      setKtaExportLoading("");
    }
  };

  const downloadKtaPdf = async () => {
    if (!selectedKtaMember) {
      return;
    }

    setKtaExportLoading("pdf");
    setErrorMessage("");

    try {
      const [{ toPng }, { jsPDF }] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ]);

      await waitForKtaAssets();

      const { front, back } = getKtaExportCards();

      const cardOptions = {
        backgroundColor: "#fffaf0",
        cacheBust: true,
        pixelRatio: 3,
        width: KTA_EXPORT_CARD_WIDTH,
        height: KTA_EXPORT_CARD_HEIGHT,
        style: {
          width: `${KTA_EXPORT_CARD_WIDTH}px`,
          height: `${KTA_EXPORT_CARD_HEIGHT}px`,
          minWidth: `${KTA_EXPORT_CARD_WIDTH}px`,
          maxWidth: "none",
          boxShadow: "none",
          margin: "0",
        },
      };

      const [frontDataUrl, backDataUrl] = await Promise.all([
        toPng(front, cardOptions),
        toPng(back, cardOptions),
      ]);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const cardWidth = 85.6;
      const cardHeight = 54;
      const cardGap = 8;
      const totalWidth = cardWidth * 2 + cardGap;

      const startX = (pageWidth - totalWidth) / 2;
      const startY = (pageHeight - cardHeight) / 2;

      pdf.addImage(
        frontDataUrl,
        "PNG",
        startX,
        startY,
        cardWidth,
        cardHeight,
      );

      pdf.addImage(
        backDataUrl,
        "PNG",
        startX + cardWidth + cardGap,
        startY,
        cardWidth,
        cardHeight,
      );

      pdf.save(`${selectedKtaMember.member_number}-kta.pdf`);
    } catch (error) {
      console.error("Gagal download PDF KTA:", error);
      setErrorMessage(
        "PDF KTA belum berhasil dibuat. Pastikan logo dan tanda tangan sudah termuat.",
      );
    } finally {
      setKtaExportLoading("");
    }
  };

  return (
    <section className="admin-card admin-members-panel">
      <div className="admin-card-heading">
        <div>
          <h2>Database Anggota</h2>
          <p>
            Menampilkan data anggota. Anggota aktif tampil di halaman
            publik, sedangkan anggota nonaktif tetap tersimpan sebagai arsip.
          </p>
        </div>

        <div className="admin-members-heading-actions">
          <button
            type="button"
            className="admin-members-export-button"
            onClick={() => void downloadMembersExcel()}
            disabled={loading || membersExportLoading}
          >
            {membersExportLoading
              ? "Menyiapkan Excel..."
              : "Download Excel Anggota"}
          </button>

          <button
            type="button"
            className="admin-members-reload-button"
            onClick={() => void loadMembers()}
            disabled={loading}
          >
            {loading ? "Memuat..." : "Muat Ulang"}
          </button>

        <button
          type="button"
          onClick={exportActiveMembers}
          disabled={loading || activeCount === 0}
        >
          Export Aktif
        </button>

        <button
          type="button"
          onClick={exportAllMembers}
          disabled={loading || members.length === 0}
        >
          Export Semua
        </button>
        </div>
      </div>

      <div className="admin-members-stats">
        <div>
          <strong>{members.length}</strong>
          <span>Total Anggota</span>
        </div>

        <div>
          <strong>{activeCount}</strong>
          <span>Aktif</span>
        </div>

        <div>
          <strong>{inactiveCount}</strong>
          <span>Nonaktif</span>
        </div>
      </div>

      <div className="admin-members-toolbar">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari nomor anggota, nama, kandang, atau wilayah"
          aria-label="Cari anggota"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as MemberStatusFilter)
          }
          aria-label="Filter status anggota"
        >
          <option value="all">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
          <option value="suspended">Dibekukan</option>
          <option value="expired">Kedaluwarsa</option>
        </select>

        <button
          type="button"
          className="admin-members-export-filtered"
          onClick={exportFilteredMembers}
          disabled={loading || filteredMembers.length === 0}
        >
          Export Hasil Filter
        </button>
      </div>

      {errorMessage && (
        <div className="admin-modal-error admin-members-error">
          {errorMessage}
        </div>
      )}

      {loading && (
        <div className="admin-empty-state">
          <strong>Memuat data anggota...</strong>
          <p>Dashboard sedang memuat data anggota.</p>
        </div>
      )}

      {!loading && filteredMembers.length === 0 && (
        <div className="admin-empty-state">
          <strong>Belum ada anggota yang sesuai</strong>
          <p>
            Data akan muncul setelah admin menerbitkan anggota dari pendaftaran
            PAC HPDKI.
          </p>
        </div>
      )}

      {!loading && filteredMembers.length > 0 && (
        <div className="admin-members-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nomor Anggota</th>
                <th>Nama Anggota</th>
                <th>Kandang/Kelompok</th>
                <th>Wilayah</th>
                <th>Disetujui</th>
                <th>Status</th>
                <th>Aksi</th>
                <th>KTA</th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.map((member) => {
                const isActive = member.membership_status === "active";
                const isActionLoading =
                  actionLoadingNumber === member.member_number;

                return (
                  <tr key={member.$id}>
                    <td>
                      <strong className="admin-member-number">
                        {member.member_number}
                      </strong>
                    </td>

                    <td>{member.farmer_name}</td>
                    <td>{member.farm_group_name || "-"}</td>
                    <td>{getLocation(member) || "-"}</td>
                    <td>{formatDate(member.approved_at)}</td>

                    <td>
                      <span
                        className={
                          isActive
                            ? "admin-member-status-pill admin-member-status-pill-active"
                            : "admin-member-status-pill admin-member-status-pill-inactive"
                        }
                      >
                        {statusLabels[member.membership_status] ??
                          member.membership_status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={
                          isActive
                            ? "admin-member-row-action admin-member-row-action-danger"
                            : "admin-member-row-action admin-member-row-action-success"
                        }
                        onClick={() => void toggleMemberStatus(member)}
                        disabled={Boolean(actionLoadingNumber)}
                      >
                        {isActionLoading
                          ? "Memproses..."
                          : isActive
                            ? "Nonaktifkan"
                            : "Aktifkan"}
                      </button>
                    </td>

                    <td>
                      <div className="admin-member-kta-actions">
                        <button
                          type="button"
                          className="admin-member-kta-link"
                          onClick={() => setSelectedKtaMember(member)}
                        >
                          Preview KTA
                        </button>

                        <a
                          href={getVerificationPath(member.member_number)}
                          className="admin-member-kta-copy"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Verifikasi
                        </a>

                        <button
                          type="button"
                          className="admin-member-edit-button"
                          onClick={() => openMemberEditModal(member)}
                        >
                          Edit Data
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editingMember && (
        <div
          className="admin-kta-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Edit data anggota ${editingMember.member_number}`}
        >
          <div className="admin-kta-modal admin-member-edit-modal">
            <div className="admin-kta-modal-header">
              <div>
                <p className="eyebrow">Edit Data Anggota</p>
                <h3>{editingMember.farmer_name}</h3>
                <span>{editingMember.member_number}</span>
              </div>

              <button type="button" onClick={closeMemberEditModal}>
                Tutup
              </button>
            </div>

            <form
              className="admin-member-edit-form"
              onSubmit={(event) => {
                event.preventDefault();
                void saveMemberEdit();
              }}
            >
              <div className="admin-member-edit-section">
                <h4>Data Identitas</h4>

                <div className="admin-member-edit-grid">
                  <label>
                    Nama Peternak
                    <input
                      type="text"
                      value={memberEditForm.farmer_name}
                      onChange={(event) =>
                        updateMemberEditField("farmer_name", event.target.value)
                      }
                      required
                    />
                  </label>

                  <label>
                    Nama Kandang/Kelompok
                    <input
                      type="text"
                      value={memberEditForm.farm_group_name}
                      onChange={(event) =>
                        updateMemberEditField(
                          "farm_group_name",
                          event.target.value,
                        )
                      }
                    />
                  </label>

                  <label>
                    Desa
                    <input
                      type="text"
                      value={memberEditForm.village}
                      onChange={(event) =>
                        updateMemberEditField("village", event.target.value)
                      }
                      required
                    />
                  </label>

                  <label>
                    Kecamatan
                    <input
                      type="text"
                      value={memberEditForm.district}
                      onChange={(event) =>
                        updateMemberEditField("district", event.target.value)
                      }
                      required
                    />
                  </label>

                  <label>
                    Kabupaten
                    <input
                      type="text"
                      value={memberEditForm.regency}
                      onChange={(event) =>
                        updateMemberEditField("regency", event.target.value)
                      }
                      required
                    />
                  </label>
                </div>
              </div>

              <div className="admin-member-edit-section">
                <h4>Data Ternak dan Kandang</h4>

                <div className="admin-member-edit-grid">
                  <label>
                    Kambing Betina
                    <input
                      type="number"
                      min="0"
                      value={memberEditForm.female_goats}
                      onChange={(event) =>
                        updateMemberEditField(
                          "female_goats",
                          event.target.value,
                        )
                      }
                      required
                    />
                  </label>

                  <label>
                    Kambing Jantan
                    <input
                      type="number"
                      min="0"
                      value={memberEditForm.male_goats}
                      onChange={(event) =>
                        updateMemberEditField(
                          "male_goats",
                          event.target.value,
                        )
                      }
                      required
                    />
                  </label>

                  <label>
                    Domba Betina
                    <input
                      type="number"
                      min="0"
                      value={memberEditForm.female_sheep}
                      onChange={(event) =>
                        updateMemberEditField(
                          "female_sheep",
                          event.target.value,
                        )
                      }
                      required
                    />
                  </label>

                  <label>
                    Domba Jantan
                    <input
                      type="number"
                      min="0"
                      value={memberEditForm.male_sheep}
                      onChange={(event) =>
                        updateMemberEditField(
                          "male_sheep",
                          event.target.value,
                        )
                      }
                      required
                    />
                  </label>

                  <label>
                    Jenis Pakan
                    <input
                      type="text"
                      value={memberEditForm.feed_type}
                      onChange={(event) =>
                        updateMemberEditField("feed_type", event.target.value)
                      }
                      required
                    />
                  </label>

                  <label>
                    Luas Kandang m2
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={memberEditForm.farm_area_m2}
                      onChange={(event) =>
                        updateMemberEditField(
                          "farm_area_m2",
                          event.target.value,
                        )
                      }
                      required
                    />
                  </label>
                </div>

                <div className="admin-member-edit-total">
                  <span>Total Populasi</span>
                  <strong>
                    {Number.isFinite(memberEditTotalPopulation)
                      ? memberEditTotalPopulation
                      : 0}
                  </strong>
                </div>
              </div>

              <div className="admin-member-edit-locked-note">
                Nomor anggota, tahun anggota, urutan anggota, tanggal disetujui,
                dan ID dokumen tidak dapat diedit dari form ini.
              </div>

              <div className="admin-kta-modal-actions">
                <button
                  type="button"
                  onClick={closeMemberEditModal}
                  disabled={memberEditSaving}
                >
                  Batal
                </button>

                <button type="submit" disabled={memberEditSaving}>
                  {memberEditSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedKtaMember && (
        <div
          className="admin-kta-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Preview KTA ${selectedKtaMember.member_number}`}
        >
          <div className="admin-kta-modal admin-kta-member-modal">
            <div className="admin-kta-modal-header">
              <div>
                <p className="eyebrow">Preview KTA</p>
                <h3>{selectedKtaMember.farmer_name}</h3>
                <span>{selectedKtaMember.member_number}</span>
              </div>

              <button type="button" onClick={() => setSelectedKtaMember(null)}>
                Tutup
              </button>
            </div>

            <div className="admin-kta-preview-modal admin-kta-member-preview">
              <HpdkiMemberCard
                member={selectedKtaMember}
                settings={ktaSettings}
                verificationUrl={getAbsoluteVerificationUrl(
                  selectedKtaMember.member_number,
                )}
              />
            </div>

            <div className="kta-export-stage" aria-hidden="true">
              <div
                className="kta-export-canvas"
                ref={ktaExportRef}
              >
                <HpdkiMemberCard
                  member={selectedKtaMember}
                  settings={ktaSettings}
                  verificationUrl={getAbsoluteVerificationUrl(
                    selectedKtaMember.member_number,
                  )}
                />
              </div>
            </div>

            <div className="admin-kta-modal-actions">
              <a
                href={getVerificationPath(selectedKtaMember.member_number)}
                target="_blank"
                rel="noreferrer"
              >
                Buka Verifikasi
              </a>

              <button
                type="button"
                onClick={() =>
                  void copyKtaVerificationLink(selectedKtaMember.member_number)
                }
              >
                {copiedKtaLink === selectedKtaMember.member_number
                  ? "Link Tersalin"
                  : "Salin Link"}
              </button>

              <button
                type="button"
                onClick={() => void downloadKtaPng()}
                disabled={Boolean(ktaExportLoading)}
              >
                {ktaExportLoading === "png" ? "Menyiapkan PNG..." : "Download PNG"}
              </button>

              <button
                type="button"
                onClick={() => void downloadKtaPdf()}
                disabled={Boolean(ktaExportLoading)}
              >
                {ktaExportLoading === "pdf" ? "Menyiapkan PDF..." : "Download PDF"}
              </button>

              <button type="button" onClick={() => window.print()}>
                Cetak
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
