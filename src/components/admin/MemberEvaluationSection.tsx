"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createHpdkiMemberEvaluation,
  listHpdkiMemberEvaluations,
  type HpdkiMemberEvaluationCreateData,
  type HpdkiMemberEvaluationRecord,
} from "@/lib/appwrite/member-evaluations";
import type { PublicHpdkiMemberRecord } from "@/lib/appwrite/members";

type MemberEvaluationForm = {
  evaluation_date: string;
  female_goats: string;
  male_goats: string;
  female_sheep: string;
  male_sheep: string;
  feed_type: string;
  farm_area_m2: string;
  cage_condition: string;
  livestock_condition: string;
  health_notes: string;
  feed_notes: string;
  business_notes: string;
  follow_up: string;
  admin_notes: string;
  created_by: string;
};

type MemberEvaluationSectionProps = {
  member: PublicHpdkiMemberRecord;
};

function getTodayDateInput() {
  return new Date().toISOString().slice(0, 10);
}

function getInitialEvaluationForm(
  member: PublicHpdkiMemberRecord,
): MemberEvaluationForm {
  return {
    evaluation_date: getTodayDateInput(),
    female_goats: String(member.female_goats ?? 0),
    male_goats: String(member.male_goats ?? 0),
    female_sheep: String(member.female_sheep ?? 0),
    male_sheep: String(member.male_sheep ?? 0),
    feed_type: member.feed_type || "",
    farm_area_m2: String(member.farm_area_m2 ?? 0),
    cage_condition: "",
    livestock_condition: "",
    health_notes: "",
    feed_notes: "",
    business_notes: "",
    follow_up: "",
    admin_notes: "",
    created_by: "",
  };
}

