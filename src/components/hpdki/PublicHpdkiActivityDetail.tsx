"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getHpdkiActivityPhotoUrl,
  getPublishedHpdkiActivityBySlug,
  type HpdkiActivityRecord,
} from "@/lib/appwrite/hpdki-activities";

type PublicHpdkiActivityDetailProps = {
  slug: string;
};

function formatDate(value: string) {
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

function splitContent(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default function PublicHpdkiActivityDetail({
  slug,
}: PublicHpdkiActivityDetailProps) {
  const [activity, setActivity] =
    useState<HpdkiActivityRecord | null>(null);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activePhotoIndex, setActivePhotoIndex] =
    useState(0);

  useEffect(() => {
    let active = true;

    const timer = window.setTimeout(() => {
      async function loadActivity() {
        setLoading(true);
        setNotFound(false);
        setErrorMessage("");

        try {
          const row =
            await getPublishedHpdkiActivityBySlug(
              slug,
            );

          if (!active) {
            return;
          }

          if (!row) {
            setActivity(null);
            setNotFound(true);
            return;
          }

          setActivity(row);
          setActivePhotoIndex(0);
        } catch (error) {
          console.error(
            "Gagal memuat detail kegiatan:",
            error,
          );

          if (active) {
            setErrorMessage(
              "Detail kegiatan belum dapat dimuat.",
            );
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }

      void loadActivity();
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [slug]);

  const photoIds = useMemo(() => {
    if (!activity) {
      return [];
    }

    return Array.from(
      new Set(
        [
          activity.cover_file_id,
          ...(activity.photo_file_ids ?? []),
        ].filter(Boolean),
      ),
    );
  }, [activity]);

  const showPreviousPhoto = () => {
    if (photoIds.length <= 1) {
      return;
    }

    setActivePhotoIndex((current) =>
      current === 0
        ? photoIds.length - 1
        : current - 1,
    );
  };

  const showNextPhoto = () => {
    if (photoIds.length <= 1) {
      return;
    }

    setActivePhotoIndex((current) =>
      current === photoIds.length - 1
        ? 0
        : current + 1,
    );
  };

  if (loading) {
    return (
      <main className="hpdki-kegiatan-detail-page">
        <section className="hpdki-kegiatan-public-state">
          <strong>Memuat kegiatan...</strong>
        </section>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="hpdki-kegiatan-detail-page">
        <section className="hpdki-kegiatan-public-state">
          <strong>Kegiatan tidak ditemukan</strong>

          <p>
            Kegiatan belum dipublikasikan atau sudah
            tidak tersedia.
          </p>

          <Link href="/hpdki/kegiatan">
            Kembali ke Kegiatan HPDKI
          </Link>
        </section>
      </main>
    );
  }

  if (errorMessage || !activity) {
    return (
      <main className="hpdki-kegiatan-detail-page">
        <section className="hpdki-kegiatan-public-state is-error">
          <strong>Detail belum dapat dimuat</strong>

          <p>{errorMessage}</p>

          <Link href="/hpdki/kegiatan">
            Kembali ke Kegiatan HPDKI
          </Link>
        </section>
      </main>
    );
  }

  const activePhotoId =
    photoIds[activePhotoIndex] ?? "";

  return (
    <main className="hpdki-kegiatan-detail-page">
      <article className="hpdki-kegiatan-detail hpdki-kegiatan-slider-detail">
        <Link
          href="/hpdki/kegiatan"
          className="hpdki-kegiatan-back-link"
        >
          <span aria-hidden="true">←</span>
          Kembali ke Kegiatan HPDKI
        </Link>

        <header className="hpdki-kegiatan-detail-header">
          <div className="hpdki-kegiatan-detail-heading">
            <p className="hpdki-kegiatan-eyebrow">
              {activity.category}
            </p>

            <h1>{activity.title}</h1>
          </div>

          <div className="hpdki-kegiatan-detail-meta">
            <span>
              {formatDate(activity.event_date)}
            </span>

            <span>{activity.location}</span>
          </div>

          <p className="hpdki-kegiatan-detail-summary">
            {activity.excerpt}
          </p>
        </header>

        {activePhotoId ? (
          <section
            className="hpdki-activity-slider"
            aria-label="Foto kegiatan"
          >
            <div className="hpdki-activity-slider-stage">
              <Image
                key={activePhotoId}
                src={getHpdkiActivityPhotoUrl(
                  activePhotoId,
                )}
                alt={`${activity.title} - foto ${
                  activePhotoIndex + 1
                }`}
                fill
                priority={activePhotoIndex === 0}
                unoptimized
                sizes="(max-width: 1100px) 100vw, 1100px"
              />

              {photoIds.length > 1 && (
                <>
                  <button
                    type="button"
                    className="hpdki-slider-arrow is-previous"
                    onClick={showPreviousPhoto}
                    aria-label="Lihat foto sebelumnya"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    className="hpdki-slider-arrow is-next"
                    onClick={showNextPhoto}
                    aria-label="Lihat foto berikutnya"
                  >
                    ›
                  </button>
                </>
              )}

              <span className="hpdki-slider-counter">
                {activePhotoIndex + 1} / {photoIds.length}
              </span>
            </div>

            {photoIds.length > 1 && (
              <div
                className="hpdki-slider-dots"
                aria-label="Pilih foto kegiatan"
              >
                {photoIds.map((fileId, index) => (
                  <button
                    key={fileId}
                    type="button"
                    className={
                      index === activePhotoIndex
                        ? "is-active"
                        : ""
                    }
                    onClick={() =>
                      setActivePhotoIndex(index)
                    }
                    aria-label={`Tampilkan foto ${
                      index + 1
                    }`}
                    aria-current={
                      index === activePhotoIndex
                        ? "true"
                        : undefined
                    }
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="hpdki-activity-slider-empty">
            <span>{activity.category}</span>

            <strong>
              {activity.image_label || activity.title}
            </strong>
          </section>
        )}

        <section className="hpdki-kegiatan-article-layout">
          <div className="hpdki-kegiatan-article-label">
            <span>Dokumentasi Kegiatan</span>
            <h2>Tentang Kegiatan</h2>
          </div>

          <div className="hpdki-kegiatan-detail-content">
            {splitContent(activity.content).map(
              (paragraph, index) => (
                <p key={`${index}-${paragraph}`}>
                  {paragraph}
                </p>
              ),
            )}
          </div>
        </section>

        <section className="hpdki-kegiatan-detail-cta">
          <h2>
            Ingin bergabung sebagai anggota peternak?
          </h2>

          <p>
            Peternak wilayah Dramaga dan sekitarnya
            dapat mendaftar melalui form pendaftaran
            anggota PAC HPDKI Kecamatan Dramaga.
          </p>

          <Link href="/hpdki/daftar">
            Daftar Anggota HPDKI
          </Link>
        </section>
      </article>
    </main>
  );
}
