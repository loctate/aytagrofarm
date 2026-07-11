# Deployment AYT Agro Farm

Website AYT Agro Farm dipublikasikan melalui Vercel dan menggunakan domain resmi:

https://aytagrofarm.com

## Branch Produksi

Branch produksi: main

Setiap perubahan yang sudah diperiksa dan didorong ke branch main akan diproses oleh Vercel.

## Pemeriksaan Sebelum Deployment

Jalankan:

npx tsc --noEmit
npm run lint
npm run build

## Environment Variables

Environment variable project disimpan di pengaturan Vercel.
Nilai rahasia tidak boleh ditulis di repository.

Konfigurasi utama:

NEXT_PUBLIC_SITE_URL=https://aytagrofarm.com
NEXT_PUBLIC_APPWRITE_ENDPOINT
NEXT_PUBLIC_APPWRITE_PROJECT_ID
NEXT_PUBLIC_APPWRITE_DATABASE_ID
NEXT_PUBLIC_APPWRITE_REGISTRATIONS_TABLE_ID
NEXT_PUBLIC_APPWRITE_MEMBERS_TABLE_ID
NEXT_PUBLIC_APPWRITE_KNOWLEDGE_TABLE_ID
NEXT_PUBLIC_APPWRITE_HPDKI_ACTIVITIES_TABLE_ID
NEXT_PUBLIC_APPWRITE_HPDKI_ACTIVITY_PHOTOS_BUCKET_ID
NEXT_PUBLIC_APPWRITE_AYT_ACTIVITIES_TABLE_ID
NEXT_PUBLIC_APPWRITE_AYT_ACTIVITY_PHOTOS_BUCKET_ID
NEXT_PUBLIC_HPDKI_REGISTRATION_OPEN
HPDKI_REGISTRATION_OPEN

## Deployment

git add .
git commit -m "deskripsi perubahan"
git push origin main

Tunggu deployment Vercel sampai berstatus Ready.

## Pemeriksaan Production

https://aytagrofarm.com
https://aytagrofarm.com/produk
https://aytagrofarm.com/cerita-ayt
https://aytagrofarm.com/hpdki
https://aytagrofarm.com/hpdki/daftar
https://aytagrofarm.com/hpdki/anggota
https://aytagrofarm.com/hpdki/pengurus
https://aytagrofarm.com/hpdki/kegiatan
https://aytagrofarm.com/hpdki/verifikasi
https://aytagrofarm.com/admin

## Catatan Keamanan

- Jangan menyimpan password atau kredensial di repository.
- Jangan membuka data pribadi pendaftar kepada publik.
- Dashboard admin harus tetap menggunakan login.
- Data berstatus draft tidak ditampilkan pada halaman publik.
