const aytAgroFarmAddress =
  "KP Jl. Sukabakti, RT.002/RW.006, Sukawening, Kec. Dramaga, Kabupaten Bogor, Jawa Barat 16680";

const googleMapsUrl =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(aytAgroFarmAddress);

export default function SiteAddress() {
  return (
    <address className="site-address">
      <span className="site-address-label">Alamat AYT Agro Farm</span>

      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Lihat alamat AYT Agro Farm di Google Maps"
      >
        <span aria-hidden="true">📍</span>
        <span>{aytAgroFarmAddress}</span>
      </a>
    </address>
  );
}
