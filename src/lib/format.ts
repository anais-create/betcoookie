/** Formatage des cookies (monnaie virtuelle), cotes et dates. */

/** Formate un nombre de cookies : 1234 → "1 234". */
export function formatCookies(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(amount));
}

/** Formate une cote décimale : 2 → "2.00". */
export function formatOdds(odds: number): string {
  return odds.toFixed(2);
}

/** Gain potentiel d'une mise (mise incluse). */
export function potentialPayout(stake: number, odds: number): number {
  return Math.round(stake * odds);
}

/** Date d'un match : "sam. 14 juin · 21:00". */
export function formatMatchDate(iso: string): string {
  const d = new Date(iso);
  const day = new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(d);
  const time = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return `${day} · ${time}`;
}

/** Heure courte d'un match : "21:00". */
export function formatMatchTime(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
