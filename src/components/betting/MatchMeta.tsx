import { Badge } from "@/components/ui/Badge";
import { SPORT_BY_KEY } from "@/data/mock/sports";
import { formatMatchDate } from "@/lib/format";
import type { Match } from "@/data/types";

/** Ligne d'info d'un match : sport, compétition, statut/heure. */
export function MatchMeta({ match }: { match: Match }) {
  const sport = SPORT_BY_KEY[match.sport];
  return (
    <div className="flex items-center justify-between gap-2 text-xs text-choc-chip/70">
      <span className="inline-flex items-center gap-1 font-semibold">
        <span aria-hidden>{sport.emoji}</span>
        {match.competition}
      </span>
      {match.status === "live" ? (
        <Badge tone="live">
          <span className="size-1.5 animate-pulse rounded-full bg-berry-loss" />
          EN DIRECT
        </Badge>
      ) : match.status === "finished" ? (
        <Badge tone="neutral">Terminé</Badge>
      ) : (
        <span className="font-medium">{formatMatchDate(match.startTime)}</span>
      )}
    </div>
  );
}
