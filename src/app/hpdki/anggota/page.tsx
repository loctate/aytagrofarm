import type { Metadata } from "next";
import Link from "next/link";

import PublicMembersList from "@/components/hpdki/PublicMembersList";

export const metadata: Metadata = {
  title: "Daftar Anggota PAC HPDKI Dramaga",
  description:
    "Daftar anggota terverifikasi PAC HPDKI Kecamatan Dramaga Kabupaten Bogor.",
  alternates: {
    canonical: "/hpdki/anggota",
  },
};

export default function HpdkiMembersPage() {
  return (
    <main className="public-members-page">
      <section className="public-members-hero">
        <div className="container public-members-hero-content">
          <Link href="/hpdki" className="hpdki-profile-back-link">
            ← Kembali ke halaman HPDKI
          </Link>

          <p className="eyebrow">Database Anggota</p>

          <h1>
            Daftar Anggota Terverifikasi
            <span>PAC HPDKI Kecamatan Dramaga</span>
          </h1>

          <p>
            Halaman ini menampilkan data umum anggota aktif yang sudah melalui
            proses validasi admin. Data pribadi seperti nomor WhatsApp dan
            alamat lengkap tidak ditampilkan.
          </p>
        </div>
      </section>

      <PublicMembersList variant="full" limit={100} />
    </main>
  );
}
