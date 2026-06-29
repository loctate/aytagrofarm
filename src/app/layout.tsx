import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://aytagrofarm.pages.dev").replace(/\/$/, "");
const siteName = "AYT Agro Farm";
const description =
  "AYT Agro Farm melayani breeding, fattening, dan trading kambing serta domba untuk peternak, pedagang, pengepul, supplier, qurban, dan aqiqah di Bogor, Jabodetabek, dan sekitarnya.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: "AYT Agro Farm | Breeding, Fattening & Trading Kambing Domba",
    template: "%s | AYT Agro Farm",
  },
  description,
  keywords: [
    "AYT Agro Farm",
    "peternakan kambing Bogor",
    "peternakan domba Bogor",
    "breeding kambing",
    "breeding domba",
    "fattening kambing",
    "fattening domba",
    "trading kambing domba",
    "jual beli kambing Bogor",
    "jual beli domba Jabodetabek",
    "kambing qurban Bogor",
    "kambing aqiqah Bogor",
  ],
  authors: [{ name: siteName, url: "https://www.instagram.com/ayt_farm/" }],
  creator: siteName,
  publisher: siteName,
  category: "Peternakan",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "AYT Agro Farm | Breeding, Fattening & Trading",
    description,
    url: "/",
    siteName,
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "AYT Agro Farm — breeding, fattening, dan trading kambing domba",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AYT Agro Farm | Breeding, Fattening & Trading",
    description,
    images: ["/opengraph-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#103e2c",
  colorScheme: "light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteUrl}/#business`,
  name: siteName,
  url: siteUrl,
  image: `${siteUrl}/opengraph-image.jpg`,
  logo: `${siteUrl}/icons/icon-512.png`,
  description,
  telephone: "+62-878-8912-4342",
  sameAs: ["https://www.instagram.com/ayt_farm/"],
  areaServed: ["Bogor", "Jabodetabek"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Kp. Sukabakti RT.002/RW.006, Desa Sukawening",
    addressLocality: "Dramaga",
    addressRegion: "Jawa Barat",
    addressCountry: "ID",
  },
  knowsAbout: [
    "Breeding kambing dan domba",
    "Fattening kambing dan domba",
    "Trading kambing dan domba",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
