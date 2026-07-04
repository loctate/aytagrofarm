import type { Metadata } from "next";
import { Suspense } from "react";

import MemberVerificationClient from "@/components/hpdki/MemberVerificationClient";

export const metadata: Metadata = {
  title: "Verifikasi Anggota PAC HPDKI Dramaga",
  description:
    "Verifikasi status keanggotaan PAC HPDKI Kecamatan Dramaga Kabupaten Bogor.",
  alternates: {
    canonical: "/hpdki/verifikasi",
  },
};

export default function HpdkiVerificationPage() {
  return (
    <Suspense
      fallback={
        <main className="member-verification-page">
          <section className="member-verification-hero">
            <div className="container member-verification-shell">
              <div className="verification-state-card">
                <strong>Memuat halaman verifikasi...</strong>
                <p>Mohon tunggu sebentar.</p>
              </div>
            </div>
          </section>
        </main>
      }
    >
      <MemberVerificationClient />
    </Suspense>
  );
}
