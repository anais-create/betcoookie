/** POST /api/auth/login — vérifie les identifiants et ouvre une session. */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";
import { toDomainUser } from "@/data/api";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  const user = await db.user.findUnique({ where: { email } });
  // Message générique pour ne pas révéler si l'email existe.
  const invalid = NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
  if (!user) return invalid;

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return invalid;

  await createSession(user.id);
  return NextResponse.json({ user: toDomainUser(user) });
}
