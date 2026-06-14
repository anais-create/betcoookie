/**
 * Authentification — hash de mot de passe (scrypt natif, zéro dépendance) et
 * sessions opaques stockées en base, transportées par un cookie httpOnly.
 *
 * Serveur uniquement : utilise `cookies()` de next/headers, donc appelable
 * seulement depuis des Route Handlers / Server Components.
 */
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import type { User as DbUser } from "@prisma/client";
import { db } from "@/lib/db";

const scryptAsync = promisify(scrypt);

const KEYLEN = 64;
const SALT_BYTES = 16;

/** Hash un mot de passe → "salt:hash" (hex). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES).toString("hex");
  const derived = (await scryptAsync(password, salt, KEYLEN)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

/** Vérifie un mot de passe contre un hash "salt:hash". Comparaison constante. */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;
  const derived = (await scryptAsync(password, salt, KEYLEN)) as Buffer;
  const expected = Buffer.from(hashHex, "hex");
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

export const SESSION_COOKIE = "bet-cookie-session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 jours

/**
 * Crée une session en base et pose le cookie httpOnly.
 * À n'appeler que depuis un Route Handler (écriture de cookie).
 */
export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.session.create({ data: { id: token, userId, expiresAt } });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

/** Détruit la session courante (ligne en base + cookie). */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.deleteMany({ where: { id: token } });
    store.delete(SESSION_COOKIE);
  }
}

/**
 * Renvoie l'utilisateur connecté, ou null. Lit le cookie → session valide → user.
 * Purge une session expirée au passage.
 */
export async function getCurrentUser(): Promise<DbUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { id: token },
    include: { user: true },
  });
  if (!session) return null;

  if (session.expiresAt.getTime() < Date.now()) {
    await db.session.deleteMany({ where: { id: token } });
    return null;
  }
  return session.user;
}
