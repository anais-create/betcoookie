import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { MatchMeta } from "@/components/betting/MatchMeta";
import { TeamRow } from "@/components/betting/TeamRow";
import { formatOdds } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Match } from "@/data/types";

/** Carte de match pour la liste d'accueil. Les cotes mènent au détail pré-sélectionné. */
export function MatchCard({ match }: { match: Match }) {
  const closed = match.status === "finished";
  return (
    <Card className="flex flex-col gap-3 p-4 transition-transform hover:-translate-y-0.5">
      <Link href={`/match/${match.id}`} className="flex flex-col gap-3">
        <MatchMeta match={match} />
        <TeamRow match={match} />
      </Link>

      <div className="flex gap-2">
        {match.selections.map((sel) => (
          <Link
            key={sel.key}
            href={closed ? `/match/${match.id}` : `/match/${match.id}?sel=${sel.key}`}
            aria-disabled={closed}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-2xl border border-cookie-base/40 bg-cookie-dough/60 px-2 py-2 text-choc-chip transition-all",
              closed
                ? "pointer-events-none opacity-50"
                : "hover:border-caramel hover:bg-caramel/20",
            )}
          >
            <span className="max-w-full truncate text-xs font-medium opacity-80">
              {sel.label}
            </span>
            <span className="font-display text-lg font-bold tabular-nums">
              {formatOdds(sel.odds)}
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
