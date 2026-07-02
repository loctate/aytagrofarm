"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type RegistrationStatus =
  | "Pendaftaran Baru"
  | "Sedang Diperiksa"
  | "Data Belum Lengkap"
  | "Menunggu Konfirmasi WhatsApp"
  | "Lolos Validasi"
  | "Disetujui"
  | "Ditolak";

type Registration = {
  id: string;
  name: string;
  whatsapp: string;
  domicile: string;
  farmName: string;
  livestockType: string;
  registeredAt: string;
  status: RegistrationStatus;
};

const initialRegistrations: Registration[] = [
  {
    id: "AYT-HPDKI-2026-0001",
    name: "Ahmad Hidayat",
    whatsapp: "0812-3456-7890",
    domicile: "Dramaga, Kabupaten Bogor",
    farmName: "Hidayat Farm",
    livestockType: "Domba",
    registeredAt: "1 Juli 2026",
    status: "Pendaftaran Baru",
  },
  {
    id: "AYT-HPDKI-2026-0002",
    name: "Dedi Suhendar",
    whatsapp: "0813-7654-3210",
    domicile: "Cibinong, Kabupaten Bogor",
    farmName: "Ternak Mandiri",
    livestockType: "Kambing dan domba",
    registeredAt: "30 Juni 2026",
    status: "Sedang Diperiksa",
  },
  {
    id: "AYT-HPDKI-2026-0003",
    name: "Siti Nurhayati",
    whatsapp: "0857-1122-3344",
    domicile: "Ciseeng, Kabupaten Bogor",
    farmName: "Berkah Ternak",
    livestockType: "Kambing",
    registeredAt: "29 Juni 2026",
    status: "Data Belum Lengkap",
  },
];

const statuses: RegistrationStatus[] = [
  "Pendaftaran Baru",
  "Sedang Diperiksa",
  "Data Belum Lengkap",
  "Menunggu Konfirmasi WhatsApp",
  "Lolos Validasi",
  "Disetujui",
  "Ditolak",
];

const whatsappLink = (phone: string, name: string, id: string) => {
  const normalized = phone.replace(/\D/g, "").replace(/^0/, "62");
  const message = encodeURIComponent(
    `Halo Bapak/Ibu ${name}, kami dari AYT Agro Farm sedang memeriksa pendaftaran anggota HPDKI dengan nomor ${id}.`
  );

  return `https://wa.me/${normalized}?text=${message}`;
};

