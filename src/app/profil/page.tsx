"use client";

import Link from "next/link";
import { Store, TrendingUp } from "lucide-react";
import { useWallet } from "@/store/wallet";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BetHistoryItem } from "@/components/betting/BetHistoryItem";
import { formatCookies } from "@/lib/format";

export default function ProfilPage() {
  const { user, balance, bets, loading } = useWallet();

  // Compteurs autoritatifs du backend (les paris réglés y sont déjà comptés).
  const won = user?.betsWon ?? 0;
  const lost = user?.betsLost ?? 0;
  const total = won + lost;
  const winRate = total ? Math.round((won / total) * 100) : 0;
  const recent = bets.slice(0, 4);

  if (loading && !user) {
    return <p className="py-16 text-center text-choc-chip/60">Chargement de ton profil… 🍪</p>;
  }

  return (
    <div>
      {/* Carte profil */}
      <Card className="mb-5 flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
        <span className="grid size-20 place-items-center rounded-3xl bg-cookie-dough text-5xl shadow-soft">
          {user?.avatar ?? "🍪"}
        </span>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-extrabold text-choc-chip">
            {user?.name ?? "Parieur"}
          </h1>
          <p className="text-choc-chip/70">Parieur gourmand depuis 2026</p>
        </div>
        <div className="rounded-2xl bg-choc-chip px-5 py-3 text-cream">
          <p className="text-xs uppercase tracking-wide opacity-70">Portefeuille</p>
          <p className="font-display text-2xl font-bold">{formatCookies(balance)} 🍪</p>
        </div>
      </Card>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3">
        <Stat label="Gagnés" value={won} tone="text-mint-win" />
        <Stat label="Perdus" value={lost} tone="text-berry-loss" />
        <Stat
          label="Réussite"
          value={`${winRate}%`}
          tone="text-choc-chip"
          icon={<TrendingUp size={16} />}
        />
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-choc-chip">Activité récente</h2>
        <Link href="/mes-paris" className="text-sm font-semibold text-caramel hover:underline">
          Tout voir
        </Link>
      </div>

      {recent.length > 0 ? (
        <div className="flex flex-col gap-3">
          {recent.map((b) => (
            <BetHistoryItem key={b.id} bet={b} />
          ))}
        </div>
      ) : (
        <p className="py-6 text-center text-choc-chip/60">Aucun pari pour l’instant. 🍪</p>
      )}

      <Card className="mt-6 flex flex-col items-center justify-between gap-3 p-5 sm:flex-row">
        <div className="flex items-center gap-2 text-choc-chip">
          <Store className="text-caramel" />
          <span className="font-semibold">À court de cookies ?</span>
        </div>
        <Link href="/boutique">
          <Button>Aller à la boutique</Button>
        </Link>
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string | number;
  tone: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col items-center gap-1 p-3 text-center sm:p-4">
      <span
        className={`flex items-center gap-1 font-display text-xl font-extrabold sm:text-2xl ${tone}`}
      >
        {icon}
        {value}
      </span>
      <span className="text-xs font-semibold uppercase tracking-wide text-choc-chip/60">
        {label}
      </span>
    </Card>
  );
}
