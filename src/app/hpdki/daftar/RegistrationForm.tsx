"use client";

import { FormEvent, useState } from "react";

export default function RegistrationForm() {
  const [developmentMessage, setDevelopmentMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setDevelopmentMessage(
      "Tampilan dan validasi form sudah berjalan. Penyimpanan data akan diaktifkan setelah persyaratan resmi dan database selesai disiapkan."
    );
  };

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <div className="registration-field-grid">
        <label className="registration-field registration-field-full">
          <span>Nama lengkap</span>
          <input
            type="text"
            name="fullName"
            autoComplete="name"
            placeholder="Masukkan nama lengkap"
            required
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
          />
          <small>Nomor ini menjadi kontak utama proses pendaftaran.</small>
        </label>

        <label className="registration-field">
          <span>Domisili atau kecamatan</span>
          <input
            type="text"
            name="domicile"
            placeholder="Contoh: Dramaga, Kabupaten Bogor"
            required
          />
        </label>

        <label className="registration-field">
          <span>Nama peternakan atau usaha</span>
          <input
            type="text"
            name="farmName"
            placeholder="Opsional"
          />
        </label>

        <label className="registration-field">
          <span>Jenis ternak utama</span>
          <select name="livestockType" defaultValue="" required>
            <option value="" disabled>
              Pilih jenis ternak
            </option>
            <option value="kambing">Kambing</option>
            <option value="domba">Domba</option>
            <option value="kambing-domba">Kambing dan domba</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </label>

        <label className="registration-field registration-field-full">
          <span>Informasi singkat peternakan</span>
          <textarea
            name="farmInformation"
            rows={5}
            placeholder="Ceritakan secara singkat kegiatan peternakan atau usaha yang sedang dijalankan."
            required
          />
        </label>
      </div>

      <label className="registration-agreement">
        <input type="checkbox" name="agreement" required />
        <span>
          Saya menyatakan bahwa data yang diberikan benar dan bersedia
          dihubungi melalui WhatsApp untuk proses pemeriksaan pendaftaran.
        </span>
      </label>

      <button className="registration-submit" type="submit">
        Uji Formulir Pendaftaran
      </button>

      <p className="registration-development-note">
        Mode pengembangan: tombol ini belum menyimpan atau mengirim data calon
        anggota.
      </p>

      {developmentMessage && (
        <div className="registration-form-message" role="status">
          {developmentMessage}
        </div>
      )}
    </form>
  );
}
