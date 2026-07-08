"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  defaultHpdkiKtaSettings,
  getHpdkiKtaSettings,
  saveHpdkiKtaSettings,
  type HpdkiKtaSettingsFormData,
} from "@/lib/appwrite/kta-settings";

const defaultTermsText = defaultHpdkiKtaSettings.card_terms || "";

function settingsToForm(): HpdkiKtaSettingsFormData {
  return {
    chairman_name: defaultHpdkiKtaSettings.chairman_name,
    vice_chairman_name: defaultHpdkiKtaSettings.vice_chairman_name,
    chairman_title: defaultHpdkiKtaSettings.chairman_title,
    vice_chairman_title: defaultHpdkiKtaSettings.vice_chairman_title,
    validity_years: defaultHpdkiKtaSettings.validity_years,
    secretariat_address:
      defaultHpdkiKtaSettings.secretariat_address || "",
    secretariat_contact:
      defaultHpdkiKtaSettings.secretariat_contact || "",
    card_terms: defaultTermsText,
    updated_by: "",
  };
}

export default function AdminKtaSettingsPanel() {
  const [form, setForm] =
    useState<HpdkiKtaSettingsFormData>(settingsToForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const termsPreview = useMemo(
    () =>
      form.card_terms
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    [form.card_terms],
  );

  const updateField = (
    field: keyof HpdkiKtaSettingsFormData,
    value: string | number,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const settings = await getHpdkiKtaSettings();

      setForm({
        chairman_name: settings.chairman_name,
        vice_chairman_name: settings.vice_chairman_name,
        chairman_title: settings.chairman_title,
        vice_chairman_title: settings.vice_chairman_title,
        validity_years: settings.validity_years,
        secretariat_address: settings.secretariat_address || "",
        secretariat_contact: settings.secretariat_contact || "",
        card_terms: settings.card_terms || defaultTermsText,
        updated_by: settings.updated_by || "",
      });
    } catch (error) {
      console.error("Gagal memuat pengaturan KTA:", error);
      setErrorMessage(
        "Pengaturan KTA belum dapat dimuat. Pastikan table hpdki_kta_settings dan permission Appwrite sudah benar.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const saveSettings = async () => {
    setSaving(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      if (
        !form.chairman_name.trim() ||
        !form.vice_chairman_name.trim() ||
        !form.chairman_title.trim() ||
        !form.vice_chairman_title.trim()
      ) {
        throw new Error(
          "Nama Ketua, Wakil Ketua, dan label jabatan wajib diisi.",
        );
      }

      if (!Number.isFinite(form.validity_years) || form.validity_years < 1) {
        throw new Error("Masa berlaku KTA minimal 1 tahun.");
      }

      const saved = await saveHpdkiKtaSettings({
        ...form,
        chairman_name: form.chairman_name.trim(),
        vice_chairman_name: form.vice_chairman_name.trim(),
        chairman_title: form.chairman_title.trim(),
        vice_chairman_title: form.vice_chairman_title.trim(),
        secretariat_address: form.secretariat_address.trim(),
        secretariat_contact: form.secretariat_contact.trim(),
        card_terms: form.card_terms.trim(),
        updated_by: form.updated_by.trim(),
      });

      setForm({
        chairman_name: saved.chairman_name,
        vice_chairman_name: saved.vice_chairman_name,
        chairman_title: saved.chairman_title,
        vice_chairman_title: saved.vice_chairman_title,
        validity_years: saved.validity_years,
        secretariat_address: saved.secretariat_address || "",
        secretariat_contact: saved.secretariat_contact || "",
        card_terms: saved.card_terms || defaultTermsText,
        updated_by: saved.updated_by || "",
      });

      setStatusMessage("Pengaturan KTA berhasil disimpan.");
    } catch (error) {
      console.error("Gagal menyimpan pengaturan KTA:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Pengaturan KTA belum berhasil disimpan.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-card admin-kta-settings-panel">
      <div className="admin-card-heading">
        <div>
          <h2>Pengaturan KTA</h2>
          <p>
            Atur tanda tangan, masa berlaku, sekretariat, dan ketentuan yang
            dipakai pada preview Kartu Tanda Anggota.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadSettings()}
          disabled={loading || saving}
        >
          {loading ? "Memuat..." : "Muat Ulang"}
        </button>
      </div>

      {errorMessage && (
        <div className="admin-modal-error admin-members-error">
          {errorMessage}
        </div>
      )}

      {statusMessage && (
        <div className="admin-kta-settings-success">
          {statusMessage}
        </div>
      )}

      <form
        className="admin-kta-settings-form"
        onSubmit={(event) => {
          event.preventDefault();
          void saveSettings();
        }}
      >
        <div className="admin-member-edit-section">
          <h4>Tanda Tangan KTA</h4>

          <div className="admin-member-edit-grid">
            <label>
              Nama Ketua
              <input
                type="text"
                value={form.chairman_name}
                onChange={(event) =>
                  updateField("chairman_name", event.target.value)
                }
                required
              />
            </label>

            <label>
              Nama Wakil Ketua
              <input
                type="text"
                value={form.vice_chairman_name}
                onChange={(event) =>
                  updateField("vice_chairman_name", event.target.value)
                }
                required
              />
            </label>

            <label>
              Label Jabatan Ketua
              <input
                type="text"
                value={form.chairman_title}
                onChange={(event) =>
                  updateField("chairman_title", event.target.value)
                }
                required
              />
            </label>

            <label>
              Label Jabatan Wakil Ketua
              <input
                type="text"
                value={form.vice_chairman_title}
                onChange={(event) =>
                  updateField("vice_chairman_title", event.target.value)
                }
                required
              />
            </label>
          </div>
        </div>

        <div className="admin-member-edit-section">
          <h4>Masa Berlaku dan Sekretariat</h4>

          <div className="admin-member-edit-grid">
            <label>
              Masa Berlaku Default KTA
              <input
                type="number"
                min="1"
                value={form.validity_years}
                onChange={(event) =>
                  updateField(
                    "validity_years",
                    Number(event.target.value),
                  )
                }
                required
              />
            </label>

            <label>
              Diupdate Oleh
              <input
                type="text"
                value={form.updated_by}
                onChange={(event) =>
                  updateField("updated_by", event.target.value)
                }
                placeholder="Nama admin/pengelola"
              />
            </label>

            <label className="admin-kta-settings-wide">
              Alamat Sekretariat
              <input
                type="text"
                value={form.secretariat_address}
                onChange={(event) =>
                  updateField("secretariat_address", event.target.value)
                }
              />
            </label>

            <label className="admin-kta-settings-wide">
              Kontak Sekretariat
              <input
                type="text"
                value={form.secretariat_contact}
                onChange={(event) =>
                  updateField("secretariat_contact", event.target.value)
                }
              />
            </label>
          </div>
        </div>

        <div className="admin-member-edit-section">
          <h4>Ketentuan KTA</h4>

          <label className="admin-kta-settings-textarea-label">
            Isi satu ketentuan per baris
            <textarea
              value={form.card_terms}
              onChange={(event) =>
                updateField("card_terms", event.target.value)
              }
              rows={8}
            />
          </label>

          <div className="admin-kta-settings-preview">
            <strong>Preview Ketentuan</strong>
            <ul>
              {termsPreview.map((term) => (
                <li key={term}>{term}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="admin-kta-settings-actions">
          <button type="submit" disabled={loading || saving}>
            {saving ? "Menyimpan..." : "Simpan Pengaturan KTA"}
          </button>
        </div>
      </form>
    </section>
  );
}
