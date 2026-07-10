"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  listPublicHpdkiMembers,
  type PublicHpdkiMemberRecord,
} from "@/lib/appwrite/members";

type PublicMembersListProps = {
  variant?: "compact" | "full";
  limit?: number;
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

function getMemberLocation(member: PublicHpdkiMemberRecord) {
  return [member.village, member.district, member.regency]
    .filter(Boolean)
    .join(", ");
}

export default function PublicMembersList({
  variant = "compact",
  limit = variant === "compact" ? 6 : 100,
}: PublicMembersListProps) {
  const [members, setMembers] = useState<PublicHpdkiMemberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMembers() {
      setLoading(true);
      setErrorMessage("");

      try {
        const rows = await listPublicHpdkiMembers(limit);

        if (!active) {
          return;
        }

        setMembers(rows);
      } catch {
      if (!active) {
        return;
      }

      setMembers([]);
      setErrorMessage("Daftar anggota publik belum dapat dimuat sementara.");
    } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadMembers();

    return () => {
      active = false;
    };
  }, [limit]);

  const filteredMembers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return members;
    }

    return members.filter((member) => {
      const searchableText = [
        member.member_number,
        member.farmer_name,
        member.farm_group_name,
        member.village,
        member.district,
        member.regency,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [members, search]);

  const isFull = variant === "full";

  return (
    <section className={`public-members-section public-members-section-${variant}`}>
      <div className="container public-members-shell">
        <div className="public-members-header">
          <div>
            <p className="eyebrow">Anggota Terverifikasi</p>
            <h2>Daftar Anggota PAC HPDKI Dramaga</h2>
            <p>
              Data berikut hanya menampilkan informasi umum anggota yang sudah
              divalidasi admin dan disetujui untuk tampil di halaman publik.
            </p>
          </div>

          <div className="public-members-summary">
            <strong>{members.length}</strong>
            <span>Anggota aktif</span>
          </div>
        </div>

        {isFull && (
          <div className="public-members-toolbar">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama, nomor anggota, kandang, atau wilayah"
              aria-label="Cari anggota HPDKI"
            />
          </div>
        )}

        {loading && (
          <div className="public-members-state">
            <strong>Memuat daftar anggota...</strong>
            <p>Sistem sedang mengambil data anggota terverifikasi.</p>
          </div>
        )}

        {!loading && errorMessage && (
          <div className="public-members-state public-members-state-warning">
            <strong>Daftar belum tersedia</strong>
            <p>{errorMessage}</p>
          </div>
        )}

        {!loading && !errorMessage && filteredMembers.length === 0 && (
          <div className="public-members-state">
            <strong>Belum ada anggota publik</strong>
            <p>
              Anggota akan tampil setelah admin melakukan validasi dan
              menerbitkan data anggota ke daftar publik.
            </p>
          </div>
        )}

        {!loading && !errorMessage && filteredMembers.length > 0 && (
          <div className="public-members-grid">
            {filteredMembers.map((member) => (
              <article className="public-member-card" key={member.$id}>
                <span className="public-member-number">
                  {member.member_number}
                </span>

                <h3>{member.farmer_name}</h3>

                <dl>
                  <div>
                    <dt>Kelompok/Kandang</dt>
                    <dd>{member.farm_group_name || "-"}</dd>
                  </div>

                  <div>
                    <dt>Wilayah</dt>
                    <dd>{getMemberLocation(member) || "-"}</dd>
                  </div>

                  <div>
                    <dt>Disetujui</dt>
                    <dd>{formatDate(member.approved_at)}</dd>
                  </div>
                </dl>

                <span className="public-member-status">Anggota Aktif</span>
              </article>
            ))}
          </div>
        )}

        {variant === "compact" && (
          <div className="public-members-footer">
            <Link href="/hpdki/anggota" className="secondary-button">
              Lihat Semua Anggota
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
