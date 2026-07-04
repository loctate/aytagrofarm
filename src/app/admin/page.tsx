"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentAdmin,
  logoutAdmin,
} from "@/lib/appwrite/auth";

import {
  type HpdkiRegistrationRecord,
  type RegistrationStatus,
  listHpdkiRegistrations,
  registrationStatuses,
  updateHpdkiRegistration,
} from "@/lib/appwrite/registrations";

type AdminMenu =
  | "ringkasan"
  | "pengetahuan"
  | "pendaftaran"
  | "anggota";

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

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

function getLivestockLabel(
  registration: HpdkiRegistrationRecord
) {
  const goats =
    registration.female_goats + registration.male_goats;

  const sheep =
    registration.female_sheep + registration.male_sheep;

  if (goats > 0 && sheep > 0) {
    return "Kambing & Domba";
  }

  if (goats > 0) {
    return "Kambing";
  }

  if (sheep > 0) {
    return "Domba";
  }

  return "Belum ada";
}

function getLocation(
  registration: HpdkiRegistrationRecord
) {
  return [registration.district, registration.regency]
    .filter(Boolean)
    .join(", ");
}

function whatsappLink(
  registration: HpdkiRegistrationRecord
) {
  const normalized = registration.whatsapp
    .replace(/\D/g, "")
    .replace(/^0/, "62");

  const message = encodeURIComponent(
    `Halo Bapak/Ibu ${registration.farmer_name}, ` +
      `kami dari AYT Agro Farm sedang memeriksa ` +
      `pendaftaran anggota peternak PAC HPDKI Kecamatan Dramaga dengan nomor ` +
      `${registration.registration_number}.`
  );

  return `https://wa.me/${normalized}?text=${message}`;
}

