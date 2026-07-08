"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

import type { PublicHpdkiMemberRecord } from "@/lib/appwrite/members";
import {
  defaultHpdkiKtaSettings,
  type HpdkiKtaSettingsRecord,
} from "@/lib/appwrite/kta-settings";

type HpdkiMemberCardProps = {
  member: PublicHpdkiMemberRecord;
  verificationUrl: string;
  settings?: HpdkiKtaSettingsRecord;
};

const organizationLineOne = "PAC HPDKI";
const organizationLineTwo = "KECAMATAN DRAMAGA";
const organizationLineThree = "KABUPATEN BOGOR";
const organizationName = `${organizationLineOne} ${organizationLineTwo}`;
const organizationRegion = organizationLineThree;

function getValidUntil(value: string | null, validityYears: number) {
  const sourceDate = value ? new Date(value) : new Date();

  if (Number.isNaN(sourceDate.getTime())) {
    return `31 Desember ${new Date().getFullYear() + validityYears}`;
  }

  const validYear = sourceDate.getFullYear() + validityYears;

  return `31 Desember ${validYear}`;
}

function getAddress(member: PublicHpdkiMemberRecord) {
  return [member.village, member.district, member.regency]
    .filter(Boolean)
    .join(", ");
}


export default function HpdkiMemberCard({
  member,
  verificationUrl,
  settings = defaultHpdkiKtaSettings,
}: HpdkiMemberCardProps) {
  const address = getAddress(member);
  const validUntil = getValidUntil(
    member.approved_at,
    settings.validity_years,
  );
  const terms = (settings.card_terms || defaultHpdkiKtaSettings.card_terms || "")
    .split("\n")
    .map((term) => term.trim())
    .filter(Boolean);

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

          <p>{organizationLineOne}</p>
          <p>{organizationLineTwo}</p>
          <p>{organizationLineThree}</p>

          <div className="kta-card-qr-box">
            <div className="kta-card-qr-code" aria-label="QR verifikasi KTA">
              <QRCodeSVG
                value={verificationUrl}
                size={180}
                level="M"
                includeMargin
              />
            </div>
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

          <div className="kta-card-signatures">
            <div className="kta-card-signature">
              <span>{settings.chairman_title}</span>
              <Image
                src="/images/ttd-ketua-hpdki.png"
                alt="Tanda tangan Ketua PAC HPDKI Kecamatan Dramaga"
                width={180}
                height={72}
                className="kta-card-signature-image"
              />
              <strong>{settings.chairman_name}</strong>
            </div>

            <div className="kta-card-signature">
              <span>{settings.vice_chairman_title}</span>
              <div className="kta-card-signature-placeholder" />
              <strong>{settings.vice_chairman_name}</strong>
            </div>
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
          {terms.map((term) => (
            <li key={term}>{term}</li>
          ))}
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
            <span>{settings.secretariat_address || "-"}</span>
          </div>

          <div>
            <span>{settings.secretariat_contact || "-"}</span>
          </div>
        </footer>
      </article>

      <p className="kta-print-size-note">
        Ukuran cetak acuan: 85.6 mm × 54 mm, landscape.
      </p>
    </div>
  );
}
