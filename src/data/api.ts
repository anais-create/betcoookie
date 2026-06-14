/**
 * Couche d'accès aux données — INTERFACE UNIQUE consommée par toute l'UI serveur.
 *
 * Matchs + cotes : vraie API (The Odds API, cf. src/data/sources/odds-api.ts),
 * avec fallback automatique sur les mocks quand l'API ne renvoie rien.
 * User, paris, classement : vrais lectures en base (Prisma/SQLite), portées par
 * la session du visiteur. Boutique : packs statiques.
 *
 * Serveur uniquement (importe @/lib/auth → next/headers). Les Client Components
 * passent par les Route Handlers sous /api, jamais par ce module.
 */
import type {
  Bet,
  LeaderboardEntry,
  Match,
  ShopPack,
  User,
} from "@/data/types";
import type { Bet as DbBet, User as DbUser } from "@prisma/client";
import { MATCHES } from "@/data/mock/matches";
import { LEADERBOARD, SHOP_PACKS } from "@/data/mock/user";
import { fetchOddsMatches } from "@/data/sources/odds-api";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

/** Mappe une ligne User (BDD) vers le type domaine exposé à l'UI. */
export function toDomainUser(u: DbUser): User {
  return {
    id: u.id,
    name: u.name,
    avatar: u.avatar,
    balance: u.balance,
    betsWon: u.betsWon,
    betsLost: u.betsLost,
  };
}

/** Mappe une ligne Bet (BDD) vers le type domaine. */
export function toDomainBet(b: DbBet): Bet {
  return {
    id: b.id,
    matchId: b.matchId,
    matchLabel: b.matchLabel,
    selectionKey: b.selectionKey as Bet["selectionKey"],
    selectionLabel: b.selectionLabel,
    stake: b.stake,
    oddsAtBet: b.oddsAtBet,
    status: b.status as Bet["status"],
    placedAt: b.placedAt.toISOString(),
  };
}

function winRate(won: number, lost: number): number {
  const total = won + lost;
  return total ? won / total : 0;
}

export const api = {
  getSportsMatches: async (): Promise<Match[]> => {
    const live = await fetchOddsMatches();
    if (live.length > 0) return live;
    // Aucun match côté API (intersaison ou quota) → on retombe sur les mocks.
    console.warn("[bet-cookie] 0 match depuis l'API — affichage des matchs mockés.");
    return MATCHES;
  },

  getMatch: async (id: string): Promise<Match | undefined> => {
    const matches = await api.getSportsMatches();
    return matches.find((m) => m.id === id);
  },

  /** Utilisateur connecté, ou null si pas de session. */
  getMe: async (): Promise<User | null> => {
    const me = await getCurrentUser();
    return me ? toDomainUser(me) : null;
  },

  /** Paris du visiteur connecté (vide si non connecté), les plus récents d'abord. */
  getMyBets: async (): Promise<Bet[]> => {
    const me = await getCurrentUser();
    if (!me) return [];
    const bets = await db.bet.findMany({
      where: { userId: me.id },
      orderBy: { placedAt: "desc" },
    });
    return bets.map(toDomainBet);
  },

  /**
   * Classement : vrais utilisateurs (BDD) fusionnés avec quelques bots de démo,
   * triés par solde décroissant. L'utilisateur connecté est marqué isCurrentUser.
   */
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const me = await getCurrentUser();
    const users = await db.user.findMany({
      orderBy: { balance: "desc" },
      take: 50,
    });

    const realEntries = users.map((u) => ({
      user: { id: u.id, name: u.name, avatar: u.avatar },
      balance: u.balance,
      winRate: winRate(u.betsWon, u.betsLost),
      isCurrentUser: me?.id === u.id,
    }));

    // Bots de démo (hors "u-me") pour garnir le tableau tant qu'il y a peu de vrais comptes.
    const bots = LEADERBOARD.filter((e) => e.user.id !== "u-me").map((e) => ({
      user: e.user,
      balance: e.balance,
      winRate: e.winRate,
      isCurrentUser: false,
    }));

    return [...realEntries, ...bots]
      .sort((a, b) => b.balance - a.balance)
      .map((e, i) => ({ ...e, rank: i + 1 }));
  },

  getShopPacks: async (): Promise<ShopPack[]> => SHOP_PACKS,
};

export type Api = typeof api;
