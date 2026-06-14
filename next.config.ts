import type { NextConfig } from "next";

// Domaine canonique unique. Le cookie de session (bet-cookie-session) est lié à
// UN host : si l'app est accessible sur deux domaines, se connecter sur l'un et
// naviguer sur l'autre renvoie sans cesse vers /login. On force donc tout le
// trafic du domaine en double vers le domaine canonique (redirection 308).
const CANONICAL_HOST = "betcoookie.vercel.app";
const DUPLICATE_HOSTS = ["bet-cookie.vercel.app"];

const nextConfig: NextConfig = {
  async redirects() {
    return DUPLICATE_HOSTS.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `https://${CANONICAL_HOST}/:path*`,
      permanent: true,
    }));
  },
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
