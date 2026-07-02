"use client";

import { FormEvent, useMemo, useState } from "react";
import { createHpdkiRegistration } from "@/lib/appwrite/registrations";

type Population = {
  femaleGoats: number;
  maleGoats: number;
  femaleSheep: number;
  maleSheep: number;
};

type SubmissionResult = {
  registrationNumber: string;
  whatsappUrl: string;
};

const initialPopulation: Population = {
  femaleGoats: 0,
  maleGoats: 0,
  femaleSheep: 0,
  maleSheep: 0,
};

function normalizeWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("62")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  if (digits.startsWith("8")) {
    return `62${digits}`;
  }

  return digits;
}

function generateRegistrationNumber() {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `AYT-HPDKI-${year}-${timestamp}${random}`;
}

export default function RegistrationForm() {
  const [population, setPopulation] =
    useState<Population>(initialPopulation);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);

  const totalPopulation = useMemo(
    () =>
      population.femaleGoats +
      population.maleGoats +
      population.femaleSheep +
      population.maleSheep,
    [population]
  );

  const updatePopulation = (
    key: keyof Population,
    rawValue: string
  ) => {
    const value = Math.max(0, Number.parseInt(rawValue || "0", 10));

    setPopulation((current) => ({
      ...current,
      [key]: Number.isFinite(value) ? value : 0,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setErrorMessage("");

    const whatsapp = normalizeWhatsapp(
      String(formData.get("whatsapp") ?? "")
    );

    if (!/^62\d{8,13}$/.test(whatsapp)) {
      setErrorMessage(
        "Nomor WhatsApp belum valid. Gunakan nomor Indonesia yang aktif."
      );
      return;
    }

    if (totalPopulation <= 0) {
      setErrorMessage(
        "Masukkan minimal satu ekor kambing atau domba."
      );
      return;
    }

    const farmArea = Number(formData.get("farm_area_m2"));

    if (!Number.isFinite(farmArea) || farmArea <= 0) {
      setErrorMessage(
        "Luas kandang harus lebih besar dari 0 m²."
      );
      return;
    }

    const registrationNumber = generateRegistrationNumber();

    setSubmitting(true);

    try {
      await createHpdkiRegistration({
        registration_number: registrationNumber,
        farmer_name: String(formData.get("farmer_name") ?? "").trim(),
        whatsapp,
        farm_group_name: String(
          formData.get("farm_group_name") ?? ""
        ).trim(),
        farm_address: String(
          formData.get("farm_address") ?? ""
        ).trim(),
        village: String(formData.get("village") ?? "").trim(),
        district: String(formData.get("district") ?? "").trim(),
        regency: String(formData.get("regency") ?? "").trim(),
        female_goats: population.femaleGoats,
        male_goats: population.maleGoats,
        female_sheep: population.femaleSheep,
        male_sheep: population.maleSheep,
        feed_type: String(formData.get("feed_type") ?? "").trim(),
        farm_area_m2: farmArea,
        total_population: totalPopulation,
        notes: String(formData.get("notes") ?? "").trim(),
        status: "Pendaftaran Baru",
        registered_at: new Date().toISOString(),
        agreement_accepted: true,
      });

      const confirmationMessage = encodeURIComponent(
        `Halo Admin AYT Agro Farm, saya telah mengirim pendaftaran anggota HPDKI dengan nomor ${registrationNumber}.`
      );

      setSubmissionResult({
        registrationNumber,
        whatsappUrl:
          `https://wa.me/6287889124342?text=${confirmationMessage}`,
      });

      form.reset();
      setPopulation(initialPopulation);
    } catch (error) {
      console.error("Gagal mengirim pendaftaran:", error);

      setErrorMessage(
        "Pendaftaran belum berhasil dikirim. Periksa koneksi lalu coba kembali."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submissionResult) {
    return (
      <div className="registration-success" role="status">
        <span className="registration-success-icon">✓</span>

        <h3>Pendaftaran Berhasil Dikirim</h3>

        <p>
          Data Anda sudah masuk dan akan diperiksa oleh admin
          AYT Agro Farm.
        </p>

        <div className="registration-number-box">
          <span>Nomor pendaftaran</span>
          <strong>{submissionResult.registrationNumber}</strong>
        </div>

        <a
          className="registration-confirm-whatsapp"
          href={submissionResult.whatsappUrl}
          target="_blank"
          rel="noreferrer"
        >
          Konfirmasi melalui WhatsApp
        </a>

        <button
          className="registration-new-button"
          type="button"
          onClick={() => setSubmissionResult(null)}
        >
          Isi Pendaftaran Baru
        </button>
      </div>
    );
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <section className="registration-form-section">
        <div className="registration-section-heading">
          <span>01</span>
          <div>
            <h3>Data Peternak</h3>
            <p>Masukkan identitas dan kontak utama peternak.</p>
          </div>
        </div>

        <div className="registration-field-grid">
          <label className="registration-field">
            <span>Nama peternak</span>
            <input
              type="text"
              name="farmer_name"
              autoComplete="name"
              placeholder="Masukkan nama lengkap"
              required
              maxLength={150}
            />
          </label>

          <label className="registration-field">
            <span>Nomor WhatsApp</span>
            <input
              type="tel"
              name="whatsapp"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Contoh: 0812 3456 7890"
              required
              maxLength={30}
            />
            <small>
              Nomor ini digunakan untuk proses pemeriksaan.
            </small>
          </label>

          <label className="registration-field registration-field-full">
            <span>
              Nama kelompok ternak, kandang, atau padepokan
            </span>
            <input
              type="text"
              name="farm_group_name"
              placeholder="Contoh: Kelompok Peternakan AYT Farm"
              required
              maxLength={200}
            />
          </label>
        </div>
      </section>

      <section className="registration-form-section">
        <div className="registration-section-heading">
          <span>02</span>
          <div>
            <h3>Lokasi Kandang</h3>
            <p>Masukkan alamat kandang secara lengkap.</p>
          </div>
        </div>

        <div className="registration-field-grid">
          <label className="registration-field registration-field-full">
            <span>Alamat lengkap kandang</span>
            <textarea
              name="farm_address"
              rows={4}
              placeholder="Nama jalan/kampung, RT/RW, dan informasi lokasi lainnya"
              required
            />
          </label>

          <label className="registration-field">
            <span>Desa atau kelurahan</span>
            <input
              type="text"
              name="village"
              placeholder="Contoh: Sukawening"
              required
              maxLength={100}
            />
          </label>

          <label className="registration-field">
            <span>Kecamatan</span>
            <input
              type="text"
              name="district"
              placeholder="Contoh: Dramaga"
              required
              maxLength={100}
            />
          </label>

          <label className="registration-field registration-field-full">
            <span>Kabupaten atau kota</span>
            <input
              type="text"
              name="regency"
              defaultValue="Kabupaten Bogor"
              required
              maxLength={100}
            />
          </label>
        </div>
      </section>

      <section className="registration-form-section">
        <div className="registration-section-heading">
          <span>03</span>
          <div>
            <h3>Populasi Ternak</h3>
            <p>
              Isi jumlah kambing dan domba berdasarkan jenis kelamin.
            </p>
          </div>
        </div>

        <div className="registration-population-group">
          <div>
            <h4>Kambing</h4>

            <div className="registration-population-grid">
              <label className="registration-field">
                <span>Betina</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={population.femaleGoats}
                  onChange={(event) =>
                    updatePopulation(
                      "femaleGoats",
                      event.target.value
                    )
                  }
                  required
                />
              </label>

              <label className="registration-field">
                <span>Jantan</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={population.maleGoats}
                  onChange={(event) =>
                    updatePopulation(
                      "maleGoats",
                      event.target.value
                    )
                  }
                  required
                />
              </label>
            </div>
          </div>

          <div>
            <h4>Domba</h4>

            <div className="registration-population-grid">
              <label className="registration-field">
                <span>Betina</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={population.femaleSheep}
                  onChange={(event) =>
                    updatePopulation(
                      "femaleSheep",
                      event.target.value
                    )
                  }
                  required
                />
              </label>

              <label className="registration-field">
                <span>Jantan</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={population.maleSheep}
                  onChange={(event) =>
                    updatePopulation(
                      "maleSheep",
                      event.target.value
                    )
                  }
                  required
                />
              </label>
            </div>
          </div>
        </div>

        <div className="registration-total-population">
          <span>Jumlah populasi</span>
          <strong>{totalPopulation} ekor</strong>
        </div>
      </section>

      <section className="registration-form-section">
        <div className="registration-section-heading">
          <span>04</span>
          <div>
            <h3>Informasi Pemeliharaan</h3>
            <p>Lengkapi informasi kandang dan pakan ternak.</p>
          </div>
        </div>

        <div className="registration-field-grid">
          <label className="registration-field">
            <span>Jenis pakan utama</span>
            <input
              type="text"
              name="feed_type"
              list="feed-options"
              placeholder="Contoh: Hijauan"
              required
              maxLength={200}
            />

            <datalist id="feed-options">
              <option value="Hijauan" />
              <option value="Konsentrat" />
              <option value="Fermentasi" />
              <option value="Campuran" />
            </datalist>
          </label>

          <label className="registration-field">
            <span>Luas kandang (m²)</span>
            <input
              type="number"
              name="farm_area_m2"
              min="0.1"
              step="0.1"
              placeholder="Contoh: 200"
              required
            />
          </label>

          <label className="registration-field registration-field-full">
            <span>Catatan tambahan</span>
            <textarea
              name="notes"
              rows={4}
              placeholder="Informasi tambahan mengenai peternakan atau kebutuhan anggota"
            />
          </label>
        </div>
      </section>

      <label className="registration-agreement">
        <input type="checkbox" name="agreement" required />
        <span>
          Saya menyatakan bahwa data yang diberikan benar dan
          bersedia dihubungi melalui WhatsApp untuk proses
          pemeriksaan keanggotaan.
        </span>
      </label>

      {errorMessage && (
        <div className="registration-form-error" role="alert">
          {errorMessage}
        </div>
      )}

      <button
        className="registration-submit"
        type="submit"
        disabled={submitting}
      >
        {submitting
          ? "Mengirim Pendaftaran..."
          : "Kirim Pendaftaran"}
      </button>

      <p className="registration-data-note">
        Data yang dikirim hanya dapat diperiksa oleh admin.
      </p>
    </form>
  );
}
