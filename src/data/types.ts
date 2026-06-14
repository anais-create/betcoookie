/** Types domaine de Bet Cookie. Source de vérité partagée par l'UI et l'API. */

export type SportKey = "football" | "basket" | "tennis";

export interface Sport {
  key: SportKey;
  label: string;
  emoji: string;
}

export interface Team {
  name: string;
  /** Code court (3 lettres) pour les écrans compacts. */
  short: string;
  /** Couleurs de marque, repli pour générer un badge SVG quand aucun logo n'est dispo. */
  colors: { primary: string; secondary: string };
  /**
   * URL d'un vrai logo (CDN sportif) : crest de franchise (ESPN) ou drapeau
   * national (flagcdn) pour les sélections nationales et joueurs de tennis.
   * Prioritaire sur `domain`. Si l'image échoue, repli auto sur le badge SVG.
   */
  logo?: string;
  /** Domaine officiel du club (ex. "realmadrid.com") → logo via favicon Google. Repli si pas de `logo`. */
  domain?: string;
}

/** Une sélection pariable sur un match. */
export type SelectionKey = "home" | "draw" | "away";

export interface Selection {
  key: SelectionKey;
  label: string;
  odds: number;
}

export type MatchStatus = "upcoming" | "live" | "finished";

export interface Match {
  id: string;
  sport: SportKey;
  competition: string;
  startTime: string; // ISO
  status: MatchStatus;
  home: Team;
  away: Team;
  /** Sélections disponibles (1N2 ; le tennis n'a pas de "draw"). */
  selections: Selection[];
  /** Score final si terminé. */
  score?: { home: number; away: number };
}

export type BetStatus = "pending" | "won" | "lost";

export interface Bet {
  id: string;
  matchId: string;
  matchLabel: string;
  selectionKey: SelectionKey;
  selectionLabel: string;
  stake: number;
  oddsAtBet: number;
  status: BetStatus;
  placedAt: string; // ISO
}

export interface User {
  id: string;
  name: string;
  avatar: string; // emoji
  balance: number;
  betsWon: number;
  betsLost: number;
}

export interface LeaderboardEntry {
  rank: number;
  user: Pick<User, "id" | "name" | "avatar">;
  balance: number;
  winRate: number; // 0..1
  isCurrentUser?: boolean;
}

/**
 * Instantané de session renvoyé par GET /api/me et consommé par le wallet.
 * `user` est null quand personne n'est connecté.
 */
export interface SessionState {
  user: User | null;
  bets: Bet[];
  lastDailyClaim: string | null;
}

export interface ShopPack {
  id: string;
  label: string;
  amount: number;
  emoji: string;
  /** "Bonus quotidien" réclamable une fois, ou pack gratuit. */
  kind: "daily" | "free";
  highlight?: boolean;
}
