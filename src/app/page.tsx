"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import PublicBrand from "@/components/PublicBrand";

const whatsappNumber = "6287889124342";
const instagramUrl = "https://www.instagram.com/ayt_farm/";
const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Jl.%20Kp.%20Sukabakti%20RT.002%20RW.006%20Desa%20Sukawening%20Dramaga%20Bogor";

const whatsappUrl = (message: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

const livestockWhatsappUrl = whatsappUrl(
  "Halo AYT Agro Farm, saya sedang mencari kambing atau domba. Mohon bantu informasikan ternak yang sesuai dengan kebutuhan saya."
);

const consultationWhatsappUrl = whatsappUrl(
  "Halo AYT Agro Farm, saya ingin berkonsultasi mengenai kebutuhan kambing atau domba."
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
  | "check"
  | "instagram"
  | "whatsapp"
  | "menu"
  | "close"
  | "camera"
  | "building"
  | "users"
  | "book"
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
        <circle
          cx="17.5"
          cy="6.5"
          r=".7"
          fill="currentColor"
          stroke="none"
        />
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
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </>
    ),
    chevronLeft: <path d="m15 18-6-6 6-6" />,
    chevronRight: <path d="m9 18 6-6-6-6" />,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

const livestockNeeds = [
  {
    number: "01",
    icon: "breeding" as const,
    title: "Bibit & Indukan",
    text: "Membantu mencarikan bibit, indukan, maupun pejantan kambing dan domba sesuai kebutuhan peternakan.",
    link: whatsappUrl(
      "Halo AYT Agro Farm, saya sedang mencari bibit, indukan, atau pejantan kambing dan domba."
    ),
  },
  {
    number: "02",
    icon: "fattening" as const,
    title: "Bakalan Penggemukan",
    text: "Membantu kebutuhan bakalan kambing dan domba berdasarkan jenis, usia, bobot, jumlah, dan anggaran.",
    link: whatsappUrl(
      "Halo AYT Agro Farm, saya sedang mencari bakalan kambing atau domba untuk kebutuhan penggemukan."
    ),
  },
  {
    number: "03",
    icon: "trading" as const,
    title: "Berbagai Kebutuhan",
    text: "Melayani kebutuhan ternak satuan maupun partai untuk usaha, perdagangan, aqiqah, kurban, dan lainnya.",
    link: livestockWhatsappUrl,
  },
];

const benefits = [
  {
    icon: "shield" as const,
    title: "Kebutuhan Terarah",
    text: "Pencarian ternak disesuaikan dengan jenis, jumlah, bobot, tujuan pemeliharaan, dan anggaran.",
  },
  {
    icon: "leaf" as const,
    title: "Pengetahuan Praktis",
    text: "Berbagi tips sederhana mengenai breeding, fattening, pakan, kesehatan, dan perawatan ternak.",
  },
  {
    icon: "handshake" as const,
    title: "Komunikasi Terbuka",
    text: "Informasi mengenai kondisi, ketersediaan, harga, lokasi, dan proses transaksi dibicarakan dengan jelas.",
  },
  {
    icon: "pin" as const,
    title: "Berbasis di Bogor",
    text: "Melayani kebutuhan peternak, masyarakat, dan pelaku usaha di Bogor, Jabodetabek, dan sekitarnya.",
  },
];

const knowledgePosts = [
  {
    image: "/images/gallery-ternak.jpg",
    category: "Tips Peternakan",
    title: "Tips Memilih Kambing dan Domba yang Sehat",
    summary:
      "Kenali kondisi fisik, aktivitas, nafsu makan, mata, bulu, kaki, dan pernapasan sebelum memilih ternak.",
  },
  {
    image: "/images/gallery-pakan.jpg",
    category: "Fattening",
    title: "Hal Penting Saat Memilih Bakalan Penggemukan",
    summary:
      "Pemilihan bakalan yang tepat membantu proses penggemukan berjalan lebih terarah dan sesuai target usaha.",
  },
  {
    image: "/images/gallery-kandang.jpg",
    category: "Perawatan",
    title: "Menjaga Kandang Tetap Bersih dan Nyaman",
    summary:
      "Kebersihan, sirkulasi udara, tempat pakan, dan kepadatan ternak perlu diperhatikan secara rutin.",
  },
];

const galleryItems = [
  {
    src: "/images/gallery-ternak.jpg",
    title: "Kambing & Domba",
    text: "Penyediaan ternak disesuaikan dengan kebutuhan pembeli dan kondisi ketersediaan.",
  },
  {
    src: "/images/gallery-lahan.jpg",
    title: "Lingkungan Peternakan",
    text: "Lingkungan peternakan menjadi bagian penting dalam aktivitas dan pemeliharaan ternak.",
  },
  {
    src: "/images/gallery-kandang.jpg",
    title: "Kandang & Perawatan",
    text: "Kandang digunakan sebagai pusat perawatan, pemantauan, dan aktivitas ternak.",
  },
  {
    src: "/images/gallery-pakan.jpg",
    title: "Pakan Ternak",
    text: "Pemberian pakan disesuaikan dengan kondisi dan tahap pemeliharaan kambing atau domba.",
  },
];

type HpdkiSlide = {
  label: string;
  title: string;
  text: string;
  points?: string[];
};

const hpdkiSlides: HpdkiSlide[] = [
  {
    label: "Tentang PAC HPDKI",
    title: "Wadah Peternak Domba & Kambing Kecamatan Dramaga",
    text: "PAC HPDKI Kecamatan Dramaga Kabupaten Bogor menjadi wadah bagi peternak domba dan kambing untuk meningkatkan pengetahuan, membangun jaringan, memperkuat usaha, dan berkembang bersama.",
    points: [
      "Komunitas peternak domba dan kambing",
      "Pengembangan pengetahuan peternakan",
      "Penguatan jaringan dan kolaborasi",
      "Dukungan bagi usaha peternakan rakyat",
    ],
  },
  {
    label: "Visi Organisasi",
    title: "Peternak Mandiri, Profesional, dan Berdaya Saing",
    text: "Menjadi organisasi peternak domba kambing yang mandiri, profesional, dan berdaya saing tinggi dalam mewujudkan kesejahteraan peternak serta kemandirian pangan berbasis potensi lokal Kecamatan KP Jl. Sukabakti, RT.002/RW.006, Sukawening, Kec. KP Jl. Sukabakti, RT.002/RW.006, Sukawening, Kec. Dramaga, Kabupaten Bogor.",
  },
  {
    label: "Pengembangan Peternak",
    title: "Meningkatkan Kapasitas dan Kompetensi",
    text: "Meningkatkan kemampuan peternak melalui pendidikan, pelatihan, dan pendampingan yang memanfaatkan teknologi serta inovasi peternakan.",
    points: [
      "Pendidikan peternakan",
      "Pelatihan praktis",
      "Pendampingan peternak",
      "Teknologi dan inovasi",
    ],
  },
  {
    label: "Jejaring Strategis",
    title: "Membangun Ekosistem Peternakan yang Kuat",
    text: "Membangun kemitraan strategis bersama pemerintah, swasta, akademisi, dan komunitas untuk memperkuat ekosistem peternakan rakyat.",
    points: [
      "Kolaborasi dengan pemerintah",
      "Kemitraan pelaku usaha",
      "Dukungan akademisi",
      "Jaringan komunitas peternak",
    ],
  },
  {
    label: "Kemandirian Ekonomi",
    title: "Memperkuat Usaha Peternak",
    text: "Mendorong kemandirian ekonomi peternak melalui akses pasar, pembiayaan, sarana produksi, dan kelembagaan usaha yang transparan serta berkelanjutan.",
    points: [
      "Memperluas akses pasar",
      "Informasi peluang pembiayaan",
      "Dukungan sarana produksi",
      "Penguatan kelembagaan usaha",
    ],
  },
  {
    label: "Peternakan Berkelanjutan",
    title: "Tumbuh Bersama Potensi Lokal",
    text: "Mengembangkan sistem peternakan yang terintegrasi dan ramah lingkungan, sekaligus memperkuat solidaritas serta kekuatan kolektif peternak Kecamatan Dramaga.",
    points: [
      "Ramah lingkungan",
      "Berbasis potensi lokal",
      "Solidaritas antarpeternak",
      "Perlindungan usaha peternakan rakyat",
    ],
  },
  {
    label: "Pendaftaran Anggota Peternak",
    title: "Bergabung Menjadi Anggota Peternak PAC HPDKI",
    text: "Bergabunglah dengan jaringan peternak domba dan kambing Kecamatan KP Jl. Sukabakti, RT.002/RW.006, Sukawening, Kec. Dramaga, Kabupaten Bogor untuk memperoleh informasi, memperluas jaringan, dan membuka peluang kolaborasi.",
    points: [
      "Informasi kegiatan dan pelatihan",
      "Jaringan sesama peternak",
      "Peluang kolaborasi usaha",
      "Penguatan komunitas peternakan",
    ],
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHpdkiSlide, setActiveHpdkiSlide] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveHpdkiSlide(
        (current) => (current + 1) % hpdkiSlides.length
      );
    }, 8000);

    return () => window.clearInterval(interval);
  }, []);

  const scrollGallery = (direction: "left" | "right") => {
    galleryRef.current?.scrollBy({
      left: direction === "right" ? 340 : -340,
      behavior: "smooth",
    });
  };

  const showPreviousHpdkiSlide = () => {
    setActiveHpdkiSlide(
      (current) =>
        (current - 1 + hpdkiSlides.length) % hpdkiSlides.length
    );
  };

  const showNextHpdkiSlide = () => {
    setActiveHpdkiSlide(
      (current) => (current + 1) % hpdkiSlides.length
    );
  };

  const currentHpdkiSlide = hpdkiSlides[activeHpdkiSlide];

  return (
    <main>
      <header className="site-header">
        <div className="container nav-shell">
          <PublicBrand href="#home" />

          <nav
            id="primary-navigation"
            className={`nav-links ${menuOpen ? "is-open" : ""}`}
            aria-label="Navigasi utama"
          >
            <a href="#tentang" onClick={() => setMenuOpen(false)}>
              Tentang
            </a>
            <a href="#pengetahuan" onClick={() => setMenuOpen(false)}>
              Pengetahuan
            </a>
            <a
              className="nav-hpdki-link"
              href="/hpdki"
              onClick={() => setMenuOpen(false)}
            >
              <span>PAC HPDKI</span>
              <span>KECAMATAN DRAMAGA</span>
            </a>
            <a href="#galeri" onClick={() => setMenuOpen(false)}>
              Galeri
            </a>
            <a href="#kontak" onClick={() => setMenuOpen(false)}>
              Kontak
            </a>
            <a
              className="nav-cta"
              href={livestockWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              Cari Kambing & Domba
            </a>
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
            <div className="eyebrow">
              <Icon name="leaf" size={15} />
              Penyedia Kambing &amp; Domba
            </div>

            <h1>
              Temukan Kambing &amp; Domba
              <em>Sesuai Kebutuhan Anda</em>
            </h1>

            <p>
              AYT Agro Farm membantu menyediakan kambing dan domba untuk
              kebutuhan pembibitan, penggemukan, perdagangan, aqiqah, kurban,
              maupun kebutuhan lainnya.
            </p>

            <div className="hero-actions">
              <a
                className="button button-primary"
                href={livestockWhatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="whatsapp" size={20} />
                Cari Kambing & Domba
                <Icon name="arrow" size={18} />
              </a>

              <a
                className="button button-outline"
                href={consultationWhatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                Konsultasi via WhatsApp
              </a>
            </div>

            <div className="trust-strip" aria-label="Informasi layanan">
              <div>
                <span className="trust-icon">
                  <Icon name="pin" />
                </span>
                <span>
                  <strong>Bogor</strong>
                  <small>Basis operasional</small>
                </span>
              </div>

              <div>
                <span className="trust-icon">
                  <Icon name="building" />
                </span>
                <span>
                  <strong>Jabodetabek</strong>
                  <small>Area pelayanan</small>
                </span>
              </div>

              <div>
                <span className="trust-icon">
                  <Icon name="users" />
                </span>
                <span>
                  <strong>Satuan &amp; Partai</strong>
                  <small>Berbagai kebutuhan</small>
                </span>
              </div>
            </div>
          </div>

          <div className="hero-media">
            <div className="hero-image-frame">
              <Image
                src="/images/hero-ayt-agro-farm.jpg"
                alt="AYT Agro Farm dengan kandang, kambing, dan domba"
                fill
                priority
                sizes="(max-width: 980px) 100vw, 56vw"
              />
              <div className="hero-image-shade" />
            </div>
          </div>
        </div>
      </section>

      <section className="service-overlap" aria-label="Kebutuhan ternak">
        <div className="container service-grid">
          {livestockNeeds.map((item) => (
            <article className="service-card" key={item.title}>
              <div className="service-head">
                <span className="service-icon">
                  <Icon name={item.icon} />
                </span>
                <span className="service-number">{item.number}</span>
              </div>

              <h2>{item.title}</h2>
              <p>{item.text}</p>

              <a href={item.link} target="_blank" rel="noreferrer">
                Tanya via WhatsApp
                <Icon name="arrow" size={16} />
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
            <span className="section-kicker">
              <Icon name="leaf" size={15} />
              Tentang kami
            </span>

            <h2>
              Mengapa <em>AYT Agro Farm?</em>
            </h2>

            <p>
              AYT Agro Farm menjadi wadah untuk membantu masyarakat, peternak,
              dan pelaku usaha menemukan kambing atau domba berdasarkan
              kebutuhan yang disampaikan.
            </p>
          </div>

          <div className="benefit-grid">
            {benefits.map((benefit) => (
              <article key={benefit.title}>
                <span className="benefit-icon">
                  <Icon name={benefit.icon} size={30} />
                </span>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="knowledge section" id="pengetahuan">
        <div className="container">
          <div className="knowledge-heading">
            <div className="section-heading">
              <span className="section-kicker">
                <Icon name="book" size={16} />
                Pengetahuan peternakan
              </span>

              <h2>
                Tips Praktis untuk <em>Peternak</em>
              </h2>

              <p>
                Informasi sederhana mengenai pemilihan ternak, breeding,
                fattening, pakan, kandang, kesehatan, dan perawatan kambing
                serta domba.
              </p>
            </div>

            <span className="knowledge-note">
              Artikel terbaru akan diperbarui melalui dashboard admin.
            </span>
          </div>

          <div className="knowledge-grid">
            {knowledgePosts.map((post) => (
              <article className="knowledge-card" key={post.title}>
                <div className="knowledge-image">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 760px) 100vw, 33vw"
                  />
                </div>

                <div className="knowledge-content">
                  <span className="knowledge-category">{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.summary}</p>
                  <span className="knowledge-coming">
                    Artikel lengkap segera tersedia
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery section" id="galeri">
        <div className="container">
          <div className="gallery-title-row">
            <div className="section-heading">
              <span className="section-kicker">
                <Icon name="camera" size={16} />
                Dokumentasi
              </span>

              <h2>Galeri &amp; Aktivitas</h2>

              <p>
                Dokumentasi kegiatan, lingkungan peternakan, ternak, kandang,
                pakan, dan aktivitas AYT Agro Farm.
              </p>
            </div>

            <div className="gallery-controls" aria-label="Kontrol galeri">
              <button
                type="button"
                onClick={() => scrollGallery("left")}
                aria-label="Geser galeri ke kiri"
              >
                <Icon name="chevronLeft" />
              </button>

              <button
                type="button"
                onClick={() => scrollGallery("right")}
                aria-label="Geser galeri ke kanan"
              >
                <Icon name="chevronRight" />
              </button>
            </div>
          </div>

          <div className="gallery-track" ref={galleryRef}>
            {galleryItems.map((item) => (
              <article className="gallery-card" key={item.title}>
                <div className="gallery-image">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 700px) 100vw, 320px"
                  />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="hpdki-section section"
        id="hpdki"
        aria-label="Informasi HPDKI"
      >
        <div className="container hpdki-shell">
          <div className="hpdki-heading hpdki-heading-compact hpdki-heading-with-logo">
            <h2 className="hpdki-section-title">
              PAC HPDKI KECAMATAN DRAMAGA KAB. BOGOR
            </h2>

            <div className="hpdki-identity-logo">
              <Image
                src="/images/hpdki-pac-logo.png"
                alt="Logo Himpunan Peternak Domba Kambing Indonesia PAC Dramaga"
                width={160}
                height={160}
                sizes="(max-width: 560px) 68px, (max-width: 900px) 104px, 144px"
                className="hpdki-identity-logo-image"
              />
            </div>
          </div>

          <div className="hpdki-carousel" aria-live="polite">
<article className="hpdki-slide" key={activeHpdkiSlide}>
              <span className="hpdki-label">{currentHpdkiSlide.label}</span>
              <h3>{currentHpdkiSlide.title}</h3>
              <p>{currentHpdkiSlide.text}</p>

              {currentHpdkiSlide.points && (
                <ul className="hpdki-points">
                  {currentHpdkiSlide.points.map((point) => (
                    <li key={point}>
                      <Icon name="check" size={18} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </div>

          <div className="hpdki-static-cta">
            <a
              className="button button-primary"
              href="/hpdki/daftar"
            >
              Daftar Anggota Peternak PAC HPDKI KEC. DRAMAGA
              <Icon name="arrow" size={18} />
            </a>
          </div>

          <div className="hpdki-navigation">
            <div className="hpdki-dots" aria-label="Pilih slide HPDKI">
              {hpdkiSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  className={index === activeHpdkiSlide ? "is-active" : ""}
                  onClick={() => setActiveHpdkiSlide(index)}
                  aria-label={`Tampilkan slide ${index + 1}: ${slide.title}`}
                  aria-current={
                    index === activeHpdkiSlide ? "true" : undefined
                  }
                />
              ))}
            </div>

            <div className="hpdki-arrows">
              <button
                type="button"
                onClick={showPreviousHpdkiSlide}
                aria-label="Slide HPDKI sebelumnya"
              >
                <Icon name="chevronLeft" />
              </button>

              <button
                type="button"
                onClick={showNextHpdkiSlide}
                aria-label="Slide HPDKI berikutnya"
              >
                <Icon name="chevronRight" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section" id="kontak">
        <div className="container cta-band">
          <div>
            <span>Butuh kambing atau domba?</span>
            <h2>Hubungi AYT Agro Farm</h2>
          </div>

          <p>
            Sampaikan jenis ternak, jumlah, tujuan, kisaran bobot, lokasi, dan
            anggaran yang Anda butuhkan.
          </p>

          <a
            className="button button-whatsapp"
            href={livestockWhatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="whatsapp" size={25} />
            <span>
              <strong>Chat WhatsApp Sekarang</strong>
              <small>0878-8912-4342</small>
            </span>
          </a>
        </div>
      </section>

      <footer>
        <div className="container footer-grid">
          <div className="footer-about">
            <a className="brand footer-brand" href="#home">
              <span className="brand-logo">
                <Image
                  src="/images/ayt-logo-2026.png"
                  alt="Logo CV. AYT Agro Farm"
                  width={58}
                  height={58}
                />
              </span>

              <span className="brand-text">
                <strong>
                  AYT <em>AGRO FARM</em>
                </strong>
                <small className="brand-services">
                <span>BREEDING, FATTENING, TRADING</span>
                <span>HILIR, FROZEN, PENYEMBELIHAN</span>
              </small>
              </span>
            </a>

            <p>
              Wadah penyediaan kambing dan domba sesuai kebutuhan, didukung
              informasi praktis seputar peternakan.
            </p>

            <div className="social-links">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram AYT Agro Farm"
              >
                <Icon name="instagram" size={19} />
              </a>

              <a
                href={livestockWhatsappUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp AYT Agro Farm"
              >
                <Icon name="whatsapp" size={19} />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Menu</h3>
            <a href="#tentang">Tentang</a>
            <a href="#pengetahuan">Pengetahuan</a>
            <a href="/hpdki">
              PAC HPDKI KECAMATAN DRAMAGA
            </a>
            <a href="#galeri">Galeri</a>
            <a href="#kontak">Kontak</a>
          </div>

          <div className="footer-column">
            <h3>Akses Cepat</h3>
            <a
              href={livestockWhatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              Cari Kambing & Domba
            </a>
            <a href="#pengetahuan">Tips Peternakan</a>
            <a href="/hpdki/daftar">Pendaftaran HPDKI</a>
          </div>

          <div className="footer-column footer-contact">
            <h3>Kontak</h3>

            <a href={mapsUrl} target="_blank" rel="noreferrer">
              <Icon name="pin" size={17} />
              KP Jl. Sukabakti, RT.002/RW.006, Sukawening, Kec. Dramaga, Kabupaten Bogor
            </a>

            <a
              href={livestockWhatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="phone" size={17} />
              0878-8912-4342
            </a>

            <a href={instagramUrl} target="_blank" rel="noreferrer">
              <Icon name="instagram" size={17} />
              @ayt_farm
            </a>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} AYT Agro Farm. All rights reserved.
          </span>

          <span>
            Jl. Kp. Sukabakti RT.002/RW.006, Desa Sukawening, Dramaga, Bogor
          </span>
        </div>
        </footer>

      <a
        className={`floating-whatsapp ${menuOpen ? "is-hidden" : ""}`}
        href={livestockWhatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Cari kambing atau domba melalui WhatsApp"
        aria-hidden={menuOpen}
        tabIndex={menuOpen ? -1 : undefined}
      >
        <Icon name="whatsapp" size={25} />
        <span>WhatsApp</span>
      </a>
    </main>
  );
}
