"use client";

import { useState } from "react";
import { Coins, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { OddsButton } from "@/components/betting/OddsButton";
import { CookieAmount } from "@/components/ui/CookieAmount";
import { useWallet } from "@/store/wallet";
import { potentialPayout, formatCookies } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Match, SelectionKey } from "@/data/types";

const QUICK_STAKES = [50, 100, 250, 500];

/**
 * Formulaire de mise. Sticky panel sur desktop, sheet plein écran sur mobile.
 * Débite réellement le wallet de session via useWallet().placeBet.
 */
export function BetForm({
  match,
  initialSelection,
}: {
  match: Match;
  initialSelection?: SelectionKey;
}) {
  const { balance, placeBet } = useWallet();
  const [selKey, setSelKey] = useState<SelectionKey | null>(initialSelection ?? null);
  const [stake, setStake] = useState<number>(100);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closed = match.status === "finished";
  const selection = match.selections.find((s) => s.key === selKey) ?? null;
  const payout = selection ? potentialPayout(stake, selection.odds) : 0;
  const profit = payout - stake;
  const tooPoor = stake > balance;
  const canBet = !closed && !!selection && stake > 0 && !tooPoor && !submitting;

  async function submit() {
    if (!selection || !canBet) return;
    setSubmitting(true);
    setError(null);
    const res = await placeBet({
      match,
      selectionKey: selection.key,
      selectionLabel: selection.label,
      odds: selection.odds,
      stake,
    });
    setSubmitting(false);
    if (res.ok) {
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } else {
      setError(res.error ?? "Le pari n'a pas pu être placé.");
    }
  }

  if (closed) {
    return (
      <Card className="p-5 text-center text-choc-chip/70">
        Ce match est terminé — les paris sont clôturés. 🍪
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center gap-2">
        <Coins className="text-caramel" size={20} />
        <h2 className="font-display text-xl font-bold text-choc-chip">Place ta mise</h2>
      </div>

      {/* Sélection */}
      <div>
        <p className="mb-1.5 text-sm font-semibold text-choc-chip/80">Ton pronostic</p>
        <div className="flex gap-2">
          {match.selections.map((sel) => (
            <OddsButton
              key={sel.key}
              label={sel.label}
              odds={sel.odds}
              selected={selKey === sel.key}
              onClick={() => setSelKey(sel.key)}
            />
          ))}
        </div>
      </div>

      {/* Mise */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-sm font-semibold text-choc-chip/80">Mise (en cookies)</p>
          <span className="text-xs text-choc-chip/60">
            Solde : {formatCookies(balance)} 🍪
          </span>
        </div>
        <div className="relative">
          <input
            type="number"
            min={1}
            value={stake}
            onChange={(e) => setStake(Math.max(0, Number(e.target.value)))}
            className={cn(
              "w-full rounded-2xl border bg-cream px-4 py-3 pr-10 font-display text-xl font-bold tabular-nums text-choc-chip outline-none transition-colors",
              tooPoor ? "border-berry-loss" : "border-cookie-base/40 focus:border-caramel",
            )}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg">
            🍪
          </span>
        </div>
        <div className="mt-2 flex gap-2">
          {QUICK_STAKES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setStake(q)}
              className="flex-1 rounded-xl border border-cookie-base/40 bg-cookie-dough/60 py-1.5 text-sm font-semibold text-choc-chip transition-colors hover:bg-caramel/20"
            >
              {q}
            </button>
          ))}
        </div>
        {tooPoor && (
          <p className="mt-1.5 text-sm font-medium text-berry-loss">
            Pas assez de cookies — passe à la boutique ! 🍪
          </p>
        )}
      </div>

      {/* Gain potentiel */}
      <div className="flex items-center justify-between rounded-2xl bg-cookie-dough/70 px-4 py-3">
        <span className="text-sm font-semibold text-choc-chip/80">Gain potentiel</span>
        <div className="text-right">
          <CookieAmount amount={payout} className="text-xl text-choc-chip" />
          {selection && (
            <p className="text-xs text-mint-win">
              dont +{formatCookies(profit)} de bénéfice
            </p>
          )}
        </div>
      </div>

      {error && <p className="text-sm font-medium text-berry-loss">{error}</p>}

      <Button fullWidth size="lg" disabled={!canBet} onClick={submit}>
        {done ? (
          <>
            <Check size={20} /> Pari validé !
          </>
        ) : submitting ? (
          "Un instant…"
        ) : selection ? (
          <>Miser {formatCookies(stake)} 🍪</>
        ) : (
          "Choisis un pronostic"
        )}
      </Button>
    </Card>
  );
}
