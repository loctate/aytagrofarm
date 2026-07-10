"use client";

import Link from "next/link";
import {
  FocusEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type LayananDropdownProps = {
  onNavigate?: () => void;
};

export default function LayananDropdown({
  onNavigate,
}: LayananDropdownProps) {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openDropdown = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const scheduleCloseDropdown = () => {
    clearCloseTimer();

    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
    }, 180);
  };

  const handleNavigate = () => {
    clearCloseTimer();
    setOpen(false);
    onNavigate?.();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key === "Escape") {
      setOpen(false);

      const trigger =
        dropdownRef.current?.querySelector<HTMLButtonElement>(
          ".layanan-dropdown-button",
        );

      trigger?.focus();
    }
  };

  const handleBlur = (
    event: FocusEvent<HTMLDivElement>,
  ) => {
    const nextFocusedElement =
      event.relatedTarget as Node | null;

    if (
      nextFocusedElement &&
      event.currentTarget.contains(nextFocusedElement)
    ) {
      return;
    }

    scheduleCloseDropdown();
  };

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`layanan-dropdown ${
        open ? "is-open" : ""
      }`}
      onMouseEnter={openDropdown}
      onMouseLeave={scheduleCloseDropdown}
      onFocus={openDropdown}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className="layanan-dropdown-button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="layanan-dropdown-menu"
        onClick={() => {
          clearCloseTimer();
          setOpen((current) => !current);
        }}
      >
        <span>Layanan</span>

        <span
          className="layanan-dropdown-arrow"
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      <div
        id="layanan-dropdown-menu"
        className={`layanan-dropdown-menu ${
          open ? "is-open" : ""
        }`}
        role="menu"
        aria-hidden={!open}
        onMouseEnter={openDropdown}
        onMouseLeave={scheduleCloseDropdown}
      >
        <Link
          href="/produk"
          role="menuitem"
          onClick={handleNavigate}
        >
          <span>Produk</span>
          <small>
            Kambing, domba, dan produk turunannya
          </small>
        </Link>

        <Link
          href="/#pengetahuan"
          role="menuitem"
          onClick={handleNavigate}
        >
          <span>Pengetahuan</span>
          <small>
            Tips dan informasi peternakan
          </small>
        </Link>
      </div>
    </div>
  );
}
