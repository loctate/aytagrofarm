import Image from "next/image";
import Link from "next/link";

const memberNumberExample = "HPDKI-PAC-DRAMAGA-2026-001";

const programs = [
  {
    title: "Pendataan & Keanggotaan",
    text: "Membangun data anggota peternak domba dan kambing Kecamatan Dramaga secara lebih rapi, terverifikasi, dan mudah dikelola.",
  },
  {
    title: "Peningkatan Kapasitas Peternak",
    text: "Mendorong pelatihan, pendampingan, dan berbagi pengetahuan praktis seputar breeding, fattening, pakan, kandang, dan kesehatan ternak.",
  },
  {
    title: "Kolaborasi & Kemitraan",
    text: "Membuka ruang kerja sama dengan pemerintah, pelaku usaha, akademisi, komunitas, dan pihak lain yang mendukung kemajuan peternak.",
  },
  {
    title: "Penguatan Usaha Peternakan",
    text: "Mendukung peternak dalam akses informasi pasar, pengembangan usaha, dan penguatan jejaring antaranggota.",
  },
];

const profileStats = [
  { value: "PAC", label: "Tingkat Organisasi" },
  { value: "Dramaga", label: "Wilayah Kecamatan" },
  { value: "Bogor", label: "Kabupaten" },
  { value: "2026", label: "Format Penomoran" },
];

export default function HpdkiProfilePage() {
  return (
    <main className="hpdki-profile-page">
      <section className="hpdki-profile-hero">
        <div className="container hpdki-profile-hero-grid">
          <div className="hpdki-profile-hero-content">
            <Link href="/" className="hpdki-profile-back-link">
              ← Kembali ke AYT Agro Farm
            </Link>

            <p className="eyebrow">Halaman Organisasi</p>

            <h1>
              PAC HPDKI Kecamatan Dramaga
              <span>Kabupaten Bogor</span>
            </h1>

            <p className="hpdki-profile-lead">
              Wadah organisasi peternak domba dan kambing di Kecamatan Dramaga
              untuk memperkuat pendataan, pengetahuan, jejaring, dan kolaborasi
              peternakan rakyat.
            </p>

            <div className="hpdki-profile-actions">
              <Link href="/hpdki/daftar" className="primary-button">
                Daftar Menjadi Anggota
              </Link>

              <Link href="/hpdki/anggota" className="secondary-button">
                Lihat Daftar Anggota
              </Link>
            </div>
          </div>

          <aside className="hpdki-profile-card" aria-label="Identitas HPDKI PAC Dramaga">
            <div className="hpdki-profile-logo-wrap">
              <Image
                src="/images/hpdki-pac-logo.png"
                alt="Logo Himpunan Peternak Domba Kambing Indonesia PAC Dramaga"
                width={220}
                height={220}
                priority
                className="hpdki-profile-logo"
              />
            </div>

            <h2>HPDKI PAC Dramaga</h2>
            <p>
              Himpunan Peternak Domba Kambing Indonesia tingkat Pengurus Anak
              Cabang Kecamatan Dramaga, Kabupaten Bogor.
            </p>

            <div className="hpdki-profile-number">
              <span>Format Nomor Anggota</span>
              <strong>{memberNumberExample}</strong>
            </div>
          </aside>
        </div>
      </section>

      <section className="hpdki-profile-nav-section" aria-label="Navigasi halaman HPDKI">
        <div className="container hpdki-profile-nav">
          <a href="#profil">Profil</a>
          <a href="#visi">Visi & Misi</a>
          <a href="#program">Program</a>
          <a href="#anggota">Anggota</a>
          <a href="#pendaftaran">Pendaftaran</a>
        </div>
      </section>

      <section id="profil" className="hpdki-profile-section">
        <div className="container hpdki-profile-two-column">
          <div>
            <p className="eyebrow">Profil Organisasi</p>
            <h2>PAC HPDKI Kecamatan Dramaga</h2>
          </div>

          <div className="hpdki-profile-copy">
            <p>
              PAC HPDKI Kecamatan Dramaga Kabupaten Bogor menjadi wadah bagi
              peternak domba dan kambing untuk meningkatkan pengetahuan,
              membangun jaringan, memperkuat usaha, dan berkembang bersama.
            </p>

            <p>
              Halaman ini disiapkan sebagai pusat informasi organisasi,
              pendaftaran anggota, daftar anggota terverifikasi, dan nantinya
              menjadi pintu verifikasi Kartu Tanda Anggota.
            </p>
          </div>
        </div>
      </section>

      <section className="hpdki-profile-stats-section">
        <div className="container hpdki-profile-stats">
          {profileStats.map((item) => (
            <div className="hpdki-profile-stat" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="visi" className="hpdki-profile-section hpdki-profile-section-muted">
        <div className="container hpdki-profile-two-column">
          <div>
            <p className="eyebrow">Visi Organisasi</p>
            <h2>Peternak Mandiri, Profesional, dan Berdaya Saing</h2>
          </div>

          <div className="hpdki-profile-copy">
            <p>
              Menjadi organisasi peternak domba kambing yang mandiri,
              profesional, dan berdaya saing tinggi dalam mewujudkan
              kesejahteraan peternak serta kemandirian pangan berbasis potensi
              lokal Kecamatan Dramaga, Kabupaten Bogor.
            </p>

            <ul className="hpdki-profile-list">
              <li>Meningkatkan kapasitas dan kompetensi peternak.</li>
              <li>Membangun jejaring strategis dan kolaborasi usaha.</li>
              <li>Mendorong kemandirian ekonomi peternak.</li>
              <li>Mengembangkan peternakan yang berkelanjutan.</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="program" className="hpdki-profile-section">
        <div className="container">
          <div className="hpdki-profile-section-heading">
            <p className="eyebrow">Program & Fokus</p>
            <h2>Ruang Kerja PAC HPDKI Dramaga</h2>
            <p>
              Program organisasi diarahkan untuk memperkuat data anggota,
              pengetahuan peternak, kemitraan, dan pengembangan usaha.
            </p>
          </div>

          <div className="hpdki-profile-program-grid">
            {programs.map((program) => (
              <article className="hpdki-profile-program-card" key={program.title}>
                <h3>{program.title}</h3>
                <p>{program.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="anggota" className="hpdki-profile-section hpdki-profile-section-muted">
        <div className="container hpdki-profile-two-column">
          <div>
            <p className="eyebrow">Keanggotaan</p>
            <h2>Daftar Anggota Terverifikasi</h2>
          </div>

          <div className="hpdki-profile-copy">
            <p>
              Daftar anggota publik akan menampilkan anggota yang sudah
              diverifikasi oleh admin. Data yang ditampilkan hanya data umum,
              seperti nomor anggota, nama, wilayah, dan status keanggotaan.
            </p>

            <div className="hpdki-profile-member-preview">
              <span>Contoh Nomor Anggota</span>
              <strong>{memberNumberExample}</strong>
              <p>
                Nomor anggota diterbitkan setelah data pendaftaran divalidasi
                dan disetujui oleh admin.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pendaftaran" className="hpdki-profile-cta">
        <div className="container hpdki-profile-cta-card">
          <div>
            <p className="eyebrow">Pendaftaran Anggota</p>
            <h2>Bergabung bersama PAC HPDKI Kecamatan Dramaga</h2>
            <p>
              Isi formulir pendaftaran untuk masuk ke proses pendataan dan
              validasi calon anggota peternak.
            </p>
          </div>

          <Link href="/hpdki/daftar" className="primary-button">
            Buka Formulir Pendaftaran
          </Link>
        </div>
      </section>
    </main>
  );
}
