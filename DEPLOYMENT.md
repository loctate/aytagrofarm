# Deployment GitHub + Cloudflare Pages

## 1. Buat repository GitHub

Nama yang disarankan: `aytagrofarm`

Dari folder project:

```bash
git init
git branch -M main
git add .
git commit -m "feat: final AYT Agro Farm landing page"
git remote add origin https://github.com/loctate/aytagrofarm.git
git push -u origin main
```

Jika repository sudah memiliki file, gunakan URL repository yang benar dan sesuaikan alur merge sebelum push.

## 2. Hubungkan ke Cloudflare Pages

Di Cloudflare Dashboard:

1. Buka **Workers & Pages**.
2. Pilih **Create application**.
3. Pilih **Pages** lalu **Import an existing Git repository**.
4. Hubungkan GitHub dan pilih repository `aytagrofarm`.
5. Gunakan konfigurasi:

```text
Production branch: main
Framework preset: Next.js (Static HTML Export)
Build command: npm run build
Build output directory: out
Root directory: /
```

## 3. Environment variable

Tambahkan pada bagian environment variables:

```text
NEXT_PUBLIC_SITE_URL=https://aytagrofarm.pages.dev
NODE_VERSION=24
```

Jika nama `aytagrofarm.pages.dev` tidak tersedia dan Cloudflare memberi URL lain, ubah `NEXT_PUBLIC_SITE_URL` sesuai URL tersebut lalu jalankan deployment ulang.

## 4. Verifikasi setelah deployment

Buka dan periksa:

```text
/
/robots.txt
/sitemap.xml
/manifest.webmanifest
/opengraph-image.jpg
```

Uji juga:

- Menu mobile
- Tombol WhatsApp
- Instagram
- Google Maps
- Tampilan desktop dan ponsel
- Preview saat link dibagikan

## 5. Domain sendiri nanti

Saat domain tersedia:

1. Tambahkan domain pada **Custom domains** di project Pages.
2. Ubah `NEXT_PUBLIC_SITE_URL` menjadi domain final, contoh `https://aytagrofarm.com`.
3. Jalankan deployment ulang supaya canonical URL, sitemap, structured data, dan Open Graph menggunakan domain final.
