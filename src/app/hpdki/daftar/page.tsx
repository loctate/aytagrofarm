import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import RegistrationForm from "./RegistrationForm";

const whatsappNumber = "6287889124342";

const temporaryWhatsappUrl =
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Halo AYT Agro Farm, saya ingin mendapatkan informasi mengenai pendaftaran anggota PAC HPDKI KEC. DRAMAGA KAB. BOGOR."
  )}`;

export const metadata: Metadata = {
  title: "Pendaftaran Anggota Peternak PAC HPDKI Dramaga",
  description:
    "Formulir pendaftaran calon anggota PAC HPDKI KEC. DRAMAGA KAB. BOGOR melalui AYT Agro Farm.",
  alternates: {
    canonical: "/hpdki/daftar",
  },
};

export default function HpdkiRegistrationPage() {
  return (
    <main className="registration-page">
      <header className="registration-header">
        <div className="container registration-nav">
          <Link className="brand" href="/" aria-label="Kembali ke AYT Agro Farm">
            <span className="brand-logo">
              <Image
                src="/images/ayt-logo-mark.png"
                alt="Logo AYT Agro Farm"
                width={58}
                height={58}
                priority
              />
            </span>

            <span className="brand-text">
              <strong>
                AYT <em>AGRO FARM</em>
              </strong>
              <small className="brand-services">
                <span>BREEDING, FATTENING, TRADING</span>
                <span>HILIR, FROZEN, PENYEMBELIHAN</span>
              </small>
            </span>
          </Link>

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
              Lengkapi data awal pendaftaran. Setelah formulir resmi dikirim,
              admin AYT Agro Farm akan melakukan pemeriksaan dan menghubungi
              calon anggota melalui WhatsApp.
            </p>

            <div className="registration-process">
              <article>
                <span>01</span>
                <div>
                  <strong>Lengkapi Data</strong>
                  <p>Isi informasi pribadi dan data dasar peternakan.</p>
                </div>
              </article>

              <article>
                <span>02</span>
                <div>
                  <strong>Pemeriksaan Admin</strong>
                  <p>Data diperiksa untuk memastikan kelengkapannya.</p>
                </div>
              </article>

              <article>
                <span>03</span>
                <div>
                  <strong>Konfirmasi WhatsApp</strong>
                  <p>Admin menghubungi calon anggota melalui nomor WhatsApp.</p>
                </div>
              </article>
            </div>

            <div className="registration-contact-note">
              <strong>Butuh bantuan?</strong>
              <p>
                Hubungi AYT Agro Farm apabila membutuhkan informasi sebelum
                mengisi formulir.
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
            <div className="registration-form-heading">
              <span>Formulir Pendaftaran</span>
              <h2>Data Calon Anggota Peternak</h2>
              <p>
                Isi data sesuai dengan kondisi peternakan atau kandang
                yang sedang dijalankan.
              </p>
            </div>

            <RegistrationForm />
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
      </footer>
    </main>
  );
}
