import type { Sport } from "@/data/types";

export const SPORTS: Sport[] = [
  { key: "football", label: "Football", emoji: "⚽" },
  { key: "basket", label: "Basket", emoji: "🏀" },
  { key: "tennis", label: "Tennis", emoji: "🎾" },
];

export const SPORT_BY_KEY = Object.fromEntries(
  SPORTS.map((s) => [s.key, s]),
) as Record<Sport["key"], Sport>;
