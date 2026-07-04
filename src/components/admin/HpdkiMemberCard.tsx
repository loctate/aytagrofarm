"use client";

import Image from "next/image";

import type { PublicHpdkiMemberRecord } from "@/lib/appwrite/members";

type HpdkiMemberCardProps = {
  member: PublicHpdkiMemberRecord;
  verificationUrl: string;
};

const organizationName = "PAC HPDKI KECAMATAN DRAMAGA";
const organizationRegion = "KABUPATEN BOGOR";
const chairmanName = "Salman Asidiqi";
const chairmanNumber = "012025001";


function getValidUntil(value: string | null) {
  const sourceDate = value ? new Date(value) : new Date();

  if (Number.isNaN(sourceDate.getTime())) {
    return "31 Desember 2030";
  }

  const validYear = sourceDate.getFullYear() + 5;

  return `31 Desember ${validYear}`;
}

function getAddress(member: PublicHpdkiMemberRecord) {
  return [member.village, member.district, member.regency]
    .filter(Boolean)
    .join(", ");
}

function getQrCodeUrl(verificationUrl: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(
    verificationUrl,
  )}`;
}

export default function HpdkiMemberCard({
  member,
  verificationUrl,
}: HpdkiMemberCardProps) {
  const address = getAddress(member);
  const validUntil = getValidUntil(member.approved_at);

  return (
    <div className="kta-preview-canvas" aria-label="Preview KTA anggota">
      <article className="kta-card-design kta-card-front">
        <div className="kta-card-dark-panel">
          <div className="kta-card-logo-frame">
            <Image
              src="/images/hpdki-pac-logo.png"
              alt="Logo HPDKI PAC Dramaga"
              width={180}
              height={180}
              className="kta-card-logo"
            />
          </div>

          <div className="kta-card-front-title">
            <strong>KARTU</strong>
            <strong>ANGGOTA</strong>
          </div>

          <p>{organizationName}</p>
          <p>{organizationRegion}</p>

          <div className="kta-card-qr-box">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getQrCodeUrl(verificationUrl)} alt="QR verifikasi KTA" />
            <span>Pindai untuk verifikasi</span>
          </div>
        </div>

        <div className="kta-card-light-panel">
          <div className="kta-card-name-plate">
            <span>👤</span>
            <strong>{member.farmer_name}</strong>
          </div>

          <dl className="kta-card-data-list">
            <div>
              <dt>Nomor Anggota</dt>
              <dd>{member.member_number}</dd>
            </div>

            <div>
              <dt>Nama Farm/PDP</dt>
              <dd>{member.farm_group_name || "-"}</dd>
            </div>

            <div>
              <dt>Alamat</dt>
              <dd>{address || "-"}</dd>
            </div>

            <div>
              <dt>Masa Berlaku</dt>
              <dd>{validUntil}</dd>
            </div>
          </dl>

          <div className="kta-card-signature">
            <span>Ketua PAC HPDKI Kec. Dramaga</span>
<Image
  src="/images/ttd-ketua-hpdki.png"
  alt="Tanda tangan Ketua PAC HPDKI Kecamatan Dramaga"
  width={180}
  height={72}
  className="kta-card-signature-image"
/>
            <strong>{chairmanName}</strong>
            <small>{chairmanNumber}</small>
          </div>
        </div>
      </article>

      <article className="kta-card-design kta-card-back">
        <div className="kta-card-back-watermark">♈</div>

        <header className="kta-card-back-heading">
          <span>📋</span>
          <strong>Syarat dan Ketentuan</strong>
        </header>

        <ul className="kta-card-terms">
          <li>
            Kartu Tanda Anggota (KTA) ini adalah milik PAC HPDKI Kecamatan
            Dramaga.
          </li>
          <li>
            Kartu ini berlaku selama anggota terdaftar dan masih aktif dalam
            organisasi.
          </li>
          <li>
            Kartu ini berlaku selama 5 (lima) tahun terhitung sejak tanggal
            diterbitkan.
          </li>
          <li>
            Anggota wajib mematuhi AD/ART, peraturan, dan keputusan organisasi.
          </li>
          <li>Kartu ini tidak dapat dipindahtangankan kepada pihak lain.</li>
          <li>
            Jika kartu hilang atau rusak, harap segera menghubungi Sekretariat
            PAC HPDKI Kecamatan Dramaga.
          </li>
        </ul>

        <div className="kta-card-back-identity">
          <Image
            src="/images/hpdki-pac-logo.png"
            alt="Logo HPDKI PAC Dramaga"
            width={76}
            height={76}
            className="kta-card-back-logo"
          />

          <div>
            <strong>{organizationName}</strong>
            <span>Himpunan Peternak Domba dan Kambing Indonesia</span>
            <em>Bersatu • Berdaya • Berjaya</em>
          </div>
        </div>

        <footer className="kta-card-back-footer">
          <div>
            <strong>Sekretariat:</strong>
            <span>
              Kp. Sukabakti, Sukawening, Dramaga, Kabupaten Bogor
            </span>
          </div>

          <div>
            <span>☎ 0812 1025 001</span>
            <span>✉ sekretariat.dramaga@hpdki.or.id</span>
          </div>
        </footer>
      </article>

      <p className="kta-print-size-note">
        Ukuran cetak acuan: 85.6 mm × 54 mm, landscape.
      </p>
    </div>
  );
}
