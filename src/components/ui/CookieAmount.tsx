import { cn } from "@/lib/cn";
import { formatCookies } from "@/lib/format";

interface CookieAmountProps {
  amount: number;
  className?: string;
  /** Affiche un signe +/− et colore selon le signe. */
  signed?: boolean;
}

/** Affiche un montant de cookies avec l'emoji 🍪 comme unité de monnaie. */
export function CookieAmount({ amount, className, signed }: CookieAmountProps) {
  const sign = signed ? (amount > 0 ? "+" : amount < 0 ? "−" : "") : "";
  const color = signed
    ? amount > 0
      ? "text-mint-win"
      : amount < 0
        ? "text-berry-loss"
        : ""
    : "";
  return (
    <span className={cn("inline-flex items-center gap-1 font-bold tabular-nums", color, className)}>
      {sign}
      {formatCookies(Math.abs(amount))}
      <span aria-hidden>🍪</span>
    </span>
  );
}
