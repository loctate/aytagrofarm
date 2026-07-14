import Image from "next/image";
import Link from "next/link";

type PublicBrandProps = {
  href?: string;
};

export default function PublicBrand({
  href = "/",
}: PublicBrandProps) {
  return (
    <Link
      className="brand public-brand"
      href={href}
      aria-label="AYT Agro Farm"
    >
      <span className="public-brand-logos" aria-hidden="true">
        <Image
          className="public-brand-logo public-brand-logo-hpdki"
          src="/images/hpdki-pac-logo.png"
          alt=""
          width={88}
          height={46}
          priority
        />

        <Image
          className="public-brand-logo public-brand-logo-ayt"
          src="/images/ayt-logo-2026.png"
          alt=""
          width={48}
          height={48}
          priority
        />
      </span>

      <span className="brand-text">
        <strong>AYT AGRO FARM</strong>

        <small className="brand-services">
          <span>BREEDING, FATTENING, TRADING</span>
          <span>HILIR, FROZEN, PENYEMBELIHAN</span>
        </small>
      </span>
    </Link>
  );
}
