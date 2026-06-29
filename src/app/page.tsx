"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

const whatsappNumber = "6287889124342";
const instagramUrl = "https://www.instagram.com/ayt_farm/";
const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Jl.%20Kp.%20Sukabakti%20RT.002%20RW.006%20Desa%20Sukawening%20Dramaga%20Bogor";

const whatsappUrl = (message: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

const stockWhatsappUrl = whatsappUrl(
  "Halo AYT Agro Farm, saya melihat website dan ingin mengecek stok kambing atau domba. Kebutuhan saya untuk breeding, fattening, trading, qurban, atau aqiqah."
);

const offerWhatsappUrl = whatsappUrl(
  "Halo AYT Agro Farm, saya ingin menawarkan kambing atau domba. Saya akan mengirimkan jenis ternak, jumlah, perkiraan bobot, lokasi, serta foto atau video."
);

const partnerWhatsappUrl = whatsappUrl(
  "Halo AYT Agro Farm, saya tertarik berdiskusi mengenai kemitraan breeding, fattening, atau trading kambing dan domba."
);

type IconName =
  | "arrow"
  | "breeding"
  | "fattening"
  | "trading"
  | "shield"
  | "leaf"
  | "handshake"
  | "pin"
  | "phone"
  | "clipboard"
  | "check"
  | "instagram"
  | "whatsapp"
  | "menu"
  | "close"
  | "camera"
  | "building"
  | "users"
  | "chevronLeft"
  | "chevronRight";

function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const paths: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m14 6 6 6-6 6" />
      </>
    ),
    breeding: (
      <>
        <path d="M12 21V9" />
        <path d="M7 4c3 0 5 2 5 5-3 0-5-2-5-5Z" />
        <path d="M17 2c-3 0-5 2-5 5 3 0 5-2 5-5Z" />
      </>
    ),
    fattening: (
      <>
        <path d="M4 20V8l8-5 8 5v12" />
        <path d="M8 20v-6h8v6" />
        <path d="M8 10h.01M12 10h.01M16 10h.01" />
      </>
    ),
    trading: (
      <>
        <path d="M3 7h11" />
        <path d="m11 4 3 3-3 3" />
        <path d="M21 17H10" />
        <path d="m13 14-3 3 3 3" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    leaf: (
      <>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15 3 20 4 20 4s1 5-2.1 10.2A7 7 0 0 1 11 20Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6.94C9.61 12.82 12.83 12 17 12" />
      </>
    ),
    handshake: (
      <>
        <path d="m11 17 2 2a2 2 0 0 0 3-3l-3-3" />
        <path d="m14 14 2.5 2.5a2 2 0 0 0 3-3L15 9l-2 2a2 2 0 0 1-3-3l2.4-2.4a4 4 0 0 1 5.2 0L21 8" />
        <path d="m3 7 4 4" />
        <path d="m2 8 5-5 3 3-5 5Z" />
        <path d="m21 8-5-5-3 3 5 5Z" />
        <path d="m8 16 2 2" />
        <path d="m6 18 2 2" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    phone: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    ),
    clipboard: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4.5V3h6v1.5" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none" />
      </>
    ),
    whatsapp: (
      <>
        <path d="M21 11.5a8.4 8.4 0 0 1-8.7 8.4 9.2 9.2 0 0 1-3.9-.9L3 20.5l1.5-5.2A8.4 8.4 0 1 1 21 11.5Z" />
        <path d="M8.2 8.2c.3-.7.7-.7 1-.7h.4c.2 0 .4.1.5.4l.8 1.9c.1.3 0 .5-.1.7l-.6.8c-.2.2-.2.4 0 .7.5.9 1.3 1.7 2.2 2.2.3.2.5.2.7 0l.9-1c.2-.2.4-.3.7-.2l1.9.9c.3.1.4.3.4.5 0 .4-.2 1.3-.9 1.8-.6.5-1.4.8-2.4.5-1.4-.4-3.1-1.2-4.8-2.9-1.4-1.4-2.4-3.1-2.7-4.5-.2-.8 0-1.6.4-2.2Z" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
    camera: (
      <>
        <path d="M14.5 4 16 6h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l1.5-2Z" />
        <circle cx="12" cy="13" r="3.5" />
      </>
    ),
    building: (
      <>
        <path d="M4 21V5l8-3 8 3v16" />
        <path d="M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01" />
        <path d="M9 21v-4h6v4" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    chevronLeft: <path d="m15 18-6-6 6-6" />,
    chevronRight: <path d="m9 18 6-6-6-6" />,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

const services = [
  {
    number: "01",
    icon: "breeding" as const,
    title: "Breeding",
    text: "Pemilihan bibit, indukan, dan pejantan untuk mendukung pengembangan populasi ternak.",
    link: stockWhatsappUrl,
  },
  {
    number: "02",
    icon: "fattening" as const,
    title: "Fattening",
    text: "Bakalan serta pengelolaan penggemukan berdasarkan usia, kondisi, bobot, dan target usaha.",
    link: stockWhatsappUrl,
  },
  {
    number: "03",
    icon: "trading" as const,
    title: "Trading",
    text: "Jual beli kambing dan domba untuk peternak, pedagang, pengepul, supplier, dan mitra usaha.",
    link: offerWhatsappUrl,
  },
];

const benefits = [
  {
    icon: "shield" as const,
    title: "Perawatan Ternak",
    text: "Pemeliharaan terarah dengan perhatian pada kondisi, kebersihan, dan kebutuhan ternak.",
  },
  {
    icon: "leaf" as const,
    title: "Manajemen Pakan",
    text: "Pakan disesuaikan dengan fase breeding maupun fattening untuk mendukung target pemeliharaan.",
  },
  {
    icon: "handshake" as const,
    title: "Mitra Amanah",
    text: "Komunikasi terbuka mengenai spesifikasi, ketersediaan, harga, dan proses transaksi.",
  },
  {
    icon: "pin" as const,
    title: "Jangkauan Jabodetabek",
    text: "Melayani kebutuhan peternak dan pelaku usaha di Jabodetabek dan wilayah sekitarnya.",
  },
];

const galleryItems = [
  {
    src: "/images/gallery-ternak.jpg",
    title: "Pilihan Ternak",
    text: "Kambing dan domba untuk kebutuhan breeding, fattening, dan trading.",
  },
  {
    src: "/images/gallery-lahan.jpg",
    title: "Lingkungan Peternakan",
    text: "Visual konsep suasana peternakan tropis yang dekat dengan karakter AYT Agro Farm.",
  },
  {
    src: "/images/gallery-kandang.jpg",
    title: "Kandang & Pemeliharaan",
    text: "Area kandang sebagai pusat perawatan dan aktivitas ternak.",
  },
  {
    src: "/images/gallery-pakan.jpg",
    title: "Pakan & Penggemukan",
    text: "Pemberian pakan dan pengelolaan ternak sesuai fase pemeliharaan.",
  },
];

const steps = [
  {
    icon: "phone" as const,
    title: "Hubungi Kami",
    text: "Sampaikan kebutuhan atau penawaran ternak melalui WhatsApp.",
  },
  {
    icon: "clipboard" as const,
    title: "Pilih Kebutuhan",
    text: "Diskusikan jenis, jumlah, bobot, tujuan, lokasi, dan anggaran.",
  },
  {
    icon: "handshake" as const,
    title: "Proses Transaksi",
    text: "Konfirmasi kesepakatan, jadwal kunjungan, pembayaran, atau pengiriman.",
  },
];

const faqs = [
  {
    q: "Apakah melayani pembelian satuan dan partai?",
    a: "Kebutuhan satuan maupun jumlah tertentu dapat dibicarakan berdasarkan jenis dan stok ternak yang tersedia.",
  },
  {
    q: "Apakah saya bisa menawarkan ternak untuk dijual?",
    a: "Bisa. Kirimkan jenis ternak, jumlah, perkiraan bobot, lokasi, serta foto atau video melalui WhatsApp.",
  },
  {
    q: "Apakah bisa memilih berdasarkan bobot dan tujuan pemeliharaan?",
    a: "Bisa. Kebutuhan breeding, fattening, trading, qurban, atau aqiqah dapat dikonsultasikan lebih dahulu.",
  },
  {
    q: "Bagaimana cara berkunjung ke kandang?",
    a: "Hubungi AYT Agro Farm terlebih dahulu untuk mengonfirmasi jadwal dan petunjuk menuju lokasi kandang di Dramaga, Bogor.",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const scrollGallery = (direction: "left" | "right") => {
    galleryRef.current?.scrollBy({
      left: direction === "right" ? 340 : -340,
      behavior: "smooth",
    });
  };

  return (
    <main>
      <header className="site-header">
        <div className="container nav-shell">
          <a className="brand" href="#home" aria-label="AYT Agro Farm beranda" onClick={() => setMenuOpen(false)}>
            <span className="brand-logo">
              <Image
                src="/images/ayt-logo-mark.png"
                alt="Logo AYT Agro Farm"
                width={58}
                height={58}
                priority
              />
            </span>
            <span className="brand-text">
              <strong>AYT <em>AGRO FARM</em></strong>
              <small>Breeding • Fattening • Trading</small>
            </span>
          </a>

          <nav id="primary-navigation" className={`nav-links ${menuOpen ? "is-open" : ""}`} aria-label="Navigasi utama">
            <a href="#tentang" onClick={() => setMenuOpen(false)}>Tentang</a>
            <a href="#layanan" onClick={() => setMenuOpen(false)}>Layanan</a>
            <a href="#kemitraan" onClick={() => setMenuOpen(false)}>Kemitraan</a>
            <a href="#galeri" onClick={() => setMenuOpen(false)}>Galeri</a>
            <a href="#kontak" onClick={() => setMenuOpen(false)}>Kontak</a>
            <a className="nav-cta" href={stockWhatsappUrl} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Cek Stok</a>
          </nav>

          <button
            className="menu-button"
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <button
          className="menu-backdrop"
          type="button"
          aria-label="Tutup menu navigasi"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <section className="hero" id="home">
        <div className="hero-decoration hero-decoration-one" />
        <div className="hero-decoration hero-decoration-two" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><Icon name="breeding" size={15} /> Mitra usaha peternakan</div>
            <h1>
              Mitra Breeding,
              <span>Fattening &amp; Trading</span>
              <em>Kambing &amp; Domba</em>
            </h1>
            <p>
              Menyediakan bibit, indukan, bakalan, dan ternak siap jual untuk peternak,
              pedagang, pengepul, supplier, serta mitra usaha di Jabodetabek dan sekitarnya.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href={stockWhatsappUrl} target="_blank" rel="noreferrer">
                <Icon name="whatsapp" size={20} /> Cek Stok Ternak <Icon name="arrow" size={18} />
              </a>
              <a className="button button-outline" href={offerWhatsappUrl} target="_blank" rel="noreferrer">
                Tawarkan Ternak
              </a>
            </div>

            <div className="trust-strip" aria-label="Informasi layanan">
              <div>
                <span className="trust-icon"><Icon name="pin" /></span>
                <span><strong>Bogor</strong><small>Basis operasional</small></span>
              </div>
              <div>
                <span className="trust-icon"><Icon name="building" /></span>
                <span><strong>Jabodetabek</strong><small>Area pelayanan</small></span>
              </div>
              <div>
                <span className="trust-icon"><Icon name="users" /></span>
                <span><strong>B2B &amp; Retail</strong><small>Model kebutuhan</small></span>
              </div>
            </div>
          </div>

          <div className="hero-media">
            <div className="hero-image-frame">
              <Image
                src="/images/hero-ayt-agro-farm.jpg"
                alt="Ilustrasi AYT Agro Farm dengan kandang, kambing, dan domba"
                fill
                priority
                sizes="(max-width: 980px) 100vw, 56vw"
              />
              <div className="hero-image-shade" />
            </div>
          </div>
        </div>
      </section>

      <section className="service-overlap" id="layanan">
        <div className="container service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <div className="service-head">
                <span className="service-icon"><Icon name={service.icon} /></span>
                <span className="service-number">{service.number}</span>
              </div>
              <h2>{service.title}</h2>
              <p>{service.text}</p>
              <a href={service.link} target="_blank" rel="noreferrer">
                Selengkapnya <Icon name="arrow" size={16} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="benefits section" id="tentang">
        <div className="leaf-decoration leaf-left" />
        <div className="leaf-decoration leaf-right" />
        <div className="container">
          <div className="section-heading centered">
            <span className="section-kicker"><Icon name="leaf" size={15} /> Keunggulan kami</span>
            <h2>Mengapa <em>AYT Agro Farm?</em></h2>
            <p>
              Pendekatan usaha yang menggabungkan pemeliharaan ternak, komunikasi terbuka,
              dan jaringan perdagangan untuk kebutuhan peternak maupun pelaku usaha.
            </p>
          </div>

          <div className="benefit-grid">
            {benefits.map((benefit) => (
              <article key={benefit.title}>
                <span className="benefit-icon"><Icon name={benefit.icon} size={30} /></span>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery section" id="galeri">
        <div className="container">
          <div className="gallery-title-row">
            <div className="section-heading">
              <span className="section-kicker"><Icon name="camera" size={16} /> Dokumentasi</span>
              <h2>Galeri &amp; Aktivitas</h2>
              <p>
                Visual ilustratif mengikuti karakter ternak, kandang, dan materi edukasi AYT Farm.
              </p>
            </div>
            <div className="gallery-controls" aria-label="Kontrol galeri">
              <button type="button" onClick={() => scrollGallery("left")} aria-label="Geser galeri ke kiri">
                <Icon name="chevronLeft" />
              </button>
              <button type="button" onClick={() => scrollGallery("right")} aria-label="Geser galeri ke kanan">
                <Icon name="chevronRight" />
              </button>
            </div>
          </div>

          <div className="gallery-track" ref={galleryRef}>
            {galleryItems.map((item) => (
              <article className="gallery-card" key={item.title}>
                <div className="gallery-image">
                  <Image src={item.src} alt={item.title} fill sizes="(max-width: 700px) 84vw, 320px" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <p className="gallery-disclaimer">
            Visual ilustratif disusun berdasarkan referensi karakter AYT Farm. Dokumentasi asli dapat menggantikan visual ini pada pembaruan berikutnya.
          </p>
        </div>
      </section>

      <section className="partnership section" id="kemitraan">
        <div className="container partnership-shell">
          <div className="section-heading centered compact">
            <span className="section-kicker"><Icon name="handshake" size={16} /> Cara bermitra</span>
            <h2>Mudah, Cepat &amp; Terarah</h2>
            <p>Mulai percakapan, jelaskan kebutuhan, lalu sepakati proses yang paling sesuai.</p>
          </div>

          <div className="step-grid">
            {steps.map((step, index) => (
              <article className="step-card" key={step.title}>
                <span className="step-number">{index + 1}</span>
                <span className="step-icon"><Icon name={step.icon} size={36} /></span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>

          <div className="partner-actions">
            <a className="button button-primary" href={partnerWhatsappUrl} target="_blank" rel="noreferrer">
              Diskusi Kemitraan <Icon name="arrow" size={18} />
            </a>
            <a className="text-link" href={instagramUrl} target="_blank" rel="noreferrer">
              <Icon name="instagram" size={19} /> Lihat aktivitas di Instagram
            </a>
          </div>
        </div>
      </section>

      <section className="faq section">
        <div className="container faq-grid">
          <div className="faq-intro">
            <span className="section-kicker"><Icon name="check" size={16} /> Informasi awal</span>
            <h2>Pertanyaan yang sering disampaikan</h2>
            <p>
              Detail stok, harga, berat, jadwal kunjungan, dan pengiriman mengikuti kondisi aktual saat Anda menghubungi tim.
            </p>
            <a className="button button-outline" href={stockWhatsappUrl} target="_blank" rel="noreferrer">
              Tanya via WhatsApp
            </a>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details key={faq.q} open={index === 0}>
                <summary><span>{faq.q}</span><span className="faq-plus">+</span></summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section" id="kontak">
        <div className="container cta-band">
          <div>
            <span>Siap bermitra bersama</span>
            <h2>AYT Agro Farm?</h2>
          </div>
          <p>
            Sampaikan kebutuhan breeding, fattening, trading, qurban, aqiqah, atau penawaran ternak Anda.
          </p>
          <a className="button button-whatsapp" href={stockWhatsappUrl} target="_blank" rel="noreferrer">
            <Icon name="whatsapp" size={25} />
            <span><strong>Chat WhatsApp Sekarang</strong><small>0878-8912-4342</small></span>
          </a>
        </div>
      </section>

      <footer>
        <div className="container footer-grid">
          <div className="footer-about">
            <a className="brand footer-brand" href="#home">
              <span className="brand-logo">
                <Image src="/images/ayt-logo-mark.png" alt="Logo AYT Agro Farm" width={58} height={58} />
              </span>
              <span className="brand-text">
                <strong>AYT <em>AGRO FARM</em></strong>
                <small>Breeding • Fattening • Trading</small>
              </span>
            </a>
            <p>
              Mitra usaha kambing dan domba untuk penyediaan bibit, indukan, bakalan,
              penggemukan, serta perdagangan ternak.
            </p>
            <div className="social-links">
              <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram AYT Farm">
                <Icon name="instagram" size={19} />
              </a>
              <a href={stockWhatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp AYT Agro Farm">
                <Icon name="whatsapp" size={19} />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Menu</h3>
            <a href="#tentang">Tentang</a>
            <a href="#layanan">Layanan</a>
            <a href="#kemitraan">Kemitraan</a>
            <a href="#galeri">Galeri</a>
          </div>

          <div className="footer-column">
            <h3>Layanan</h3>
            <a href={stockWhatsappUrl} target="_blank" rel="noreferrer">Breeding</a>
            <a href={stockWhatsappUrl} target="_blank" rel="noreferrer">Fattening</a>
            <a href={offerWhatsappUrl} target="_blank" rel="noreferrer">Trading</a>
          </div>

          <div className="footer-column footer-contact">
            <h3>Kontak</h3>
            <a href={mapsUrl} target="_blank" rel="noreferrer"><Icon name="pin" size={17} /> Dramaga, Kabupaten Bogor</a>
            <a href={stockWhatsappUrl} target="_blank" rel="noreferrer"><Icon name="phone" size={17} /> 0878-8912-4342</a>
            <a href={instagramUrl} target="_blank" rel="noreferrer"><Icon name="instagram" size={17} /> @ayt_farm</a>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} AYT Agro Farm. All rights reserved.</span>
          <span>Jl. Kp. Sukabakti RT.002/RW.006, Desa Sukawening, Dramaga, Bogor</span>
        </div>
      </footer>

      <a
        className={`floating-whatsapp ${menuOpen ? "is-hidden" : ""}`}
        href={stockWhatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Hubungi AYT Agro Farm melalui WhatsApp"
        aria-hidden={menuOpen}
        tabIndex={menuOpen ? -1 : undefined}
      >
        <Icon name="whatsapp" size={25} />
        <span>WhatsApp</span>
      </a>
    </main>
  );
}
