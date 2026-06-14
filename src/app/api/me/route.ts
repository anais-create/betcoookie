/** GET /api/me — instantané de session (user + paris + bonus quotidien) pour le wallet. */
import { NextResponse } from "next/server";
import type { SessionState } from "@/data/types";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { toDomainBet, toDomainUser } from "@/data/api";

export async function GET() {
  const me = await getCurrentUser();
  if (!me) {
    const empty: SessionState = { user: null, bets: [], lastDailyClaim: null };
    return NextResponse.json(empty);
  }

  const bets = await db.bet.findMany({
    where: { userId: me.id },
    orderBy: { placedAt: "desc" },
  });

  const payload: SessionState = {
    user: toDomainUser(me),
    bets: bets.map(toDomainBet),
    lastDailyClaim: me.lastDailyClaim ? me.lastDailyClaim.toISOString() : null,
  };
  return NextResponse.json(payload);
}
