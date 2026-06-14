/**
 * Logique métier des paris côté serveur — le backend fait foi.
 * Règle les paris en attente contre le résultat réel des matchs, en transaction.
 */
import type { Match, SelectionKey } from "@/data/types";
import { db } from "@/lib/db";
import { api } from "@/data/api";

/** Sélection gagnante d'un match terminé, ou null s'il n'est pas réglable. */
export function matchWinner(match: Match): SelectionKey | null {
  if (match.status !== "finished" || !match.score) return null;
  const { home, away } = match.score;
  if (home > away) return "home";
  if (away > home) return "away";
  return "draw";
}

export interface SettledBet {
  id: string;
  status: "won" | "lost";
  credit: number;
}

/**
 * Règle tous les paris "pending" d'un utilisateur dont le match est terminé.
 * Crédite le gain (mise × cote) sur les paris gagnés et met à jour les compteurs.
 * Renvoie les paris réglés et le nouveau solde.
 */
export async function settleBetsForUser(
  userId: string,
): Promise<{ settled: SettledBet[]; balance: number }> {
  const pending = await db.bet.findMany({ where: { userId, status: "pending" } });

  // Solde courant servant de repli quand rien n'est réglable.
  const currentBalance = async () =>
    (await db.user.findUnique({ where: { id: userId } }))?.balance ?? 0;

  if (pending.length === 0) return { settled: [], balance: await currentBalance() };

  const matches = await api.getSportsMatches();
  const byId = new Map(matches.map((m) => [m.id, m]));

  const updates: SettledBet[] = [];
  for (const bet of pending) {
    const match = byId.get(bet.matchId);
    if (!match) continue;
    const winner = matchWinner(match);
    if (!winner) continue; // match pas encore terminé → on laisse en attente
    const won = bet.selectionKey === winner;
    updates.push({
      id: bet.id,
      status: won ? "won" : "lost",
      credit: won ? Math.round(bet.stake * bet.oddsAtBet) : 0,
    });
  }

  if (updates.length === 0) return { settled: [], balance: await currentBalance() };

  const totalCredit = updates.reduce((sum, u) => sum + u.credit, 0);
  const wonCount = updates.filter((u) => u.status === "won").length;
  const lostCount = updates.length - wonCount;
  const now = new Date();

  const user = await db.$transaction(async (tx) => {
    for (const u of updates) {
      await tx.bet.update({
        where: { id: u.id },
        data: { status: u.status, settledAt: now },
      });
    }
    return tx.user.update({
      where: { id: userId },
      data: {
        balance: { increment: totalCredit },
        betsWon: { increment: wonCount },
        betsLost: { increment: lostCount },
      },
    });
  });

  return { settled: updates, balance: user.balance };
}
