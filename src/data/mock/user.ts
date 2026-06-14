import type { Bet, LeaderboardEntry, ShopPack, User } from "@/data/types";

/** Utilisateur courant (mocké). */
export const CURRENT_USER: User = {
  id: "u-me",
  name: "Toi",
  avatar: "🍪",
  balance: 1250,
  betsWon: 14,
  betsLost: 9,
};

/** Paris initiaux de l'utilisateur. */
export const INITIAL_BETS: Bet[] = [
  {
    id: "b1",
    matchId: "m7",
    matchLabel: "France — Maroc",
    selectionKey: "home",
    selectionLabel: "France",
    stake: 100,
    oddsAtBet: 1.65,
    status: "pending",
    placedAt: "2026-06-13T18:12:00.000Z",
  },
  {
    id: "b2",
    matchId: "m19",
    matchLabel: "Sinner — Fritz",
    selectionKey: "home",
    selectionLabel: "Sinner",
    stake: 150,
    oddsAtBet: 1.35,
    status: "won",
    placedAt: "2026-06-07T11:00:00.000Z",
  },
  {
    id: "b3",
    matchId: "m2",
    matchLabel: "Thunder — Celtics",
    selectionKey: "home",
    selectionLabel: "Thunder",
    stake: 80,
    oddsAtBet: 1.80,
    status: "pending",
    placedAt: "2026-06-14T08:30:00.000Z",
  },
];

/** Classement (l'utilisateur courant est inséré par l'API). */
export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, user: { id: "u1", name: "ChocoMaster", avatar: "🏆" }, balance: 9820, winRate: 0.71 },
  { rank: 2, user: { id: "u2", name: "MissPépite", avatar: "👑" }, balance: 7640, winRate: 0.66 },
  { rank: 3, user: { id: "u3", name: "CrunchyBet", avatar: "🥇" }, balance: 6190, winRate: 0.63 },
  { rank: 4, user: { id: "u4", name: "SugarRush", avatar: "🍩" }, balance: 4530, winRate: 0.58 },
  { rank: 5, user: { id: "u5", name: "GooeyGains", avatar: "🧁" }, balance: 3870, winRate: 0.55 },
  { rank: 6, user: { id: "u6", name: "DoughBoy", avatar: "🍞" }, balance: 2960, winRate: 0.52 },
  { rank: 7, user: { id: "u-me", name: "Toi", avatar: "🍪" }, balance: 1250, winRate: 0.61, isCurrentUser: true },
  { rank: 8, user: { id: "u7", name: "MilkDunker", avatar: "🥛" }, balance: 980, winRate: 0.48 },
];

/** Boutique de cookies. */
export const SHOP_PACKS: ShopPack[] = [
  { id: "daily", label: "Bonus quotidien", amount: 250, emoji: "📅", kind: "daily", highlight: true },
  { id: "p1", label: "Petit pot", amount: 100, emoji: "🍪", kind: "free" },
  { id: "p2", label: "Boîte gourmande", amount: 500, emoji: "📦", kind: "free" },
  { id: "p3", label: "Jarre géante", amount: 1500, emoji: "🫙", kind: "free" },
];
