"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import HpdkiMemberCard from "@/components/admin/HpdkiMemberCard";

import {
  deactivateHpdkiMember,
  listHpdkiMembers,
  reactivateHpdkiMember,
  type HpdkiMembershipStatus,
  type PublicHpdkiMemberRecord,
} from "@/lib/appwrite/members";

type MemberStatusFilter = "all" | HpdkiMembershipStatus;

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

export default function AdminMembersPanel() {
  const [members, setMembers] = useState<PublicHpdkiMemberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingNumber, setActionLoadingNumber] = useState("");
  const [selectedKtaMember, setSelectedKtaMember] =
    useState<PublicHpdkiMemberRecord | null>(null);
  const [copiedKtaLink, setCopiedKtaLink] = useState("");
  const [ktaExportLoading, setKtaExportLoading] =
    useState<"" | "png" | "pdf">("");
  const ktaPreviewRef = useRef<HTMLDivElement | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<MemberStatusFilter>("all");

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const rows = await listHpdkiMembers();
      setMembers(rows);
    } catch (error) {
      console.error("Gagal memuat data anggota:", error);
      setErrorMessage(
        "Data anggota belum dapat dimuat. Pastikan table members dan permission Appwrite sudah benar.",
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
        "Status anggota belum berhasil diubah. Pastikan permission Update table members sudah aktif untuk Users.",
      );
    } finally {
      setActionLoadingNumber("");
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


  const getKtaPreviewNode = () => {
    const node = ktaPreviewRef.current;

    if (!node) {
      throw new Error("Preview KTA belum tersedia.");
    }

    return node;
  };

  const downloadKtaPng = async () => {
    if (!selectedKtaMember) {
      return;
    }

    setKtaExportLoading("png");
    setErrorMessage("");

    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(getKtaPreviewNode(), {
        backgroundColor: "#fffaf0",
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `${selectedKtaMember.member_number}-kta.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Gagal download PNG KTA:", error);
      setErrorMessage(
        "PNG KTA belum berhasil dibuat. Pastikan preview KTA sudah tampil sempurna.",
      );
    } finally {
      setKtaExportLoading("");
    }
  };

  const loadImage = (dataUrl: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image();

      image.onload = () => resolve(image);
      image.onerror = () =>
        reject(new Error("Gambar preview KTA gagal dimuat."));
      image.src = dataUrl;
    });

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

      const dataUrl = await toPng(getKtaPreviewNode(), {
        backgroundColor: "#fffaf0",
        cacheBust: true,
        pixelRatio: 2,
      });

      const image = await loadImage(dataUrl);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;
      const imageRatio = image.naturalWidth / image.naturalHeight;

      let renderWidth = maxWidth;
      let renderHeight = renderWidth / imageRatio;

      if (renderHeight > maxHeight) {
        renderHeight = maxHeight;
        renderWidth = renderHeight * imageRatio;
      }

      const x = (pageWidth - renderWidth) / 2;
      const y = (pageHeight - renderHeight) / 2;

      pdf.addImage(dataUrl, "PNG", x, y, renderWidth, renderHeight);
      pdf.save(`${selectedKtaMember.member_number}-kta.pdf`);
    } catch (error) {
      console.error("Gagal download PDF KTA:", error);
      setErrorMessage(
        "PDF KTA belum berhasil dibuat. Pastikan preview KTA sudah tampil sempurna.",
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
            Menampilkan data dari table members. Anggota aktif tampil di halaman
            publik, sedangkan anggota nonaktif tetap tersimpan sebagai arsip.
          </p>
        </div>

        <button type="button" onClick={() => void loadMembers()} disabled={loading}>
          {loading ? "Memuat..." : "Muat Ulang"}
        </button>
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
      </div>

      {errorMessage && (
        <div className="admin-modal-error admin-members-error">
          {errorMessage}
        </div>
      )}

      {loading && (
        <div className="admin-empty-state">
          <strong>Memuat data anggota...</strong>
          <p>Dashboard sedang mengambil data dari table members.</p>
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
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedKtaMember && (
        <div
          className="admin-kta-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Preview KTA ${selectedKtaMember.member_number}`}
        >
          <div className="admin-kta-modal">
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

            <div className="admin-kta-preview-modal" ref={ktaPreviewRef}>
              <HpdkiMemberCard
                member={selectedKtaMember}
                verificationUrl={getAbsoluteVerificationUrl(
                  selectedKtaMember.member_number,
                )}
              />
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
