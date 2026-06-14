/**
 * POST /api/wallet/claim — crédite un pack de la boutique.
 * Le montant vient du pack serveur (jamais du client). Le bonus quotidien
 * n'est réclamable qu'une fois par jour, vérifié côté serveur.
 */
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { SHOP_PACKS } from "@/data/mock/user";

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export async function POST(request: Request) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  let body: { packId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const pack = SHOP_PACKS.find((p) => p.id === body.packId);
  if (!pack) return NextResponse.json({ error: "Pack inconnu." }, { status: 400 });

  if (pack.kind === "daily" && me.lastDailyClaim && isSameDay(me.lastDailyClaim, new Date())) {
    return NextResponse.json({ error: "Bonus quotidien déjà réclamé aujourd'hui." }, { status: 400 });
  }

  const user = await db.user.update({
    where: { id: me.id },
    data: {
      balance: { increment: pack.amount },
      ...(pack.kind === "daily" ? { lastDailyClaim: new Date() } : {}),
    },
  });

  return NextResponse.json({
    balance: user.balance,
    lastDailyClaim: user.lastDailyClaim ? user.lastDailyClaim.toISOString() : null,
  });
}
