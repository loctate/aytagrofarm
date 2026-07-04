"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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

function getLocation(member: PublicHpdkiMemberRecord) {
  return [member.village, member.district, member.regency]
    .filter(Boolean)
    .join(", ");
}

export default function AdminMembersPanel() {
  const [members, setMembers] = useState<PublicHpdkiMemberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingNumber, setActionLoadingNumber] = useState("");
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
                      <button
                        type="button"
                        className="admin-member-kta-button"
                        disabled
                        title="Fitur KTA akan dikerjakan pada tahap berikutnya."
                      >
                        KTA
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
