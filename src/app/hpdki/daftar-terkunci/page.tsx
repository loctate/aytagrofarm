import { redirect } from "next/navigation";

export const metadata = {
  title: "Pendaftaran Anggota HPDKI | AYT Agro Farm",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HpdkiRegistrationLockedPage() {
  redirect("/hpdki/daftar");
}
