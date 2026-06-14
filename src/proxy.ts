/**
 * Proxy (ex-middleware en Next 16) — protège les routes privées.
 * Vérifie seulement la présence du cookie de session ; la validation réelle
 * (session en base, expiration) se fait dans getCurrentUser() côté serveur.
 * Redirige vers /login en conservant la destination dans ?from=.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Doit rester synchronisé avec SESSION_COOKIE de @/lib/auth.
// Inliné ici car le proxy tourne en edge runtime (pas d'import de modules serveur).
const SESSION_COOKIE = "bet-cookie-session";

const PROTECTED = ["/mes-paris", "/profil", "/boutique"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!isProtected) return NextResponse.next();

  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/mes-paris/:path*", "/profil/:path*", "/boutique/:path*"],
};
