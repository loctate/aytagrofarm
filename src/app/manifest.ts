import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AYT Agro Farm",
    short_name: "AYT Agro Farm",
    description: "Breeding, fattening, dan trading kambing serta domba di Bogor dan Jabodetabek.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffefa",
    theme_color: "#103e2c",
    lang: "id",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
