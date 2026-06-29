# AYT Agro Farm — Final Landing Page

Landing page statis untuk AYT Agro Farm dengan fokus bisnis breeding, fattening, dan trading kambing serta domba.

## Teknologi

- Next.js 16
- React 19
- TypeScript
- Static export (`output: "export"`)
- Siap di-deploy ke Cloudflare Pages

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Validasi production

```bash
npm run lint
npm run build
```

Hasil static export berada di folder `out`.

## Variabel URL publik

Salin `.env.example` menjadi `.env.local` bila ingin menguji canonical URL dan sitemap secara lokal:

```bash
cp .env.example .env.local
```

Sebelum deployment, set `NEXT_PUBLIC_SITE_URL` ke URL Cloudflare Pages atau domain final, tanpa garis miring di akhir.

Contoh:

```text
NEXT_PUBLIC_SITE_URL=https://aytagrofarm.pages.dev
```

## Konfigurasi Cloudflare Pages

- Framework preset: `Next.js (Static HTML Export)`
- Build command: `npm run build`
- Build output directory: `out`
- Node.js version: `24`
- Environment variable: `NEXT_PUBLIC_SITE_URL=https://<nama-project>.pages.dev`

## Yang masih perlu dikonfirmasi sebelum publik

- Foto dokumentasi asli jika tersedia
- Link pin Google Maps yang tepat
- Ketentuan harga, pembayaran, pengiriman, dan kunjungan
- URL final atau domain sendiri
