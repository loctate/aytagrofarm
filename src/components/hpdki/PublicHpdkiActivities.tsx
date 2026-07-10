"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getHpdkiActivityPhotoUrl,
  listPublishedHpdkiActivities,
  type HpdkiActivityRecord,
} from "@/lib/appwrite/hpdki-activities";

export default function PublicHpdkiActivities() {
  const [activities, setActivities] = useState<
    HpdkiActivityRecord[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadActivities = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const rows =
        await listPublishedHpdkiActivities();

      setActivities(rows);
    } catch (error) {
      console.error(
        "Gagal memuat kegiatan HPDKI:",
        error,
      );

      setErrorMessage(
        "Dokumentasi kegiatan belum dapat dimuat. Silakan coba kembali.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadActivities();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadActivities]);

  if (loading) {
    return (
      <section className="hpdki-kegiatan-public-state">
        <strong>Memuat dokumentasi kegiatan...</strong>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="hpdki-kegiatan-public-state is-error">
        <strong>Dokumentasi belum dapat dimuat</strong>

        <p>{errorMessage}</p>

        <button
          type="button"
          onClick={() => void loadActivities()}
        >
          Coba Lagi
        </button>
      </section>
    );
  }

  if (activities.length === 0) {
    return (
      <section className="hpdki-kegiatan-public-state">
        <strong>
          Belum ada kegiatan yang dipublikasikan
        </strong>

        <p>
          Dokumentasi kegiatan PAC HPDKI Kecamatan
          Dramaga akan tampil di halaman ini.
        </p>
      </section>
    );
  }

  return (
    <section className="hpdki-kegiatan-grid hpdki-kegiatan-simple-grid">
      {activities.map((activity) => {
        const coverUrl =
          getHpdkiActivityPhotoUrl(
            activity.cover_file_id,
          );

        return (
          <article
            key={activity.$id}
            className="hpdki-kegiatan-card hpdki-kegiatan-simple-card"
          >
            <Link
              href={`/hpdki/kegiatan/${activity.slug}`}
              className="hpdki-kegiatan-simple-image"
              aria-label={`Lihat kegiatan ${activity.title}`}
            >
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={activity.title}
                  fill
                  unoptimized
                  sizes="(max-width: 760px) 100vw, 50vw"
                />
              ) : (
                <div className="hpdki-kegiatan-image-placeholder">
                  <span>{activity.category}</span>

                  <strong>
                    {activity.image_label ||
                      activity.title}
                  </strong>
                </div>
              )}
            </Link>

            <div className="hpdki-kegiatan-simple-body">
              <h2>{activity.title}</h2>

              <Link
                href={`/hpdki/kegiatan/${activity.slug}`}
                className="hpdki-kegiatan-simple-link"
              >
                Lihat Kegiatan
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        );
      })}
    </section>
  );
}