export default function AdminPage() {
  const router = useRouter();

  const [checkingSession, setCheckingSession] =
    useState(true);

  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState("");

  const [registrations, setRegistrations] = useState<
    HpdkiRegistrationRecord[]
  >([]);

  const [activeMenu, setActiveMenu] =
    useState<AdminMenu>("pendaftaran");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("Semua Status");

  const [
    selectedRegistration,
    setSelectedRegistration,
  ] = useState<HpdkiRegistrationRecord | null>(null);

  const [selectedStatus, setSelectedStatus] =
    useState<RegistrationStatus>("Pendaftaran Baru");

  const [selectedAdminNotes, setSelectedAdminNotes] =
    useState("");

  const [savingRegistration, setSavingRegistration] =
    useState(false);

  const [modalError, setModalError] = useState("");

  const loadRegistrations = useCallback(async () => {
    setLoadingData(true);
    setDataError("");

    try {
      const rows = await listHpdkiRegistrations();
      setRegistrations(rows);
    } catch (error) {
      console.error(
        "Gagal mengambil data pendaftaran:",
        error
      );

      setDataError(
        "Data pendaftaran belum dapat dimuat. " +
          "Periksa koneksi dan permission Appwrite."
      );
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const initializeDashboard = async () => {
      try {
        await getCurrentAdmin();

        if (!active) {
          return;
        }

        setCheckingSession(false);
        await loadRegistrations();
      } catch {
        if (active) {
          router.replace("/admin/login");
        }
      }
    };

    void initializeDashboard();

    return () => {
      active = false;
    };
  }, [loadRegistrations, router]);

  const filteredRegistrations = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return registrations.filter((item) => {
      const searchableText = [
        item.farmer_name,
        item.registration_number,
        item.whatsapp,
        item.farm_group_name,
        item.village,
        item.district,
        item.regency,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !keyword || searchableText.includes(keyword);

      const matchesStatus =
        statusFilter === "Semua Status" ||
        item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [registrations, search, statusFilter]);

  const approvedRegistrations = useMemo(
    () =>
      registrations.filter(
        (item) => item.status === "Disetujui"
      ),
    [registrations]
  );

  const openRegistrationDetail = (
    registration: HpdkiRegistrationRecord
  ) => {
    setSelectedRegistration(registration);
    setSelectedStatus(registration.status);
    setSelectedAdminNotes(
      registration.admin_notes ?? ""
    );
    setModalError("");
  };

  const closeRegistrationDetail = () => {
    if (savingRegistration) {
      return;
    }

    setSelectedRegistration(null);
    setModalError("");
  };

  const saveRegistrationChanges = async () => {
    if (!selectedRegistration) {
      return;
    }

    setSavingRegistration(true);
    setModalError("");

    try {
      const updateData: {
        status: RegistrationStatus;
        admin_notes: string;
        approved_at?: string;
      } = {
        status: selectedStatus,
        admin_notes: selectedAdminNotes.trim(),
      };

      if (
        selectedStatus === "Disetujui" &&
        !selectedRegistration.approved_at
      ) {
        updateData.approved_at =
          new Date().toISOString();
      }

      const updated = await updateHpdkiRegistration(
        selectedRegistration.$id,
        updateData
      );

      setRegistrations((current) =>
        current.map((item) =>
          item.$id === updated.$id ? updated : item
        )
      );

      setSelectedRegistration(null);
    } catch (error) {
      console.error(
        "Gagal memperbarui pendaftaran:",
        error
      );

      setModalError(
        "Perubahan belum berhasil disimpan. " +
          "Silakan coba kembali."
      );
    } finally {
      setSavingRegistration(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } finally {
      router.replace("/admin/login");
    }
  };

  const newRegistrations = registrations.filter(
    (item) => item.status === "Pendaftaran Baru"
  ).length;

  const registrationsInReview = registrations.filter(
    (item) => item.status === "Sedang Diperiksa"
  ).length;

  if (checkingSession) {
    return (
      <main className="admin-auth-loading">
        <span className="admin-auth-spinner" />
        <p>Memeriksa akses dashboard...</p>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/">
          <Image
            src="/images/ayt-logo-2026.png"
            alt="Logo CV. AYT Agro Farm"
            width={48}
            height={48}
            priority
          />
          <span className="admin-hpdki-brand-logo" aria-label="Logo HPDKI PAC Dramaga">
            <Image
              src="/images/hpdki-pac-logo.png"
              alt="Logo Himpunan Peternak Domba Kambing Indonesia PAC Dramaga"
              width={96}
              height={96}
              sizes="(max-width: 640px) 44px, 56px"
              className="admin-hpdki-brand-logo-image"
            />
          </span>

          <span>
            <strong>AYT Agro Farm</strong>
            <small>Dashboard Admin</small>
          </span>
        </Link>

        <nav
          className="admin-menu"
          aria-label="Menu dashboard admin"
        >
          <button
            type="button"
            className={
              activeMenu === "ringkasan"
                ? "is-active"
                : ""
            }
            onClick={() => setActiveMenu("ringkasan")}
          >
            Ringkasan
          </button>

          <button
            type="button"
            className={
              activeMenu === "pengetahuan"
                ? "is-active"
                : ""
            }
            onClick={() =>
              setActiveMenu("pengetahuan")
            }
          >
            Pengetahuan
          </button>

          <button
            type="button"
            className={
              activeMenu === "pendaftaran"
                ? "is-active"
                : ""
            }
            onClick={() =>
              setActiveMenu("pendaftaran")
            }
          >
            Pendaftaran PAC HPDKI
          </button>

          <button
            type="button"
            className={
              activeMenu === "anggota"
                ? "is-active"
                : ""
            }
            onClick={() => setActiveMenu("anggota")}
          >
            Data Anggota
          </button>
        </nav>

        <div className="admin-sidebar-note">
          <strong className="admin-live-indicator">
            <span />
            Terhubung ke Appwrite
          </strong>

          <p>
            Pendaftaran yang dikirim melalui website
            tampil langsung pada dashboard ini.
          </p>
        </div>
      </aside>

      <section className="admin-content">
        <header className="admin-topbar">
          <div>
            <span>Dashboard Admin</span>

            <h1>
              {activeMenu === "ringkasan" &&
                "Ringkasan"}

              {activeMenu === "pengetahuan" &&
                "Pengetahuan"}

              {activeMenu === "pendaftaran" &&
                "Pendaftaran PAC HPDKI"}

              {activeMenu === "anggota" &&
                "Data Anggota"}
            </h1>
          </div>

          <div className="admin-topbar-actions">
            <Link href="/" className="admin-view-site">
              Lihat Website
            </Link>

            <button
              className="admin-logout-button"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        {activeMenu === "ringkasan" && (
          <>
            <div className="admin-stat-grid">
              <article>
                <span>Total Pendaftar</span>
                <strong>{registrations.length}</strong>
              </article>

              <article>
                <span>Pendaftaran Baru</span>
                <strong>{newRegistrations}</strong>
              </article>

              <article>
                <span>Sedang Diperiksa</span>
                <strong>{registrationsInReview}</strong>
              </article>

              <article>
                <span>Anggota Disetujui</span>
                <strong>
                  {approvedRegistrations.length}
                </strong>
              </article>
            </div>

            <div className="admin-placeholder-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>Aktivitas Pendaftaran</h2>
                  <p>
                    Statistik diambil langsung dari data
                    Appwrite Cloud.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    void loadRegistrations()
                  }
                  disabled={loadingData}
                >
                  {loadingData
                    ? "Memuat..."
                    : "Muat Ulang"}
                </button>
              </div>
            </div>
          </>
        )}

        {activeMenu === "pengetahuan" && (
          <div className="admin-placeholder-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Artikel dan Tips Peternakan</h2>
                <p>
                  Modul artikel akan dihubungkan ke
                  tabel Pengetahuan pada tahap berikutnya.
                </p>
              </div>

              <button type="button" disabled>
                Tambah Artikel
              </button>
            </div>

            <div className="admin-empty-state">
              <strong>
                Editor artikel belum diaktifkan
              </strong>

              <p>
                Pendaftaran PAC HPDKI diselesaikan lebih
                dahulu sebelum modul Pengetahuan dibuat.
              </p>
            </div>
          </div>
        )}

        {activeMenu === "pendaftaran" && (
          <div className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Calon Anggota</h2>
                <p>
                  Periksa data nyata yang masuk dari
                  formulir pendaftaran.
                </p>
              </div>

              <div className="admin-panel-heading-actions">
                <span>
                  {filteredRegistrations.length} data
                </span>

                <button
                  type="button"
                  onClick={() =>
                    void loadRegistrations()
                  }
                  disabled={loadingData}
                >
                  {loadingData
                    ? "Memuat..."
                    : "Muat Ulang"}
                </button>
              </div>
            </div>

            <div className="admin-toolbar">
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Cari nama, nomor, WhatsApp, kandang, atau wilayah"
                aria-label="Cari calon anggota"
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                aria-label="Filter status pendaftaran"
              >
                <option>Semua Status</option>

                {registrationStatuses.map((status) => (
                  <option key={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {dataError && (
              <div className="admin-data-error">
                <p>{dataError}</p>

                <button
                  type="button"
                  onClick={() =>
                    void loadRegistrations()
                  }
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {!dataError && loadingData && (
              <div className="admin-empty-state">
                <strong>
                  Memuat data pendaftaran...
                </strong>

                <p>
                  Dashboard sedang mengambil row dari
                  Appwrite Cloud.
                </p>
              </div>
            )}

            {!dataError && !loadingData && (
              <div className="admin-table-shell">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Calon Anggota</th>
                      <th>Wilayah</th>
                      <th>Ternak</th>
                      <th>Tanggal Daftar</th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRegistrations.map(
                      (item) => (
                        <tr key={item.$id}>
                          <td>
                            <strong>
                              {item.farmer_name}
                            </strong>

                            <small>
                              {item.registration_number}
                            </small>

                            <small>{item.whatsapp}</small>
                          </td>

                          <td>
                            {getLocation(item)}
                            <small>
                              {item.village}
                            </small>
                          </td>

                          <td>
                            {getLivestockLabel(item)}
                            <small>
                              {item.total_population} ekor
                            </small>
                          </td>

                          <td>
                            {formatDate(
                              item.registered_at
                            )}
                          </td>

                          <td>
                            <span
                              className="admin-status"
                              data-status={item.status}
                            >
                              {item.status}
                            </span>
                          </td>

                          <td>
                            <button
                              type="button"
                              className="admin-detail-button"
                              onClick={() =>
                                openRegistrationDetail(
                                  item
                                )
                              }
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      )
                    )}

                    {filteredRegistrations.length ===
                      0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="admin-no-result"
                        >
                          Belum ada data yang sesuai.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeMenu === "anggota" && (
          <div className="admin-placeholder-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Database Anggota</h2>

                <p>
                  Untuk sementara menampilkan pendaftaran
                  dengan status Disetujui.
                </p>
              </div>

              <div className="admin-export-actions">
                <button type="button" disabled>
                  Download Excel
                </button>

                <button type="button" disabled>
                  Download PDF
                </button>
              </div>
            </div>

            {approvedRegistrations.length === 0 ? (
              <div className="admin-empty-state">
                <strong>
                  Belum ada anggota disetujui
                </strong>

                <p>
                  Ubah status calon anggota menjadi
                  Disetujui setelah pemeriksaan selesai.
                </p>
              </div>
            ) : (
              <div className="admin-table-shell admin-member-table">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nama Peternak</th>
                      <th>Kandang/Kelompok</th>
                      <th>Wilayah</th>
                      <th>Populasi</th>
                      <th>Disetujui</th>
                    </tr>
                  </thead>

                  <tbody>
                    {approvedRegistrations.map(
                      (item) => (
                        <tr key={item.$id}>
                          <td>
                            <strong>
                              {item.farmer_name}
                            </strong>
                            <small>
                              {item.whatsapp}
                            </small>
                          </td>

                          <td>
                            {item.farm_group_name}
                          </td>

                          <td>{getLocation(item)}</td>

                          <td>
                            {item.total_population} ekor
                          </td>

                          <td>
                            {formatDate(
                              item.approved_at
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </section>

      {selectedRegistration && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onClick={closeRegistrationDetail}
        >
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-detail-title"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="admin-modal-heading">
              <div>
                <span>
                  {
                    selectedRegistration.registration_number
                  }
                </span>

                <h2 id="registration-detail-title">
                  {selectedRegistration.farmer_name}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Tutup detail pendaftaran"
                onClick={closeRegistrationDetail}
              >
                ×
              </button>
            </div>

            <dl className="admin-detail-list">
              <div>
                <dt>Nomor WhatsApp</dt>
                <dd>
                  {selectedRegistration.whatsapp}
                </dd>
              </div>

              <div>
                <dt>Kelompok/Kandang</dt>
                <dd>
                  {selectedRegistration.farm_group_name}
                </dd>
              </div>

              <div className="admin-detail-wide">
                <dt>Alamat Kandang</dt>
                <dd>
                  {selectedRegistration.farm_address}
                </dd>
              </div>

              <div>
                <dt>Desa/Kelurahan</dt>
                <dd>
                  {selectedRegistration.village}
                </dd>
              </div>

              <div>
                <dt>Kecamatan</dt>
                <dd>
                  {selectedRegistration.district}
                </dd>
              </div>

              <div>
                <dt>Kabupaten/Kota</dt>
                <dd>
                  {selectedRegistration.regency}
                </dd>
              </div>

              <div>
                <dt>Kambing Betina</dt>
                <dd>
                  {selectedRegistration.female_goats}
                </dd>
              </div>

              <div>
                <dt>Kambing Jantan</dt>
                <dd>
                  {selectedRegistration.male_goats}
                </dd>
              </div>

              <div>
                <dt>Domba Betina</dt>
                <dd>
                  {selectedRegistration.female_sheep}
                </dd>
              </div>

              <div>
                <dt>Domba Jantan</dt>
                <dd>
                  {selectedRegistration.male_sheep}
                </dd>
              </div>

              <div>
                <dt>Total Populasi</dt>
                <dd>
                  {selectedRegistration.total_population} ekor
                </dd>
              </div>

              <div>
                <dt>Jenis Pakan</dt>
                <dd>
                  {selectedRegistration.feed_type}
                </dd>
              </div>

              <div>
                <dt>Luas Kandang</dt>
                <dd>
                  {selectedRegistration.farm_area_m2} m²
                </dd>
              </div>

              <div>
                <dt>Tanggal Daftar</dt>
                <dd>
                  {formatDate(
                    selectedRegistration.registered_at
                  )}
                </dd>
              </div>

              <div className="admin-detail-wide">
                <dt>Catatan Pendaftar</dt>
                <dd>
                  {selectedRegistration.notes || "-"}
                </dd>
              </div>
            </dl>

            <label className="admin-status-field">
              <span>Status pendaftaran</span>

              <select
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(
                    event.target
                      .value as RegistrationStatus
                  )
                }
              >
                {registrationStatuses.map((status) => (
                  <option key={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-notes-field">
              <span>Catatan admin</span>

              <textarea
                rows={4}
                value={selectedAdminNotes}
                onChange={(event) =>
                  setSelectedAdminNotes(
                    event.target.value
                  )
                }
                placeholder="Contoh: Data sudah diperiksa atau perlu diperbaiki."
              />
            </label>

            {modalError && (
              <div className="admin-modal-error">
                {modalError}
              </div>
            )}

            <div className="admin-modal-actions">
              <a
                href={whatsappLink(
                  selectedRegistration
                )}
                target="_blank"
                rel="noreferrer"
              >
                Hubungi via WhatsApp
              </a>

              <button
                type="button"
                onClick={() =>
                  void saveRegistrationChanges()
                }
                disabled={savingRegistration}
              >
                {savingRegistration
                  ? "Menyimpan..."
                  : "Simpan Perubahan"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
