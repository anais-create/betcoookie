import { formatOdds } from "@/lib/format";
import { cn } from "@/lib/cn";

interface OddsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  odds: number;
  selected?: boolean;
}

/** Bouton de cote 1N2. Sélectionnable (état actif marron plein). */
export function OddsButton({ label, odds, selected, className, ...props }: OddsButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "flex flex-1 flex-col items-center gap-0.5 rounded-2xl border px-2 py-2 transition-all",
        "disabled:cursor-not-allowed disabled:opacity-50",
        selected
          ? "border-choc-chip bg-choc-chip text-cream shadow-soft"
          : "border-cookie-base/40 bg-cookie-dough/60 text-choc-chip hover:border-caramel hover:bg-caramel/20",
        className,
      )}
      {...props}
    >
      <span className="max-w-full truncate text-xs font-medium opacity-80">{label}</span>
      <span className="font-display text-lg font-bold tabular-nums">{formatOdds(odds)}</span>
    </button>
  );
}
