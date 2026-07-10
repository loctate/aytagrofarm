"use client";

import Image from "next/image";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createHpdkiActivity,
  createHpdkiActivitySlug,
  deleteHpdkiActivity,
  deleteHpdkiActivityPhoto,
  getHpdkiActivityPhotoUrl,
  hpdkiActivityCategories,
  listAllHpdkiActivities,
  updateHpdkiActivity,
  uploadHpdkiActivityPhoto,
  type HpdkiActivityCategory,
  type HpdkiActivityRecord,
  type HpdkiActivityStatus,
} from "@/lib/appwrite/hpdki-activities";

type ActivityFormState = {
  title: string;
  slug: string;
  event_date: string;
  location: string;
  category: HpdkiActivityCategory;
  excerpt: string;
  content: string;
  image_label: string;
  status: HpdkiActivityStatus;
};

const emptyForm: ActivityFormState = {
  title: "",
  slug: "",
  event_date: new Date().toISOString().slice(0, 10),
  location: "Dramaga, Kabupaten Bogor",
  category: "Organisasi",
  excerpt: "",
  content: "",
  image_label: "",
  status: "draft",
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

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Terjadi kesalahan. Silakan coba kembali.";
}

export default function AdminHpdkiActivitiesPanel() {
  const [activities, setActivities] = useState<
    HpdkiActivityRecord[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] =
    useState<HpdkiActivityRecord | null>(null);

  const [form, setForm] =
    useState<ActivityFormState>(emptyForm);

  const [photoIds, setPhotoIds] = useState<string[]>([]);
  const [coverFileId, setCoverFileId] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | HpdkiActivityStatus>("all");

  const loadActivities = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const rows = await listAllHpdkiActivities();
      setActivities(rows);
    } catch (error) {
      console.error("Gagal memuat kegiatan:", error);
      setErrorMessage(
        "Data kegiatan belum dapat dimuat. Periksa table, index, dan permission Appwrite.",
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

  const filteredActivities = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return activities.filter((activity) => {
      const matchesStatus =
        statusFilter === "all" ||
        activity.status === statusFilter;

      const searchableText = [
        activity.title,
        activity.slug,
        activity.location,
        activity.category,
        activity.excerpt,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesStatus &&
        (!keyword || searchableText.includes(keyword))
      );
    });
  }, [activities, search, statusFilter]);

  const closeEditor = () => {
    if (saving || uploading || deleting) {
      return;
    }

    setEditorOpen(false);
    setSelectedActivity(null);
    setForm(emptyForm);
    setPhotoIds([]);
    setCoverFileId("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const openCreateEditor = () => {
    setSelectedActivity(null);
    setForm({
      ...emptyForm,
      event_date: new Date().toISOString().slice(0, 10),
    });
    setPhotoIds([]);
    setCoverFileId("");
    setErrorMessage("");
    setSuccessMessage("");
    setEditorOpen(true);
  };

  const openEditEditor = (
    activity: HpdkiActivityRecord,
  ) => {
    setSelectedActivity(activity);
    setForm({
      title: activity.title,
      slug: activity.slug,
      event_date: activity.event_date.slice(0, 10),
      location: activity.location,
      category: activity.category,
      excerpt: activity.excerpt,
      content: activity.content,
      image_label: activity.image_label,
      status: activity.status,
    });
    setPhotoIds(activity.photo_file_ids ?? []);
    setCoverFileId(activity.cover_file_id ?? "");
    setErrorMessage("");
    setSuccessMessage("");
    setEditorOpen(true);
  };

  const setField = <Key extends keyof ActivityFormState>(
    key: Key,
    value: ActivityFormState[Key],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleTitleChange = (value: string) => {
    setForm((current) => ({
      ...current,
      title: value,
      slug:
        !selectedActivity || !current.slug
          ? createHpdkiActivitySlug(value)
          : current.slug,
      image_label:
        !selectedActivity || !current.image_label
          ? value
          : current.image_label,
    }));
  };

  const handlePhotoUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);

    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    if (photoIds.length + files.length > 10) {
      setErrorMessage(
        "Maksimal 10 foto untuk setiap kegiatan.",
      );
      return;
    }

    setUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const uploadedIds: string[] = [];

    try {
      for (const file of files) {
        const uploaded = await uploadHpdkiActivityPhoto(
          file,
          form.status,
        );

        uploadedIds.push(uploaded.$id);
      }

      setPhotoIds((current) => {
        const next = [...current, ...uploadedIds];

        if (!coverFileId && next[0]) {
          setCoverFileId(next[0]);
        }

        return next;
      });

      setSuccessMessage(
        `${uploadedIds.length} foto berhasil diunggah.`,
      );
    } catch (error) {
      console.error("Gagal mengunggah foto:", error);

      await Promise.all(
        uploadedIds.map(async (fileId) => {
          try {
            await deleteHpdkiActivityPhoto(fileId);
          } catch {
            // Cleanup terbaik jika salah satu upload gagal.
          }
        }),
      );

      setErrorMessage(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async (fileId: string) => {
    const confirmed = window.confirm(
      "Hapus foto ini dari penyimpanan?",
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteHpdkiActivityPhoto(fileId);

      setPhotoIds((current) =>
        current.filter((item) => item !== fileId),
      );

      if (coverFileId === fileId) {
        const remaining = photoIds.filter(
          (item) => item !== fileId,
        );
        setCoverFileId(remaining[0] ?? "");
      }

      setSuccessMessage("Foto berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus foto:", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  const saveActivity = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (form.status === "published" && photoIds.length === 0) {
      setErrorMessage(
        "Tambahkan minimal satu foto sebelum kegiatan dipublikasikan.",
      );
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        event_date: new Date(
          `${form.event_date}T00:00:00+07:00`,
        ).toISOString(),
        location: form.location,
        category: form.category,
        excerpt: form.excerpt,
        content: form.content,
        image_label: form.image_label,
        cover_file_id: coverFileId,
        photo_file_ids: photoIds,
        status: form.status,
        created_by: "Admin",
      };

      if (selectedActivity) {
        const updated = await updateHpdkiActivity(
          selectedActivity.$id,
          selectedActivity,
          payload,
        );

        setActivities((current) =>
          current.map((item) =>
            item.$id === updated.$id ? updated : item,
          ),
        );

        setSelectedActivity(updated);
        setSuccessMessage(
          "Kegiatan berhasil diperbarui.",
        );
      } else {
        const created = await createHpdkiActivity(payload);

        setActivities((current) => [
          created,
          ...current,
        ]);

        setSelectedActivity(created);
        setSuccessMessage(
          "Kegiatan berhasil dibuat.",
        );
      }
    } catch (error) {
      console.error("Gagal menyimpan kegiatan:", error);

      const message = getErrorMessage(error);

      setErrorMessage(
        message.toLowerCase().includes("unique")
          ? "Slug sudah digunakan. Ubah slug kegiatan lalu simpan kembali."
          : message,
      );
    } finally {
      setSaving(false);
    }
  };

  const removeActivity = async (
    activity: HpdkiActivityRecord,
  ) => {
    const confirmed = window.confirm(
      `Hapus kegiatan “${activity.title}” beserta semua fotonya?`,
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteHpdkiActivity(activity);

      setActivities((current) =>
        current.filter(
          (item) => item.$id !== activity.$id,
        ),
      );

      closeEditor();
    } catch (error) {
      console.error("Gagal menghapus kegiatan:", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-activities-panel">
      <div className="admin-panel-heading">
        <div>
          <h2>Dokumentasi Kegiatan HPDKI</h2>
          <p>
            Tambahkan kegiatan, dokumentasi foto, lokasi,
            dan status publikasi.
          </p>
        </div>

        <div className="admin-panel-heading-actions">
          <button
            type="button"
            onClick={() => void loadActivities()}
            disabled={loading}
          >
            {loading ? "Memuat..." : "Muat Ulang"}
          </button>

          <button
            type="button"
            className="admin-activity-primary-button"
            onClick={openCreateEditor}
          >
            Tambah Kegiatan
          </button>
        </div>
      </div>

      <div className="admin-toolbar admin-activity-toolbar">
        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Cari judul, lokasi, atau kategori"
          aria-label="Cari kegiatan HPDKI"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as
                | "all"
                | HpdkiActivityStatus,
            )
          }
          aria-label="Filter status kegiatan"
        >
          <option value="all">Semua Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {errorMessage && !editorOpen && (
        <div className="admin-activity-message is-error">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="admin-empty-state">
          <strong>Memuat kegiatan...</strong>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="admin-empty-state">
          <strong>Belum ada kegiatan</strong>
          <p>
            Klik Tambah Kegiatan untuk membuat dokumentasi
            HPDKI pertama.
          </p>
        </div>
      ) : (
        <div className="admin-activity-list">
          {filteredActivities.map((activity) => {
            const coverUrl =
              getHpdkiActivityPhotoUrl(
                activity.cover_file_id,
              );

            return (
              <article
                key={activity.$id}
                className="admin-activity-card"
              >
                <div className="admin-activity-card-image">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={activity.title}
                      fill
                      unoptimized
                      sizes="180px"
                    />
                  ) : (
                    <span>Belum ada foto</span>
                  )}
                </div>

                <div className="admin-activity-card-body">
                  <div className="admin-activity-card-status">
                    <span>{activity.category}</span>
                    <strong
                      className={
                        activity.status === "published"
                          ? "is-published"
                          : "is-draft"
                      }
                    >
                      {activity.status === "published"
                        ? "Published"
                        : "Draft"}
                    </strong>
                  </div>

                  <h3>{activity.title}</h3>

                  <p>
                    {formatDate(activity.event_date)}
                    {" · "}
                    {activity.location}
                  </p>

                  <small>
                    {activity.photo_file_ids?.length ?? 0} foto
                  </small>
                </div>

                <div className="admin-activity-card-actions">
                  <button
                    type="button"
                    onClick={() =>
                      openEditEditor(activity)
                    }
                  >
                    Kelola
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {editorOpen && (
        <div
          className="admin-activity-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEditor();
            }
          }}
        >
          <section
            className="admin-activity-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="activity-editor-title"
          >
            <header className="admin-activity-modal-header">
              <div>
                <span>
                  {selectedActivity
                    ? "Edit dokumentasi"
                    : "Dokumentasi baru"}
                </span>

                <h2 id="activity-editor-title">
                  {selectedActivity
                    ? selectedActivity.title
                    : "Tambah Kegiatan HPDKI"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeEditor}
                disabled={saving || uploading || deleting}
                aria-label="Tutup editor kegiatan"
              >
                ×
              </button>
            </header>

            <form
              className="admin-activity-form"
              onSubmit={saveActivity}
            >
              <div className="admin-activity-form-grid">
                <label className="is-wide">
                  <span>Judul kegiatan</span>
                  <input
                    value={form.title}
                    onChange={(event) =>
                      handleTitleChange(event.target.value)
                    }
                    maxLength={200}
                    required
                  />
                </label>

                <label className="is-wide">
                  <span>Slug URL</span>
                  <input
                    value={form.slug}
                    onChange={(event) =>
                      setField(
                        "slug",
                        createHpdkiActivitySlug(
                          event.target.value,
                        ),
                      )
                    }
                    maxLength={220}
                    required
                  />
                </label>

                <label>
                  <span>Tanggal kegiatan</span>
                  <input
                    type="date"
                    value={form.event_date}
                    onChange={(event) =>
                      setField(
                        "event_date",
                        event.target.value,
                      )
                    }
                    required
                  />
                </label>

                <label>
                  <span>Kategori</span>
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setField(
                        "category",
                        event.target
                          .value as HpdkiActivityCategory,
                      )
                    }
                  >
                    {hpdkiActivityCategories.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label className="is-wide">
                  <span>Lokasi</span>
                  <input
                    value={form.location}
                    onChange={(event) =>
                      setField(
                        "location",
                        event.target.value,
                      )
                    }
                    maxLength={250}
                    required
                  />
                </label>

                <label className="is-wide">
                  <span>Ringkasan</span>
                  <textarea
                    value={form.excerpt}
                    onChange={(event) =>
                      setField(
                        "excerpt",
                        event.target.value,
                      )
                    }
                    rows={3}
                    maxLength={1000}
                    required
                  />
                  <small>
                    {form.excerpt.length}/1000 karakter
                  </small>
                </label>

                <label className="is-wide">
                  <span>Isi kegiatan</span>
                  <textarea
                    value={form.content}
                    onChange={(event) =>
                      setField(
                        "content",
                        event.target.value,
                      )
                    }
                    rows={10}
                    maxLength={15000}
                    placeholder="Pisahkan paragraf dengan satu baris kosong."
                    required
                  />
                </label>

                <label>
                  <span>Label foto</span>
                  <input
                    value={form.image_label}
                    onChange={(event) =>
                      setField(
                        "image_label",
                        event.target.value,
                      )
                    }
                    maxLength={150}
                  />
                </label>

                <label>
                  <span>Status</span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setField(
                        "status",
                        event.target
                          .value as HpdkiActivityStatus,
                      )
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="published">
                      Published
                    </option>
                  </select>
                </label>
              </div>

              <section className="admin-activity-photo-section">
                <div>
                  <h3>Foto kegiatan</h3>
                  <p>
                    Maksimal 10 foto. Format JPG, PNG, atau
                    WEBP. Maksimal 5 MB per foto.
                  </p>
                </div>

                <label className="admin-activity-upload-button">
                  <span>
                    {uploading
                      ? "Mengunggah..."
                      : "Pilih Foto"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handlePhotoUpload}
                    disabled={
                      uploading ||
                      saving ||
                      photoIds.length >= 10
                    }
                  />
                </label>

                {photoIds.length > 0 && (
                  <div className="admin-activity-photo-grid">
                    {photoIds.map((fileId) => (
                      <article
                        key={fileId}
                        className={
                          coverFileId === fileId
                            ? "is-cover"
                            : ""
                        }
                      >
                        <div>
                          <Image
                            src={getHpdkiActivityPhotoUrl(
                              fileId,
                            )}
                            alt="Dokumentasi kegiatan HPDKI"
                            fill
                            unoptimized
                            sizes="180px"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setCoverFileId(fileId)
                          }
                          disabled={
                            coverFileId === fileId
                          }
                        >
                          {coverFileId === fileId
                            ? "Foto Sampul"
                            : "Jadikan Sampul"}
                        </button>

                        <button
                          type="button"
                          className="is-danger"
                          onClick={() =>
                            void removePhoto(fileId)
                          }
                          disabled={deleting}
                        >
                          Hapus
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              {errorMessage && (
                <div className="admin-activity-message is-error">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="admin-activity-message is-success">
                  {successMessage}
                </div>
              )}

              <footer className="admin-activity-form-actions">
                {selectedActivity && (
                  <button
                    type="button"
                    className="is-danger"
                    onClick={() =>
                      void removeActivity(selectedActivity)
                    }
                    disabled={saving || uploading || deleting}
                  >
                    {deleting
                      ? "Menghapus..."
                      : "Hapus Kegiatan"}
                  </button>
                )}

                <span />

                <button
                  type="button"
                  onClick={closeEditor}
                  disabled={saving || uploading || deleting}
                >
                  Tutup
                </button>

                <button
                  type="submit"
                  className="admin-activity-primary-button"
                  disabled={saving || uploading || deleting}
                >
                  {saving
                    ? "Menyimpan..."
                    : selectedActivity
                      ? "Simpan Perubahan"
                      : "Buat Kegiatan"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