function parseNonNegativeNumber(value: string, label: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${label} harus diisi dengan angka 0 atau lebih.`);
  }

  return parsed;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value || "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function buildEvaluationPayload(
  member: PublicHpdkiMemberRecord,
  form: MemberEvaluationForm,
): HpdkiMemberEvaluationCreateData {
  const evaluationDate = form.evaluation_date.trim();
  const feedType = form.feed_type.trim();

  if (!evaluationDate || !feedType) {
    throw new Error("Tanggal evaluasi dan jenis pakan wajib diisi.");
  }

  return {
    member_id: member.$id,
    member_number: member.member_number,
    farmer_name: member.farmer_name,
    evaluation_date: evaluationDate,
    female_goats: parseNonNegativeNumber(form.female_goats, "Kambing betina"),
    male_goats: parseNonNegativeNumber(form.male_goats, "Kambing jantan"),
    female_sheep: parseNonNegativeNumber(form.female_sheep, "Domba betina"),
    male_sheep: parseNonNegativeNumber(form.male_sheep, "Domba jantan"),
    feed_type: feedType,
    farm_area_m2: parseNonNegativeNumber(form.farm_area_m2, "Luas kandang"),
    cage_condition: form.cage_condition.trim(),
    livestock_condition: form.livestock_condition.trim(),
    health_notes: form.health_notes.trim(),
    feed_notes: form.feed_notes.trim(),
    business_notes: form.business_notes.trim(),
    follow_up: form.follow_up.trim(),
    admin_notes: form.admin_notes.trim(),
    created_by: form.created_by.trim() || "Admin",
  };
}

export default function MemberEvaluationSection({
  member,
}: MemberEvaluationSectionProps) {
  const [evaluations, setEvaluations] = useState<
    HpdkiMemberEvaluationRecord[]
  >([]);
  const [form, setForm] = useState<MemberEvaluationForm>(() =>
    getInitialEvaluationForm(member),
  );
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const totalPopulation = useMemo(
    () =>
      Number(form.female_goats || 0) +
      Number(form.male_goats || 0) +
      Number(form.female_sheep || 0) +
      Number(form.male_sheep || 0),
    [form],
  );

  const updateField = (field: keyof MemberEvaluationForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const loadEvaluations = useCallback(async () => {
    setLoading(true);
    setMessage("");

    try {
      const rows = await listHpdkiMemberEvaluations(member.member_number);
      setEvaluations(rows);
    } catch (error) {
      console.error("Gagal memuat riwayat evaluasi anggota:", error);
      setMessage(
        "Riwayat evaluasi belum dapat dimuat. Pastikan table hpdki_member_evaluations dan permission Appwrite sudah benar.",
      );
    } finally {
      setLoading(false);
    }
  }, [member.member_number]);

  useEffect(() => {
    setForm(getInitialEvaluationForm(member));
    setShowForm(false);
    void loadEvaluations();
  }, [loadEvaluations, member]);

  const saveEvaluation = async () => {
    setSaving(true);
    setMessage("");

    try {
      const payload = buildEvaluationPayload(member, form);
      const createdEvaluation = await createHpdkiMemberEvaluation(payload);

      setEvaluations((current) => [createdEvaluation, ...current]);
      setForm(getInitialEvaluationForm(member));
      setShowForm(false);
      setMessage("Evaluasi anggota berhasil disimpan.");
    } catch (error) {
      console.error("Gagal menyimpan evaluasi anggota:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Evaluasi anggota belum berhasil disimpan.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-member-edit-section admin-member-evaluation-section">
      <div className="admin-member-evaluation-header">
        <div>
          <h4>Riwayat Evaluasi Anggota</h4>
          <p>
            Catatan evaluasi disimpan sebagai riwayat terpisah dan tidak
            mengubah nomor anggota.
          </p>
        </div>

        <div className="admin-member-evaluation-actions">
          <button
            type="button"
            onClick={() => setShowForm((current) => !current)}
            disabled={saving}
          >
            {showForm ? "Tutup Form" : "Tambah Evaluasi"}
          </button>

          <button
            type="button"
            onClick={() => void loadEvaluations()}
            disabled={loading || saving}
          >
            {loading ? "Memuat..." : "Muat Ulang"}
          </button>
        </div>
      </div>

      {message && <p className="admin-member-evaluation-message">{message}</p>}

      {showForm && (
        <div className="admin-member-evaluation-form">
          <div className="admin-member-evaluation-grid">
            <label>
              Tanggal Evaluasi
              <input
                type="date"
                value={form.evaluation_date}
                onChange={(event) =>
                  updateField("evaluation_date", event.target.value)
                }
                required
              />
            </label>

            <label>
              Dibuat Oleh
              <input
                type="text"
                value={form.created_by}
                onChange={(event) =>
                  updateField("created_by", event.target.value)
                }
                placeholder="Nama admin/pengurus"
              />
            </label>

            <label>
              Kambing Betina
              <input
                type="number"
                min="0"
                value={form.female_goats}
                onChange={(event) =>
                  updateField("female_goats", event.target.value)
                }
                required
              />
            </label>

            <label>
              Kambing Jantan
              <input
                type="number"
                min="0"
                value={form.male_goats}
                onChange={(event) =>
                  updateField("male_goats", event.target.value)
                }
                required
              />
            </label>

            <label>
              Domba Betina
              <input
                type="number"
                min="0"
                value={form.female_sheep}
                onChange={(event) =>
                  updateField("female_sheep", event.target.value)
                }
                required
              />
            </label>

            <label>
              Domba Jantan
              <input
                type="number"
                min="0"
                value={form.male_sheep}
                onChange={(event) =>
                  updateField("male_sheep", event.target.value)
                }
                required
              />
            </label>

            <label>
              Jenis Pakan
              <input
                type="text"
                value={form.feed_type}
                onChange={(event) => updateField("feed_type", event.target.value)}
                required
              />
            </label>

            <label>
              Luas Kandang m2
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.farm_area_m2}
                onChange={(event) =>
                  updateField("farm_area_m2", event.target.value)
                }
                required
              />
            </label>
          </div>

          <div className="admin-member-evaluation-total">
            <span>Total Populasi Evaluasi</span>
            <strong>
              {Number.isFinite(totalPopulation) ? totalPopulation : 0}
            </strong>
          </div>

          <div className="admin-member-evaluation-grid">
            <label>
              Kondisi Kandang
              <textarea
                value={form.cage_condition}
                onChange={(event) =>
                  updateField("cage_condition", event.target.value)
                }
                rows={3}
              />
            </label>

            <label>
              Kondisi Ternak
              <textarea
                value={form.livestock_condition}
                onChange={(event) =>
                  updateField("livestock_condition", event.target.value)
                }
                rows={3}
              />
            </label>

            <label>
              Catatan Kesehatan
              <textarea
                value={form.health_notes}
                onChange={(event) =>
                  updateField("health_notes", event.target.value)
                }
                rows={3}
              />
            </label>

            <label>
              Catatan Pakan
              <textarea
                value={form.feed_notes}
                onChange={(event) =>
                  updateField("feed_notes", event.target.value)
                }
                rows={3}
              />
            </label>

            <label>
              Catatan Usaha
              <textarea
                value={form.business_notes}
                onChange={(event) =>
                  updateField("business_notes", event.target.value)
                }
                rows={3}
              />
            </label>

            <label>
              Tindak Lanjut
              <textarea
                value={form.follow_up}
                onChange={(event) => updateField("follow_up", event.target.value)}
                rows={3}
              />
            </label>

            <label className="admin-member-evaluation-wide">
              Catatan Admin
              <textarea
                value={form.admin_notes}
                onChange={(event) =>
                  updateField("admin_notes", event.target.value)
                }
                rows={3}
              />
            </label>
          </div>

          <div className="admin-member-evaluation-actions is-footer">
            <button
              type="button"
              onClick={() => void saveEvaluation()}
              disabled={saving}
            >
              {saving ? "Menyimpan Evaluasi..." : "Simpan Evaluasi"}
            </button>
          </div>
        </div>
      )}

      <div className="admin-member-evaluation-list">
        {loading && <p>Memuat riwayat evaluasi...</p>}

        {!loading && evaluations.length === 0 && (
          <p>Belum ada riwayat evaluasi untuk anggota ini.</p>
        )}

        {!loading &&
          evaluations.map((evaluation) => (
            <article
              key={evaluation.$id}
              className="admin-member-evaluation-item"
            >
              <div>
                <strong>{formatDate(evaluation.evaluation_date)}</strong>
                <span>
                  Total {evaluation.total_population} ekor · Dibuat oleh{" "}
                  {evaluation.created_by || "Admin"}
                </span>
              </div>

              <p>
                Kambing: {evaluation.female_goats + evaluation.male_goats} ·
                Domba: {evaluation.female_sheep + evaluation.male_sheep} ·
                Pakan: {evaluation.feed_type || "-"}
              </p>

              {evaluation.follow_up && (
                <em>Tindak lanjut: {evaluation.follow_up}</em>
              )}
            </article>
          ))}
      </div>
    </div>
  );
}
