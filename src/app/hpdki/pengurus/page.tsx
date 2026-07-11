import Image from "next/image";
import Link from "next/link";

import {
  getHpdkiPengurusByGroup,
  hpdkiPengurusPeriod,
  type HpdkiPengurus,
} from "@/data/hpdki-pengurus";

export const metadata = {
  title:
    "Struktur Pengurus | PAC HPDKI Kecamatan Dramaga",
  description:
    "Susunan pengurus PAC HPDKI Kecamatan Dramaga periode 2025–2030.",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00+07:00`));
}

function getInitials(name: string) {
  return name
    .replace(/,.*$/, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function PengurusCard({
  person,
  featured = false,
}: {
  person: HpdkiPengurus;
  featured?: boolean;
}) {
  return (
    <article
      className={
        featured
          ? "hpdki-pengurus-card is-featured"
          : "hpdki-pengurus-card"
      }
    >
      <div
        className="hpdki-pengurus-avatar"
        aria-hidden="true"
      >
        {getInitials(person.name)}
      </div>

      <div className="hpdki-pengurus-card-content">
        <span>{person.role}</span>

        <h3>{person.name}</h3>

        {person.note && <p>{person.note}</p>}
      </div>
    </article>
  );
}

export default function HpdkiPengurusPage() {
  const pelindung =
    getHpdkiPengurusByGroup("pelindung");

  const pembina =
    getHpdkiPengurusByGroup("pembina");

  const penasihat =
    getHpdkiPengurusByGroup("penasihat");

  const pengurusHarian =
    getHpdkiPengurusByGroup("harian");

  const ketua = pengurusHarian.find(
    (person) => person.role === "Ketua",
  );

  const pengurusHarianLainnya =
    pengurusHarian.filter(
      (person) => person.role !== "Ketua",
    );

  return (
    <main className="hpdki-pengurus-page">
      <section className="hpdki-pengurus-hero">
        <Link
          href="/hpdki"
          className="hpdki-pengurus-back-link"
        >
          ← Kembali ke HPDKI
        </Link>

        <div className="hpdki-pengurus-hero-brand">
          <Image
            src="/images/hpdki-pac-logo.png"
            alt="Logo PAC HPDKI Kecamatan Dramaga"
            width={132}
            height={132}
            priority
          />

          <div>
            <p>PAC HPDKI Kecamatan Dramaga</p>

            <h1>Struktur Pengurus</h1>

            <span>
              Periode {hpdkiPengurusPeriod.startYear}–
              {hpdkiPengurusPeriod.endYear}
            </span>
          </div>
        </div>

        <p className="hpdki-pengurus-hero-description">
          Susunan pengurus PAC HPDKI Kecamatan Dramaga
          yang menjalankan fungsi perlindungan,
          pembinaan, penasihatan, serta pengelolaan
          organisasi.
        </p>
      </section>

      <section className="hpdki-pengurus-section">
        <div className="hpdki-pengurus-section-heading">
          <span>Unsur Kehormatan</span>
          <h2>Pelindung dan Pembina</h2>
        </div>

        <div className="hpdki-pengurus-grid is-two-columns">
          {[...pelindung, ...pembina].map((person) => (
            <PengurusCard
              key={person.id}
              person={person}
            />
          ))}
        </div>
      </section>

      <section className="hpdki-pengurus-section">
        <div className="hpdki-pengurus-section-heading">
          <span>Arahan Organisasi</span>
          <h2>Dewan Penasihat</h2>
        </div>

        <div className="hpdki-pengurus-grid is-centered">
          {penasihat.map((person) => (
            <PengurusCard
              key={person.id}
              person={person}
            />
          ))}
        </div>
      </section>

      <section className="hpdki-pengurus-section is-executive">
        <div className="hpdki-pengurus-section-heading">
          <span>Pengurus Harian</span>

          <h2>Pimpinan dan Pengelola Organisasi</h2>
        </div>

        {ketua && (
          <div className="hpdki-pengurus-chairman">
            <PengurusCard
              person={ketua}
              featured
            />
          </div>
        )}

        <div className="hpdki-pengurus-connector">
          <span />
        </div>

        <div className="hpdki-pengurus-grid is-three-columns">
          {pengurusHarianLainnya.map((person) => (
            <PengurusCard
              key={person.id}
              person={person}
            />
          ))}
        </div>
      </section>

      <section className="hpdki-pengurus-document">
        <div>
          <span>Dokumen Penetapan</span>

          <h2>
            Susunan Pengurus Periode{" "}
            {hpdkiPengurusPeriod.startYear}–
            {hpdkiPengurusPeriod.endYear}
          </h2>

          <p>
            Ditetapkan di{" "}
            {hpdkiPengurusPeriod.establishedAt} pada{" "}
            {formatDate(
              hpdkiPengurusPeriod.establishedDate,
            )}
            .
          </p>
        </div>

        <dl>
          <div>
            <dt>Penandatangan</dt>
            <dd>{hpdkiPengurusPeriod.signerName}</dd>
          </div>

          <div>
            <dt>Jabatan</dt>
            <dd>{hpdkiPengurusPeriod.signerRole}</dd>
          </div>

          <div>
            <dt>Masa Bakti</dt>
            <dd>
              {hpdkiPengurusPeriod.startYear}–
              {hpdkiPengurusPeriod.endYear}
            </dd>
          </div>
        </dl>
      </section>

      <section className="hpdki-pengurus-cta">
        <div>
          <span>PAC HPDKI Kecamatan Dramaga</span>

          <h2>
            Bersama membangun peternak yang lebih kuat
          </h2>

          <p>
            Kenali kegiatan organisasi dan proses
            pendaftaran anggota peternak di Kecamatan
            Dramaga.
          </p>
        </div>

        <div>
          <Link href="/hpdki/kegiatan">
            Lihat Kegiatan
          </Link>

          <Link
            href="/hpdki/daftar"
            className="secondary"
          >
            Daftar Anggota
          </Link>
        </div>
      </section>
    </main>
  );
}
