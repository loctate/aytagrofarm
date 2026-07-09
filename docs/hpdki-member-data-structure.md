# Struktur Data Anggota HPDKI PAC Dramaga

Dokumen ini menjadi acuan pengembangan struktur data anggota HPDKI PAC Kecamatan Dramaga.

## Tabel utama

### 1. hpdki_registrations

Menyimpan data pendaftaran awal calon anggota dari form publik.

Digunakan untuk:
- Data calon anggota.
- Review admin.
- Approval menjadi anggota resmi.
- Riwayat status pendaftaran.

### 2. hpdki_members

Menyimpan data anggota resmi yang sudah disetujui admin.

Digunakan untuk:
- Daftar anggota aktif.
- KTA.
- Data publik anggota.
- Export Excel.
- Status aktif/nonaktif.

### 3. hpdki_member_evaluations

Menyimpan data evaluasi berkala anggota.

Contoh:
- Update jumlah ternak.
- Kondisi kandang.
- Kondisi kesehatan ternak.
- Catatan pembinaan.
- Catatan perkembangan usaha.

### 4. hpdki_member_visits

Menyimpan riwayat kunjungan lapangan ke anggota.

Contoh:
- Tanggal kunjungan.
- Petugas/pengurus yang berkunjung.
- Tujuan kunjungan.
- Temuan lapangan.
- Tindak lanjut.
- Foto dokumentasi.

### 5. hpdki_card_settings

Menyimpan pengaturan KTA dari admin.

Contoh:
- Nama ketua.
- Nomor ketua.
- Nama wakil ketua.
- Nomor wakil ketua.
- Masa berlaku default.
- Alamat sekretariat.
- Kontak sekretariat.
- Tanda tangan.

## Field yang tidak boleh diedit setelah anggota disetujui

- document_id
- member_number
- registration_number
- member_data_number
- member_year
- member_sequence
- approved_at
- created_at

## Field yang boleh diedit admin

- farmer_name
- phone
- farm_group_name
- village
- district
- regency
- province
- address
- livestock_type
- female_count
- male_count
- total_livestock_count
- cage_ownership
- farm_location
- membership_status
- inactive_reason
- admin_notes
- is_public
- updated_at

## Aturan export Excel

Export Excel anggota harus diurutkan berdasarkan nomor anggota resmi.

Contoh urutan:

1. HPDKI-PAC-DRAMAGA-2026-001
2. HPDKI-PAC-DRAMAGA-2026-002
3. HPDKI-PAC-DRAMAGA-2026-003

Jika ada data tanpa nomor anggota, data tersebut ditempatkan setelah data bernomor resmi.
