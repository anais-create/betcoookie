"use client";

import { useState } from "react";
import Image from "next/image";
import type { Team } from "@/data/types";
import { cn } from "@/lib/cn";

/** Choisit une couleur de texte lisible (foncée ou claire) selon la luminance du fond. */
function readableText(hex: string): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#3a2418" : "#ffffff";
}

/** Badge SVG généré (couleurs + monogramme) — repli quand aucun vrai logo n'est dispo. */
function FallbackBadge({
  team,
  className,
}: {
  team: Pick<Team, "name" | "short" | "colors">;
  className?: string;
}) {
  const { primary, secondary } = team.colors;
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("size-8 shrink-0", className)}
      role="img"
      aria-label={`Logo ${team.name}`}
    >
      <circle cx="20" cy="20" r="18" fill={primary} stroke={secondary} strokeWidth="4" />
      <text
        x="20"
        y="21"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12"
        fontWeight="800"
        letterSpacing="-0.5"
        fill={readableText(primary)}
        style={{ fontFamily: "var(--font-baloo), system-ui, sans-serif" }}
      >
        {team.short}
      </text>
    </svg>
  );
}

/**
 * Logo d'équipe, par ordre de priorité :
 *   1. `team.logo` — vrai logo via CDN sportif (crest de franchise ESPN, drapeau flagcdn).
 *   2. `team.domain` — favicon officiel du club via le service d'icônes de Google.
 *   3. Badge SVG généré (couleurs + monogramme).
 * Si l'image distante échoue (service indisponible, 404), bascule automatiquement sur le badge.
 */
export function TeamLogo({
  team,
  className,
}: {
  team: Pick<Team, "name" | "short" | "colors" | "logo" | "domain">;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  const src = team.logo
    ? team.logo
    : team.domain
      ? `https://www.google.com/s2/favicons?domain=${team.domain}&sz=128`
      : null;

  if (!src || failed) {
    return <FallbackBadge team={team} className={className} />;
  }

  return (
    <Image
      src={src}
      alt={`Logo ${team.name}`}
      width={32}
      height={32}
      unoptimized
      onError={() => setFailed(true)}
      className={cn("size-8 shrink-0 rounded-full bg-white object-contain p-0.5", className)}
    />
  );
}
