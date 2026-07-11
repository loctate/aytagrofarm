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

      <div className="registration-locked-card">
        <div className="registration-locked-icon" aria-hidden="true">
          🔒
        </div>

        <div>
          <h3>Formulir pendaftaran belum dapat digunakan</h3>

          <p>
            Data anggota production masih dikosongkan terlebih dahulu untuk
            menghindari salah input sebelum proses serah terima resmi kepada
            klien. Form pendaftaran akan dibuka kembali setelah proses ini
            selesai.
          </p>

          <a
            href={temporaryWhatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="registration-locked-whatsapp"
          >
            Tanya melalui WhatsApp
          </a>
        </div>
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
              Pendaftaran calon anggota PAC HPDKI Kecamatan Dramaga telah
              dibuka. Silakan isi data peternak dan kondisi peternakan dengan
              lengkap dan benar untuk proses pemeriksaan oleh pengelola.
            </p>

            <div className="registration-process">
              <article>
                <span>01</span>
                <div>
                  <strong>Isi Formulir</strong>
                  <p>Lengkapi data pribadi dan informasi peternakan.</p>
                </div>
              </article>

              <article>
                <span>02</span>
                <div>
                  <strong>Pemeriksaan Data</strong>
                  <p>Admin akan memeriksa kelengkapan dan kebenaran data.</p>
                </div>
              </article>

              <article>
                <span>03</span>
                <div>
                  <strong>Persetujuan Anggota</strong>
                  <p>Data yang memenuhi persyaratan dapat diterbitkan sebagai anggota.</p>
                </div>
              </article>
            </div>

            <div className="registration-contact-note">
              <strong>Butuh informasi?</strong>
              <p>
                Hubungi AYT Agro Farm apabila membutuhkan bantuan dalam
                pengisian atau proses pendaftaran anggota PAC HPDKI Kecamatan Dramaga.
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
