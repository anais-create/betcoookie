import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CookieAmount } from "@/components/ui/CookieAmount";
import { formatOdds, potentialPayout } from "@/lib/format";
import type { Bet } from "@/data/types";

const STATUS: Record<Bet["status"], { tone: "pending" | "win" | "loss"; label: string }> = {
  pending: { tone: "pending", label: "En cours" },
  won: { tone: "win", label: "Gagné" },
  lost: { tone: "loss", label: "Perdu" },
};

/** Ligne d'historique de pari (en cours ou réglé). */
export function BetHistoryItem({ bet }: { bet: Bet }) {
  const status = STATUS[bet.status];
  const payout = potentialPayout(bet.stake, bet.oddsAtBet);
  return (
    <Card className="flex items-center justify-between gap-3 p-4">
      <div className="min-w-0">
        <p className="truncate font-display font-bold text-choc-chip">{bet.matchLabel}</p>
        <p className="text-sm text-choc-chip/70">
          {bet.selectionLabel} · cote {formatOdds(bet.oddsAtBet)} · mise{" "}
          {bet.stake} 🍪
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Badge tone={status.tone}>{status.label}</Badge>
        {bet.status === "won" ? (
          <CookieAmount amount={payout} signed className="text-sm" />
        ) : bet.status === "lost" ? (
          <CookieAmount amount={-bet.stake} signed className="text-sm" />
        ) : (
          <span className="text-xs text-choc-chip/60">
            gain : {payout} 🍪
          </span>
        )}
      </div>
    </Card>
  );
}
