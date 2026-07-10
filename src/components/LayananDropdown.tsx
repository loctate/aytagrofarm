"use client";

import Link from "next/link";
import { useState } from "react";

type LayananDropdownProps = {
  onNavigate?: () => void;
};

export default function LayananDropdown({ onNavigate }: LayananDropdownProps) {
  const [open, setOpen] = useState(false);

  const handleNavigate = () => {
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div
      className="layanan-dropdown"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="layanan-dropdown-button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        Layanan
        <span aria-hidden="true">▾</span>
      </button>

      <div className={`layanan-dropdown-menu ${open ? "is-open" : ""}`}>
        <Link href="/produk" onClick={handleNavigate}>
          Produk
        </Link>

        <Link href="/#pengetahuan" onClick={handleNavigate}>
          Pengetahuan
        </Link>
      </div>
    </div>
  );
}
