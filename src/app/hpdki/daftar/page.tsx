import type { Metadata } from "next";
import Link from "next/link";
import RegistrationForm from "./RegistrationForm";

import PublicBrand from "@/components/PublicBrand";
import SiteAddress from "@/components/SiteAddress";
import PublicMembersList from "@/components/hpdki/PublicMembersList";

const whatsappNumber = "6287889124342";

const temporaryWhatsappUrl =
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Halo AYT Agro Farm, saya ingin mendapatkan informasi mengenai pendaftaran anggota PAC HPDKI KEC. DRAMAGA KAB. BOGOR."
  )}`;

const isHpdkiRegistrationOpen =
  process.env.HPDKI_REGISTRATION_OPEN === "true" ||
  process.env.NEXT_PUBLIC_HPDKI_REGISTRATION_OPEN === "true";

export const metadata: Metadata = {
  title: "Pendaftaran Anggota Peternak PAC HPDKI Dramaga",
  description:
    "Formulir pendaftaran calon anggota PAC HPDKI KEC. DRAMAGA KAB. BOGOR melalui AYT Agro Farm.",
  alternates: {
    canonical: "/hpdki/daftar",
  },
};

function RegistrationLockedNotice() {
  return (
    <>
      <div className="registration-form-heading">
        <span>Pendaftaran Belum Dibuka</span>
        <h2>Pendaftaran Anggota HPDKI Untuk Sementara Dikunci</h2>
        <p>
          Saat ini sistem pendaftaran anggota PAC HPDKI Kecamatan Dramaga
          sedang dalam tahap persiapan data production dan serah terima kepada
          pengelola.
        </p>
      </div>

      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl">
          🔒
        </div>

        <h3 className="text-xl font-bold text-slate-950">
          Formulir pendaftaran belum dapat digunakan
        </h3>

        <p className="mt-3 leading-7 text-slate-700">
          Data anggota production masih dikosongkan terlebih dahulu untuk
          menghindari salah input sebelum proses serah terima resmi kepada
          klien. Form pendaftaran akan dibuka kembali setelah proses ini
          selesai.
        </p>

        <a
          href={temporaryWhatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
        >
          Tanya melalui WhatsApp
        </a>
      </div>
    </>
  );
}

export default function HpdkiRegistrationPage() {
  return (
    <main className="registration-page">
      <header className="registration-header">
        <div className="container registration-nav">
          <PublicBrand href="/" />

          <Link className="registration-back-link" href="/#hpdki">
            ← Kembali ke informasi HPDKI
          </Link>
        </div>
      </header>

      <section className="registration-hero">
        <div className="container registration-hero-grid">
          <div className="registration-intro">
            <span className="registration-kicker">
              PAC HPDKI KEC. DRAMAGA KAB. BOGOR
            </span>

            <h1>Pendaftaran Calon Anggota Peternak PAC HPDKI KEC. DRAMAGA KAB BOGOR</h1>

            <p>
              Pendaftaran anggota PAC HPDKI Kecamatan Dramaga untuk sementara
              belum dibuka karena sistem sedang dipersiapkan untuk data
              production dan proses serah terima kepada pengelola.
            </p>

            <div className="registration-process">
              <article>
                <span>01</span>
                <div>
                  <strong>Persiapan Sistem</strong>
                  <p>Database production disiapkan dalam kondisi kosong.</p>
                </div>
              </article>

              <article>
                <span>02</span>
                <div>
                  <strong>Serah Terima</strong>
                  <p>Sistem akan diserahkan kepada pengelola terlebih dahulu.</p>
                </div>
              </article>

              <article>
                <span>03</span>
                <div>
                  <strong>Pendaftaran Dibuka</strong>
                  <p>Form akan dibuka kembali setelah admin siap menerima data.</p>
                </div>
              </article>
            </div>

            <div className="registration-contact-note">
              <strong>Butuh informasi?</strong>
              <p>
                Hubungi AYT Agro Farm apabila membutuhkan informasi mengenai
                pendaftaran anggota PAC HPDKI Kecamatan Dramaga.
              </p>
              <a
                href={temporaryWhatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                Tanya melalui WhatsApp
              </a>
            </div>
          </div>

          <div className="registration-form-shell">
            {isHpdkiRegistrationOpen ? (
              <>
                <div className="registration-form-heading">
                  <span>Formulir Pendaftaran</span>
                  <h2>Data Calon Anggota Peternak</h2>
                  <p>
                    Isi data sesuai dengan kondisi peternakan atau kandang
                    yang sedang dijalankan.
                  </p>
                </div>

                <RegistrationForm />

                <PublicMembersList variant="compact" limit={6} />
              </>
            ) : (
              <RegistrationLockedNotice />
            )}
          </div>
        </div>
      </section>

      <footer className="registration-footer">
        <div className="container">
          <span>
            © {new Date().getFullYear()} AYT Agro Farm
          </span>
          <span>
            Layanan pendataan calon anggota PAC HPDKI KEC. DRAMAGA KAB. BOGOR
          </span>
        </div>

        <SiteAddress />
      </footer>
    </main>
  );
}
