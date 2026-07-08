import Link from "next/link";

export const metadata = {
  title: "Pendaftaran HPDKI Belum Dibuka | AYT Agro Farm",
  description:
    "Pendaftaran anggota PAC HPDKI Kecamatan Dramaga untuk sementara belum dibuka.",
};

export default function HpdkiRegistrationLockedPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-16 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-amber-200 bg-white p-6 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl">
          🔒
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
          Pendaftaran Belum Dibuka
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Pendaftaran Anggota HPDKI Untuk Sementara Dikunci
        </h1>

        <p className="mt-5 text-base leading-8 text-slate-700">
          Saat ini sistem pendaftaran anggota PAC HPDKI Kecamatan Dramaga
          sedang dalam tahap persiapan data production dan serah terima kepada
          pengelola. Form pendaftaran akan dibuka kembali setelah proses ini
          selesai.
        </p>

        <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-left text-sm leading-7 text-amber-900">
          <p className="font-semibold">Catatan:</p>
          <p className="mt-1">
            Data anggota production masih dikosongkan terlebih dahulu untuk
            menghindari salah input sebelum proses serah terima resmi.
          </p>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/hpdki"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Kembali ke Halaman HPDKI
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </section>
    </main>
  );
}
