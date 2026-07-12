"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

type LayananDropdownProps = {
  onNavigate?: () => void;
};

export default function LayananDropdown({ onNavigate }: LayananDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopPointer, setIsDesktopPointer] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const menuId = useId();

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const closeDropdown = () => {
    clearCloseTimer();
    setIsOpen(false);
  };

  const handleNavigate = () => {
    closeDropdown();
    onNavigate?.();
  };

  useEffect(() => {
    const desktopPointerQuery = window.matchMedia(
      "(min-width: 901px) and (hover: hover) and (pointer: fine)",
    );

    const updatePointerMode = () => {
      setIsDesktopPointer(desktopPointerQuery.matches);
    };

    updatePointerMode();
    desktopPointerQuery.addEventListener("change", updatePointerMode);

    return () => {
      desktopPointerQuery.removeEventListener("change", updatePointerMode);
    };
  }, []);

  useEffect(() => {
    const handleOutsidePointer = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        rootRef.current &&
        !rootRef.current.contains(target)
      ) {
        closeDropdown();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointer);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
      document.removeEventListener("keydown", handleKeyDown);
      clearCloseTimer();
    };
  }, []);

  const handleMouseEnter = () => {
    if (!isDesktopPointer) {
      return;
    }

    clearCloseTimer();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isDesktopPointer) {
      return;
    }

    clearCloseTimer();

    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
      closeTimerRef.current = null;
    }, 260);
  };

  return (
    <div
      ref={rootRef}
      className={`layanan-dropdown ${isOpen ? "is-open" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className="layanan-dropdown-button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          clearCloseTimer();
          setIsOpen((current) => !current);
        }}
      >
        <span>Layanan</span>

        <span className="layanan-dropdown-arrow" aria-hidden="true">
          ▾
        </span>
      </button>

      <div
        id={menuId}
        className={`layanan-dropdown-menu ${isOpen ? "is-open" : ""}`}
        aria-hidden={!isOpen}
      >
        <Link href="/produk" onClick={handleNavigate}>
          <span>Produk</span>
          <small>Kambing, domba, dan produk turunannya</small>
        </Link>

        <Link href="/#pengetahuan" onClick={handleNavigate}>
          <span>Pengetahuan</span>
          <small>Tips praktis peternakan kambing dan domba</small>
        </Link>
      </div>
    </div>
  );
}
