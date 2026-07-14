"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getProductImageUrl,
  listPublicProducts,
  type ProductRecord,
} from "@/lib/appwrite/products";

import {
  AYT_WHATSAPP_NUMBER,
  buildProductWhatsappUrl,
  formatProductPrice,
  getProductCategoryLabel,
  getProductStockStatusLabel,
  productCategoryOptions,
  type ProductCategory,
  type ProductStockStatus,
} from "@/lib/products/catalog";

type ProductFilter =
  | "all"
  | ProductCategory;

const generalWhatsappUrl =
  `https://wa.me/${AYT_WHATSAPP_NUMBER}` +
  `?text=${encodeURIComponent(
    "Halo AYT Agro Farm, saya ingin bertanya tentang produk turunan kambing dan domba yang tersedia.",
  )}`;

function WhatsappIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M20.52 3.48A11.78 11.78 0 0 0 12.08 0C5.52 0 .18 5.34.18 11.9c0 2.1.55 4.15 1.6 5.96L.08 24l6.3-1.65a11.9 11.9 0 0 0 5.69 1.45h.01C18.64 23.8 24 18.46 24 11.9c0-3.18-1.24-6.17-3.48-8.42ZM12.08 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.64-.24-.37a9.86 9.86 0 0 1-1.52-5.28C2.17 6.45 6.62 2 12.08 2a9.83 9.83 0 0 1 7 2.9 9.83 9.83 0 0 1 2.9 7c0 5.46-4.45 9.9-9.9 9.9Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47a8.96 8.96 0 0 1-1.65-2.05c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"
      />
    </svg>
  );
}

function CatalogIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M4 3h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1h-6a2 2 0 0 0-2 2 2 2 0 0 0-2-2H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v13h5c.35 0 .69.06 1 .17V6a1 1 0 0 0-1-1H5Zm9 0a1 1 0 0 0-1 1v12.17c.31-.11.65-.17 1-.17h5V5h-5Z"
      />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 2a9 9 0 0 0-9 9v5a3 3 0 0 0 3 3h2v-8H5a7 7 0 0 1 14 0h-3v8h2.17A3 3 0 0 1 16 21h-3v2h3a5 5 0 0 0 5-5v-7a9 9 0 0 0-9-9ZM5 13h1v4H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Zm13 0h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1v-4Z"
      />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M20.7 3.3C15.6 3 10.8 4.4 8 7.2 5.9 9.3 5 12 5.2 14.5c-1.3.8-2.4 1.9-3.2 3.2l1.7 1c.7-1.1 1.6-2 2.7-2.7 2.4.3 5-.5 7.1-2.6 2.9-2.9 4.3-7.8 4-12.9l3.2 2.8ZM7.4 13.8c.1-1.9.9-3.8 2.3-5.2 1.8-1.8 4.5-2.9 7.5-3.2-1.5 1.1-3.1 2.3-4.6 3.7-1.9 1.7-3.6 3.4-5.2 4.7Z"
      />
    </svg>
  );
}

function getStockClassName(
  status: ProductStockStatus,
) {
  return [
    "locked-product-stock",
    `locked-product-stock-${status}`,
  ].join(" ");
}

function LoadingCatalog() {
  return (
    <div className="locked-products-grid">
      {[1, 2, 3, 4, 5, 6].map(
        (item) => (
          <article
            key={item}
            className="locked-product-card locked-product-loading"
          >
            <div className="locked-product-loading-image" />

            <div className="locked-product-loading-content">
              <span />
              <strong />
              <p />
              <p />
              <button type="button" disabled />
            </div>
          </article>
        ),
      )}
    </div>
  );
}

