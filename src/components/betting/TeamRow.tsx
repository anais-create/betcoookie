import type { Match, Team as TeamType } from "@/data/types";
import { cn } from "@/lib/cn";
import { TeamLogo } from "./TeamLogo";

/** Affiche les deux équipes (et le score si terminé). */
export function TeamRow({ match, className }: { match: Match; className?: string }) {
  const { home, away, score } = match;
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <Team team={home} />
      {score ? (
        <span className="font-display text-xl font-bold tabular-nums text-choc-chip">
          {score.home}–{score.away}
        </span>
      ) : (
        <span className="text-sm font-semibold text-choc-chip/50">VS</span>
      )}
      <Team team={away} align="right" />
    </div>
  );
}

function Team({ team, align = "left" }: { team: TeamType; align?: "left" | "right" }) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 items-center gap-2",
        align === "right" && "flex-row-reverse text-right",
      )}
    >
      <TeamLogo team={team} />
      <span className="truncate font-display font-bold text-choc-chip">{team.name}</span>
    </div>
  );
}
