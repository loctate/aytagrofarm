"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentAdmin,
  loginAdmin,
} from "@/lib/appwrite/auth";

export default function AdminLoginPage() {
  const router = useRouter();

  const [checkingSession, setCheckingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    getCurrentAdmin()
      .then(() => {
        if (active) {
          router.replace("/admin");
        }
      })
      .catch(() => {
        if (active) {
          setCheckingSession(false);
        }
      });

    return () => {
      active = false;
    };
  }, [router]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setErrorMessage("");
    setSubmitting(true);

    try {
      await loginAdmin(email, password);
      router.replace("/admin");
    } catch {

      setErrorMessage(
        "Email atau password tidak sesuai. Silakan periksa dan coba kembali."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingSession) {
    return (
      <main className="admin-auth-loading">
        <span className="admin-auth-spinner" />
        <p>Memeriksa sesi admin...</p>
      </main>
    );
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Link
          className="admin-login-brand"
          href="/"
          aria-label="Kembali ke AYT Agro Farm"
        >
          <Image
            src="/images/ayt-logo-2026.png"
            alt="Logo CV. AYT Agro Farm"
            width={64}
            height={64}
            priority
          />
          <span className="admin-hpdki-brand-logo" aria-label="Logo HPDKI PAC Dramaga">
            <Image
              src="/images/hpdki-pac-logo.png"
              alt="Logo Himpunan Peternak Domba Kambing Indonesia PAC Dramaga"
              width={96}
              height={96}
              sizes="(max-width: 640px) 44px, 56px"
              className="admin-hpdki-brand-logo-image"
            />
          </span>

          <span>
            <strong>AYT Agro Farm</strong>
            <small>Dashboard Admin</small>
          </span>
        </Link>

        <div className="admin-login-heading">
          <span>Akses Pengelola</span>
          <h1>Login Admin</h1>
          <p>
            Masukkan akun admin untuk mengelola pendaftaran
            anggota HPDKI dan data website.
          </p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label>
            <span>Email admin</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="admin@example.com"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Masukkan password"
              minLength={8}
              required
            />
          </label>

          {errorMessage && (
            <div className="admin-login-error" role="alert">
              {errorMessage}
            </div>
          )}

          <button type="submit" disabled={submitting}>
            {submitting ? "Memproses Login..." : "Masuk ke Dashboard"}
          </button>
        </form>

        <Link className="admin-login-back" href="/">
          ← Kembali ke website
        </Link>
      </section>
    </main>
  );
}