export default function PublicProductsCatalog() {
  const [products, setProducts] =
    useState<ProductRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [activeCategory, setActiveCategory] =
    useState<ProductFilter>("all");

  useEffect(() => {
    let active = true;

    async function initializeCatalog() {
      const rows = await listPublicProducts();

      if (!active) {
        return;
      }

      setProducts(rows);
      setLoading(false);
    }

    void initializeCatalog();

    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") {
      return products;
    }

    return products.filter(
      (product) =>
        product.category === activeCategory,
    );
  }, [activeCategory, products]);

  return (
    <main className="locked-products-page">
      <header className="locked-products-header">
        <div className="locked-products-header-inner">
          <Link
            href="/"
            className="locked-products-brand"
            aria-label="Kembali ke halaman utama AYT Agro Farm"
          >
            <div className="locked-products-brand-logos">
              <Image
                className="locked-products-brand-logo-ayt"
                src="/images/ayt-logo-2026.png"
                alt="Logo AYT Agro Farm"
                width={58}
                height={58}
                priority
              />

              <Image
                className="locked-products-brand-logo-hpdki"
                src="/images/hpdki-pac-logo.png"
                alt="Logo PAC HPDKI Kecamatan Dramaga"
                width={96}
                height={51}
                priority
              />
            </div>

            <span className="locked-products-brand-copy">
              <strong>AYT AGRO FARM</strong>

              <small>
                Breeding, Fattening, Trading,
                Hilir, Frozen, Penyembelihan
              </small>
            </span>
          </Link>
        </div>
      </header>

      <section className="locked-products-hero">
        <div className="locked-products-hero-background">
          <Image
            src="/images/ayt-hero-natural-farm.png"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>

        <div className="locked-products-hero-overlay" />

        <div className="locked-products-hero-content">
          <p className="locked-products-eyebrow">
            <LeafIcon />
            <span>
              Produk Turunan AYT Agro Farm
            </span>
          </p>

          <h1>
            Produk Turunan
            <br />
            Kambing &amp; Domba
          </h1>

          <p className="locked-products-hero-description">
            Berbagai produk turunan kambing dan
            domba pilihan dengan harga eceran
            pasar.
            <br />
            Untuk informasi lebih lanjut,
            ketersediaan, dan pemesanan, silakan
            hubungi admin kami via WhatsApp.
          </p>

          <div className="locked-products-hero-actions">
            <a
              href={generalWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="locked-products-primary-button"
            >
              <WhatsappIcon />
              <span>Tanya via WhatsApp</span>
            </a>

            <a
              href="#katalog-produk"
              className="locked-products-secondary-button"
            >
              <CatalogIcon />
              <span>Lihat Katalog</span>
            </a>
          </div>
        </div>
      </section>

      <section
        id="katalog-produk"
        className="locked-products-catalog"
      >
        <div
          className="locked-products-filters"
          aria-label="Filter kategori produk"
        >
          <button
            type="button"
            className={
              activeCategory === "all"
                ? "is-active"
                : ""
            }
            aria-pressed={
              activeCategory === "all"
            }
            onClick={() =>
              setActiveCategory("all")
            }
          >
            Semua
          </button>

          {productCategoryOptions.map(
            (category) => (
              <button
                key={category.value}
                type="button"
                className={
                  activeCategory ===
                  category.value
                    ? "is-active"
                    : ""
                }
                aria-pressed={
                  activeCategory ===
                  category.value
                }
                onClick={() =>
                  setActiveCategory(
                    category.value,
                  )
                }
              >
                {category.label}
              </button>
            ),
          )}
        </div>

        {loading ? (
          <LoadingCatalog />
        ) : filteredProducts.length > 0 ? (
          <div className="locked-products-grid">
            {filteredProducts.map(
              (product) => {
                const imageUrl =
                  getProductImageUrl(
                    product.image_file_id,
                  );

                return (
                  <article
                    key={product.$id}
                    className="locked-product-card"
                  >
                    <div className="locked-product-image">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          unoptimized
                          sizes="(max-width: 680px) 100vw, (max-width: 1050px) 45vw, 190px"
                        />
                      ) : (
                        <span>
                          Foto produk belum
                          tersedia
                        </span>
                      )}
                    </div>

                    <div className="locked-product-content">
                      <span className="locked-product-category">
                        {getProductCategoryLabel(
                          product.category,
                        )}
                      </span>

                      <h2>{product.name}</h2>

                      <p>
                        {
                          product.short_description
                        }
                      </p>

                      <strong className="locked-product-price">
                        {formatProductPrice(
                          product,
                        )}
                      </strong>

                      <span
                        className={getStockClassName(
                          product.stock_status,
                        )}
                      >
                        {getProductStockStatusLabel(
                          product.stock_status,
                        )}
                      </span>

                      <a
                        href={buildProductWhatsappUrl(
                          product,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="locked-product-whatsapp"
                      >
                        <WhatsappIcon />
                        <span>
                          Tanya via WhatsApp
                        </span>
                      </a>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        ) : (
          <div className="locked-products-empty">
            <h2>
              Produk pada kategori ini belum
              tersedia
            </h2>

            <p>
              Hubungi admin AYT Agro Farm untuk
              menanyakan produk dan ketersediaan
              terbaru.
            </p>

            <a
              href={generalWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsappIcon />
              <span>Hubungi via WhatsApp</span>
            </a>
          </div>
        )}

        <section className="locked-products-bottom-cta">
          <div className="locked-products-cta-icon">
            <HeadsetIcon />
          </div>

          <div>
            <h2>
              Belum menemukan produk yang dicari?
            </h2>

            <p>
              Hubungi admin AYT Agro Farm untuk
              kebutuhan khusus.
            </p>
          </div>

          <a
            href={generalWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="locked-products-footer-whatsapp"
          >
            <WhatsappIcon />
            <span>Hubungi via WhatsApp</span>
          </a>
        </section>
      </section>
    </main>
  );
}
