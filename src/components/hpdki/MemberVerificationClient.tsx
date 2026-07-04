"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getHpdkiMemberByNumber,
  type PublicHpdkiMemberRecord,
} from "@/lib/appwrite/members";

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

function getStatusLabel(status: PublicHpdkiMemberRecord["membership_status"]) {
  if (status === "active") {
    return "Anggota Aktif";
  }

  if (status === "inactive") {
    return "Anggota Nonaktif";
  }

  if (status === "suspended") {
    return "Keanggotaan Dibekukan";
  }

  if (status === "expired") {
    return "Keanggotaan Kedaluwarsa";
  }

  return status;
}

export default function MemberVerificationClient() {
  const searchParams = useSearchParams();
  const numberFromUrl = searchParams.get("nomor") ?? "";

  const [memberNumber, setMemberNumber] = useState(numberFromUrl);
  const [member, setMember] = useState<PublicHpdkiMemberRecord | null>(null);
  const [loading, setLoading] = useState(Boolean(numberFromUrl));
  const [searched, setSearched] = useState(Boolean(numberFromUrl));
  const [errorMessage, setErrorMessage] = useState("");

  const normalizedNumber = useMemo(
    () => memberNumber.trim().toUpperCase(),
    [memberNumber],
  );

  const verifyMember = useCallback(
    async (value = normalizedNumber) => {
      const number = value.trim().toUpperCase();

      if (!number) {
        setSearched(false);
        setMember(null);
        setErrorMessage("");
        return;
      }

      setLoading(true);
      setSearched(true);
      setErrorMessage("");

      try {
        const row = await getHpdkiMemberByNumber(number);
        setMember(row);
      } catch (error) {
        console.error("Gagal memverifikasi anggota:", error);
        setErrorMessage(
          "Verifikasi belum dapat dilakukan. Pastikan koneksi dan konfigurasi Appwrite sudah benar.",
        );
        setMember(null);
      } finally {
        setLoading(false);
      }
    },
    [normalizedNumber],
  );

  useEffect(() => {
    if (!numberFromUrl) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setMemberNumber(numberFromUrl);
      void verifyMember(numberFromUrl);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [numberFromUrl, verifyMember]);

  const isActive = member?.membership_status === "active";

  return (
    <main className="member-verification-page">
      <section className="member-verification-hero">
        <div className="container member-verification-shell">
          <div className="member-verification-intro">
            <Link href="/hpdki" className="hpdki-profile-back-link">
              ← Kembali ke halaman HPDKI
            </Link>

            <p className="eyebrow">Verifikasi Keanggotaan</p>

            <h1>
              Verifikasi Anggota
              <span>PAC HPDKI Dramaga</span>
            </h1>

            <p>
              Masukkan nomor anggota untuk mengecek status keanggotaan PAC
              HPDKI Kecamatan Dramaga Kabupaten Bogor.
            </p>

            <form
              className="member-verification-form"
              onSubmit={(event) => {
                event.preventDefault();
                void verifyMember();
              }}
            >
              <input
                type="text"
                value={memberNumber}
                onChange={(event) => setMemberNumber(event.target.value)}
                placeholder="HPDKI-PAC-DRAMAGA-2026-001"
                aria-label="Nomor anggota"
              />

              <button type="submit" disabled={loading}>
                {loading ? "Memeriksa..." : "Verifikasi"}
              </button>
            </form>
          </div>

          <div className="member-verification-result">
            {!searched && (
              <div className="verification-state-card">
                <strong>Masukkan nomor anggota</strong>
                <p>
                  Hasil verifikasi akan muncul setelah nomor anggota dimasukkan.
                </p>
              </div>
            )}

            {loading && (
              <div className="verification-state-card">
                <strong>Memeriksa data...</strong>
                <p>Sistem sedang mencari nomor anggota di database.</p>
              </div>
            )}

            {!loading && errorMessage && (
              <div className="verification-state-card verification-state-warning">
                <strong>Verifikasi gagal</strong>
                <p>{errorMessage}</p>
              </div>
            )}

            {!loading && searched && !errorMessage && !member && (
              <div className="verification-state-card verification-state-danger">
                <span>Tidak Ditemukan</span>
                <strong>Nomor anggota tidak terdaftar</strong>
                <p>
                  Pastikan nomor anggota sudah benar, termasuk tahun dan nomor
                  urut.
                </p>
              </div>
            )}

            {!loading && member && (
              <article
                className={
                  isActive
                    ? "verification-member-card verification-member-card-active"
                    : "verification-member-card verification-member-card-inactive"
                }
              >
                <span>{isActive ? "KTA TERVERIFIKASI" : "DATA TERDAFTAR"}</span>

                <h2>{getStatusLabel(member.membership_status)}</h2>

                <dl>
                  <div>
                    <dt>Nomor Anggota</dt>
                    <dd>{member.member_number}</dd>
                  </div>

                  <div>
                    <dt>Nama Anggota</dt>
                    <dd>{member.farmer_name}</dd>
                  </div>

                  <div>
                    <dt>Kelompok/Kandang</dt>
                    <dd>{member.farm_group_name || "-"}</dd>
                  </div>

                  <div>
                    <dt>Wilayah</dt>
                    <dd>{getLocation(member) || "-"}</dd>
                  </div>

                  <div>
                    <dt>Tanggal Disetujui</dt>
                    <dd>{formatDate(member.approved_at)}</dd>
                  </div>
                </dl>

                <p>
                  {isActive
                    ? "Nomor ini tercatat sebagai anggota aktif PAC HPDKI Kecamatan Dramaga."
                    : "Nomor ini tercatat di database, tetapi status keanggotaan tidak aktif untuk publik saat ini."}
                </p>
              </article>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
