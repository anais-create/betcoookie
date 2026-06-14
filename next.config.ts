import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sources de logos (cf. TeamLogo). Les images sont rendues en `unoptimized`,
    // mais on déclare les hôtes pour rester explicite et compatible si on repasse en optimisé.
    remotePatterns: [
      {
        // Favicons officiels des clubs par domaine.
        protocol: "https",
        hostname: "www.google.com",
        port: "",
        pathname: "/s2/favicons",
      },
      {
        // Drapeaux nationaux (Coupe du Monde, joueurs de tennis).
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        // Logos de franchises NBA.
        protocol: "https",
        hostname: "a.espncdn.com",
      },
    ],
  },
};

export default nextConfig;