export default function AdminPage() {
  const [registrations, setRegistrations] =
    useState<Registration[]>(initialRegistrations);
  const [activeMenu, setActiveMenu] = useState("pendaftaran");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);

  const filteredRegistrations = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return registrations.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.id.toLowerCase().includes(keyword) ||
        item.domicile.toLowerCase().includes(keyword) ||
        item.whatsapp.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "Semua Status" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [registrations, search, statusFilter]);

  const updateStatus = (
    id: string,
    newStatus: RegistrationStatus
  ) => {
    setRegistrations((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );

    setSelectedRegistration((current) =>
      current?.id === id ? { ...current, status: newStatus } : current
    );
  };

  const totalApproved = registrations.filter(
    (item) => item.status === "Disetujui"
  ).length;

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/">
          <Image
            src="/images/ayt-logo-mark.png"
            alt="Logo AYT Agro Farm"
            width={48}
            height={48}
            priority
          />
          <span>
            <strong>AYT Agro Farm</strong>
            <small>Dashboard Admin</small>
          </span>
        </Link>

        <nav className="admin-menu" aria-label="Menu dashboard admin">
          <button
            type="button"
            className={activeMenu === "ringkasan" ? "is-active" : ""}
            onClick={() => setActiveMenu("ringkasan")}
          >
            Ringkasan
          </button>

          <button
            type="button"
            className={activeMenu === "pengetahuan" ? "is-active" : ""}
            onClick={() => setActiveMenu("pengetahuan")}
          >
            Pengetahuan
          </button>

          <button
            type="button"
            className={activeMenu === "pendaftaran" ? "is-active" : ""}
            onClick={() => setActiveMenu("pendaftaran")}
          >
            Pendaftaran HPDKI
          </button>

          <button
            type="button"
            className={activeMenu === "anggota" ? "is-active" : ""}
            onClick={() => setActiveMenu("anggota")}
          >
            Data Anggota
          </button>
        </nav>

        <div className="admin-sidebar-note">
          <strong>Mode Prototipe</strong>
          <p>
            Data pada dashboard ini masih berupa contoh dan belum tersimpan
            ke database.
          </p>
        </div>
      </aside>

      <section className="admin-content">
        <header className="admin-topbar">
          <div>
            <span>Dashboard Admin</span>
            <h1>
              {activeMenu === "ringkasan" && "Ringkasan"}
              {activeMenu === "pengetahuan" && "Pengetahuan"}
              {activeMenu === "pendaftaran" && "Pendaftaran HPDKI"}
              {activeMenu === "anggota" && "Data Anggota"}
            </h1>
          </div>

          <Link href="/" className="admin-view-site">
            Lihat Website
          </Link>
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
                <strong>
                  {
                    registrations.filter(
                      (item) => item.status === "Pendaftaran Baru"
                    ).length
                  }
                </strong>
              </article>
              <article>
                <span>Sedang Diperiksa</span>
                <strong>
                  {
                    registrations.filter(
                      (item) => item.status === "Sedang Diperiksa"
                    ).length
                  }
                </strong>
              </article>
              <article>
                <span>Anggota Disetujui</span>
                <strong>{totalApproved}</strong>
              </article>
            </div>

            <div className="admin-placeholder-panel">
              <h2>Aktivitas Terbaru</h2>
              <p>
                Aktivitas pendaftaran, perubahan status, dan pembaruan data
                anggota nantinya tampil di bagian ini.
              </p>
            </div>
          </>
        )}

        {activeMenu === "pengetahuan" && (
          <div className="admin-placeholder-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Artikel dan Tips Peternakan</h2>
                <p>
                  Kelola artikel ringan untuk bagian Pengetahuan di homepage.
                </p>
              </div>

              <button type="button" disabled>
                Tambah Artikel
              </button>
            </div>

            <div className="admin-empty-state">
              <strong>Editor artikel belum diaktifkan</strong>
              <p>
                Form tambah, edit, draft, publikasi, dan hapus artikel dibuat
                setelah dashboard terhubung ke database.
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
                  Periksa data pendaftaran dan ubah status proses validasi.
                </p>
              </div>

              <span>{filteredRegistrations.length} data</span>
            </div>

            <div className="admin-toolbar">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama, nomor, WhatsApp, atau wilayah"
                aria-label="Cari calon anggota"
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter status pendaftaran"
              >
                <option>Semua Status</option>
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>

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
                  {filteredRegistrations.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                        <small>{item.id}</small>
                        <small>{item.whatsapp}</small>
                      </td>
                      <td>{item.domicile}</td>
                      <td>{item.livestockType}</td>
                      <td>{item.registeredAt}</td>
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
                          onClick={() => setSelectedRegistration(item)}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredRegistrations.length === 0 && (
                    <tr>
                      <td colSpan={6} className="admin-no-result">
                        Data tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeMenu === "anggota" && (
          <div className="admin-placeholder-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Database Anggota</h2>
                <p>
                  Data anggota yang telah disetujui dan kolom kunjungan akan
                  dikelola dari bagian ini.
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

            <div className="admin-empty-state">
              <strong>Belum ada data anggota aktif</strong>
              <p>
                Data pendaftar akan masuk ke daftar anggota setelah statusnya
                diubah menjadi Disetujui.
              </p>
            </div>
          </div>
        )}
      </section>

      {selectedRegistration && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onClick={() => setSelectedRegistration(null)}
        >
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-modal-heading">
              <div>
                <span>{selectedRegistration.id}</span>
                <h2 id="registration-detail-title">
                  {selectedRegistration.name}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Tutup detail pendaftaran"
                onClick={() => setSelectedRegistration(null)}
              >
                ×
              </button>
            </div>

            <dl className="admin-detail-list">
              <div>
                <dt>Nomor WhatsApp</dt>
                <dd>{selectedRegistration.whatsapp}</dd>
              </div>
              <div>
                <dt>Domisili</dt>
                <dd>{selectedRegistration.domicile}</dd>
              </div>
              <div>
                <dt>Nama Peternakan</dt>
                <dd>{selectedRegistration.farmName}</dd>
              </div>
              <div>
                <dt>Jenis Ternak</dt>
                <dd>{selectedRegistration.livestockType}</dd>
              </div>
              <div>
                <dt>Tanggal Daftar</dt>
                <dd>{selectedRegistration.registeredAt}</dd>
              </div>
            </dl>

            <label className="admin-status-field">
              <span>Status pendaftaran</span>
              <select
                value={selectedRegistration.status}
                onChange={(event) =>
                  updateStatus(
                    selectedRegistration.id,
                    event.target.value as RegistrationStatus
                  )
                }
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>

            <label className="admin-notes-field">
              <span>Catatan admin</span>
              <textarea
                rows={4}
                placeholder="Contoh: Foto identitas perlu dikirim ulang."
              />
            </label>

            <div className="admin-modal-actions">
              <a
                href={whatsappLink(
                  selectedRegistration.whatsapp,
                  selectedRegistration.name,
                  selectedRegistration.id
                )}
                target="_blank"
                rel="noreferrer"
              >
                Hubungi via WhatsApp
              </a>

              <button
                type="button"
                onClick={() => setSelectedRegistration(null)}
              >
                Simpan &amp; Tutup
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
