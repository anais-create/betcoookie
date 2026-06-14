"use client";

import { useState } from "react";
import Link from "next/link";
import { useWallet } from "@/store/wallet";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { BetHistoryItem } from "@/components/betting/BetHistoryItem";
import { cn } from "@/lib/cn";

type Tab = "pending" | "settled";

export default function MesParisPage() {
  const { bets, settle } = useWallet();
  const [tab, setTab] = useState<Tab>("pending");
  const [settling, setSettling] = useState(false);

  const pending = bets.filter((b) => b.status === "pending");
  const settled = bets.filter((b) => b.status !== "pending");
  const list = tab === "pending" ? pending : settled;

  async function handleSettle() {
    setSettling(true);
    await settle();
    setSettling(false);
  }

  return (
    <div>
      <PageHeader
        title="Mes paris"
        emoji="🎟️"
        subtitle="Suis tes pronostics en temps réel."
        action={
          pending.length > 0 ? (
            <Button variant="secondary" disabled={settling} onClick={handleSettle}>
              {settling ? "Règlement…" : "Régler les matchs terminés"}
            </Button>
          ) : undefined
        }
      />

      <div className="mb-5 inline-flex rounded-2xl bg-cookie-dough/70 p-1">
        <TabButton active={tab === "pending"} onClick={() => setTab("pending")}>
          En cours ({pending.length})
        </TabButton>
        <TabButton active={tab === "settled"} onClick={() => setTab("settled")}>
          Réglés ({settled.length})
        </TabButton>
      </div>

      {list.length > 0 ? (
        <div className="flex flex-col gap-3">
          {list.map((b) => (
            <BetHistoryItem key={b.id} bet={b} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-cookie-base/40 p-10 text-center">
          <p className="text-4xl">🍪</p>
          <p className="mt-2 font-display text-lg font-bold text-choc-chip">
            {tab === "pending" ? "Aucun pari en cours" : "Aucun pari réglé"}
          </p>
          <p className="mt-1 text-choc-chip/70">Va flairer un bon match à parier !</p>
          <Link href="/" className="mt-4 inline-block">
            <Button>Voir les matchs</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
        active ? "bg-choc-chip text-cream" : "text-choc-chip/70 hover:text-choc-chip",
      )}
    >
      {children}
    </button>
  );
}
