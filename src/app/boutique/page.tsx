"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useWallet } from "@/store/wallet";
import { SHOP_PACKS } from "@/data/mock/user";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatCookies } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { ShopPack } from "@/data/types";

export default function BoutiquePage() {
  const { balance, claim, dailyClaimedToday } = useWallet();
  const [flash, setFlash] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function handleClaim(pack: ShopPack) {
    if (pack.kind === "daily" && dailyClaimedToday) return;
    setBusy(pack.id);
    const res = await claim(pack.id);
    setBusy(null);
    if (res.ok) {
      setFlash(pack.id);
      setTimeout(() => setFlash((f) => (f === pack.id ? null : f)), 1800);
    }
  }

  return (
    <div>
      <PageHeader
        title="Boutique de cookies"
        emoji="🛒"
        subtitle="Recharge gratuitement ton stock de cookies pour continuer à parier."
        action={
          <div className="hidden rounded-2xl bg-choc-chip px-4 py-2 text-cream sm:block">
            <span className="font-display text-xl font-bold">{formatCookies(balance)} 🍪</span>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SHOP_PACKS.map((pack) => {
          const claimedDaily = pack.kind === "daily" && dailyClaimedToday;
          const justClaimed = flash === pack.id;
          return (
            <Card
              key={pack.id}
              className={cn(
                "flex flex-col items-center gap-3 p-6 text-center",
                pack.highlight && "border-caramel/60 ring-2 ring-caramel/30",
              )}
            >
              <span className="text-5xl">{pack.emoji}</span>
              <div>
                <p className="font-display text-lg font-bold text-choc-chip">{pack.label}</p>
                <p className="font-display text-2xl font-extrabold text-caramel">
                  +{formatCookies(pack.amount)} 🍪
                </p>
              </div>
              <Button
                fullWidth
                variant={pack.highlight ? "primary" : "secondary"}
                disabled={claimedDaily || busy === pack.id}
                onClick={() => handleClaim(pack)}
              >
                {justClaimed ? (
                  <>
                    <Check size={18} /> Crédité !
                  </>
                ) : busy === pack.id ? (
                  "Un instant…"
                ) : claimedDaily ? (
                  "Déjà réclamé aujourd’hui"
                ) : pack.kind === "daily" ? (
                  "Réclamer le bonus"
                ) : (
                  "Récupérer"
                )}
              </Button>
            </Card>
          );
        })}
      </div>

      <p className="mt-6 text-center text-sm text-choc-chip/60">
        🍪 Monnaie 100 % virtuelle — aucun argent réel, juste du plaisir de parier.
      </p>
    </div>
  );
}
