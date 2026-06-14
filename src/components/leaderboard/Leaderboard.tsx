import { Card } from "@/components/ui/Card";
import { CookieAmount } from "@/components/ui/CookieAmount";
import { cn } from "@/lib/cn";
import type { LeaderboardEntry } from "@/data/types";

const MEDAL = ["🥇", "🥈", "🥉"];

/** Podium top 3 + tableau des parieurs. */
export function Leaderboard({ entries }: { entries: LeaderboardEntry[] }) {
  const [first, second, third] = entries;
  const rest = entries.slice(3);

  return (
    <div className="flex flex-col gap-6">
      {/* Podium */}
      <div className="grid grid-cols-3 items-end gap-1.5 sm:gap-3">
        <PodiumStep entry={second} place={2} heightClass="h-28" />
        <PodiumStep entry={first} place={1} heightClass="h-36" />
        <PodiumStep entry={third} place={3} heightClass="h-24" />
      </div>

      {/* Reste du classement */}
      <Card className="divide-y divide-cookie-base/15 overflow-hidden">
        {rest.map((e) => (
          <div
            key={e.user.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              e.isCurrentUser && "bg-caramel/15",
            )}
          >
            <span className="w-6 text-center font-display font-bold text-choc-chip/60">
              {e.rank}
            </span>
            <span className="grid size-9 place-items-center rounded-xl bg-cookie-dough text-lg">
              {e.user.avatar}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-choc-chip">
                {e.user.name}
                {e.isCurrentUser && (
                  <span className="ml-1.5 text-xs font-bold text-caramel">(toi)</span>
                )}
              </p>
              <p className="text-xs text-choc-chip/60">
                {Math.round(e.winRate * 100)}% de réussite
              </p>
            </div>
            <CookieAmount amount={e.balance} className="text-choc-chip" />
          </div>
        ))}
      </Card>
    </div>
  );
}

function PodiumStep({
  entry,
  place,
  heightClass,
}: {
  entry?: LeaderboardEntry;
  place: number;
  heightClass: string;
}) {
  if (!entry) return <div />;
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="grid size-10 place-items-center rounded-2xl bg-cookie-dough text-xl shadow-soft sm:size-12 sm:text-2xl">
        {entry.user.avatar}
      </span>
      <p className="max-w-full truncate text-center text-xs font-bold text-choc-chip sm:text-sm">
        {entry.user.name}
      </p>
      <div
        className={cn(
          "flex w-full flex-col items-center justify-start rounded-t-2xl pt-2 text-cream",
          heightClass,
          place === 1 ? "bg-caramel" : "bg-cookie-base",
        )}
      >
        <span className="text-xl sm:text-2xl">{MEDAL[place - 1]}</span>
        <CookieAmount amount={entry.balance} className="mt-1 text-xs text-cream" />
      </div>
    </div>
  );
}
