"use client";

import { useState } from "react";
import { MatchCard } from "@/components/betting/MatchCard";
import { SPORTS } from "@/data/mock/sports";
import { cn } from "@/lib/cn";
import type { Match, SportKey } from "@/data/types";

type Filter = SportKey | "all";

/** Liste de matchs avec filtres par sport (chips). */
export function MatchList({ matches }: { matches: Match[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? matches : matches.filter((m) => m.sport === filter);

  const chips: { key: Filter; label: string; emoji?: string }[] = [
    { key: "all", label: "Tous", emoji: "🍪" },
    ...SPORTS.map((s) => ({ key: s.key as Filter, label: s.label, emoji: s.emoji })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              filter === c.key
                ? "bg-choc-chip text-cream"
                : "border border-cookie-base/40 bg-cream text-choc-chip hover:bg-cookie-dough",
            )}
          >
            <span aria-hidden>{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((m) => (
          <MatchCard key={m.id} match={m} />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="py-8 text-center text-choc-chip/60">
          Aucun match pour ce sport. 🍪
        </p>
      )}
    </div>
  );
}
