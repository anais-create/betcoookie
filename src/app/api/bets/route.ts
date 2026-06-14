/**
 * POST /api/bets — place un pari. Le backend fait foi :
 * la cote et le libellé sont re-dérivés du match serveur (jamais ceux du client),
 * et le débit du solde se fait en transaction avec contrôle de solde.
 */
import { NextResponse } from "next/server";
import type { SelectionKey } from "@/data/types";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { api, toDomainBet } from "@/data/api";

export async function POST(request: Request) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  let body: { matchId?: string; selectionKey?: string; stake?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const matchId = String(body.matchId ?? "");
  const selectionKey = String(body.selectionKey ?? "") as SelectionKey;
  const stake = Math.floor(Number(body.stake));

  if (!Number.isFinite(stake) || stake <= 0) {
    return NextResponse.json({ error: "Mise invalide." }, { status: 400 });
  }

  const match = await api.getMatch(matchId);
  if (!match) return NextResponse.json({ error: "Match introuvable." }, { status: 404 });
  if (match.status === "finished") {
    return NextResponse.json({ error: "Les paris sont clôturés sur ce match." }, { status: 400 });
  }

  const selection = match.selections.find((s) => s.key === selectionKey);
  if (!selection) {
    return NextResponse.json({ error: "Pronostic invalide." }, { status: 400 });
  }

  const result = await db.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: me.id } });
    if (!user || user.balance < stake) return null; // solde insuffisant

    await tx.user.update({
      where: { id: me.id },
      data: { balance: { decrement: stake } },
    });
    const bet = await tx.bet.create({
      data: {
        userId: me.id,
        matchId: match.id,
        matchLabel: `${match.home.name} — ${match.away.name}`,
        selectionKey: selection.key,
        selectionLabel: selection.label,
        stake,
        oddsAtBet: selection.odds,
        status: "pending",
      },
    });
    return { bet, balance: user.balance - stake };
  });

  if (!result) {
    return NextResponse.json({ error: "Pas assez de cookies." }, { status: 400 });
  }

  return NextResponse.json(
    { bet: toDomainBet(result.bet), balance: result.balance },
    { status: 201 },
  );
}
