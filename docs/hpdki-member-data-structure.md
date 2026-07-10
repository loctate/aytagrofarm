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

## Helper kode yang sudah disiapkan

### src/lib/hpdki/member-data-structure.ts

Berisi:
- Konstanta nama tabel.
- Daftar field terkunci.
- Daftar field yang boleh diedit admin.
- Helper membuat nomor anggota.
- Helper membaca tahun dan urutan dari nomor anggota.
- Helper sanitasi payload update anggota.

### src/lib/hpdki/member-export-helpers.ts

Berisi:
- Helper sort anggota berdasarkan nomor anggota resmi.
- Helper membentuk baris export.
- Header export yang nanti dipakai untuk Excel.

### src/lib/hpdki/member-update-helpers.ts

Berisi:
- Helper payload aman untuk update anggota.
- Deteksi field yang ditolak.
- Proteksi field terkunci seperti member_number, member_sequence, approved_at, dan document_id.

## Tahap berikutnya

Tahap berikutnya adalah menghubungkan helper ini ke admin dashboard:

1. Tombol Export Excel Anggota Aktif.
2. Tombol Export Excel Semua Anggota.
3. Form edit anggota yang hanya mengirim field yang boleh diedit.
4. Riwayat evaluasi anggota.
5. Riwayat kunjungan anggota.
