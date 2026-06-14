/**
 * POST /api/bets/settle — règle les paris en attente du visiteur dont le match
 * est terminé (gagné → crédite mise × cote, perdu → rien), puis renvoie le solde.
 */
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { settleBetsForUser } from "@/lib/betting";

export async function POST() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { settled, balance } = await settleBetsForUser(me.id);
  return NextResponse.json({ settledCount: settled.length, balance });
}
