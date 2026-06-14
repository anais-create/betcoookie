/**
 * Source de données réelle : The Odds API (https://the-odds-api.com).
 *
 * Récupère les matchs + cotes 1N2 (marché "h2h") d'une compétition de foot et
 * les traduit vers le type `Match` du domaine. Tourne UNIQUEMENT côté serveur :
 * la clé est lue dans `process.env.ODDS_API_KEY` (sans préfixe NEXT_PUBLIC),
 * donc jamais exposée au navigateur.
 *
 * En cas d'erreur réseau ou de réponse vide (ex. intersaison Ligue 1),
 * renvoie un tableau vide — c'est l'appelant qui décide du fallback.
 */
import type { Match, Selection } from "@/data/types";

/** Forme brute renvoyée par The Odds API pour l'endpoint /odds. */
interface OddsEvent {
  id: string;
  sport_title: string;
  commence_time: string; // ISO
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    markets: Array<{
      key: string; // "h2h" pour le 1N2
      outcomes: Array<{ name: string; price: number }>;
    }>;
  }>;
}

const SPORT_KEY = process.env.ODDS_SPORT_KEY || "soccer_france_ligue_one";
const API_BASE = "https://api.the-odds-api.com/v4";

/** Bookmakers préférés (ordre de priorité) pour choisir les cotes affichées. */
const PREFERRED_BOOKMAKERS = ["pinnacle", "marathonbet", "betfair_ex_eu"];

/** Palette de couleurs servant à générer le logo SVG (crest + monogramme), comme les mocks. */
const PRIMARIES = ["#c8102e", "#0a2240", "#007a33", "#6cabdd", "#a50044", "#cb3524", "#161616", "#00529f"];
const SECONDARIES = ["#f1bf00", "#ffffff", "#fec524", "#1c2c5b", "#00b2a9", "#e30613"];

/** Hash déterministe → une équipe a toujours les mêmes couleurs. */
function pickColors(name: string): { primary: string; secondary: string } {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  const h = Math.abs(hash);
  return {
    primary: PRIMARIES[h % PRIMARIES.length],
    secondary: SECONDARIES[(h >> 3) % SECONDARIES.length],
  };
}

/** Code court 3 lettres pour les écrans compacts (ex. "Germany" → "GER"). */
function deriveShort(name: string): string {
  const cleaned = name.replace(/[^A-Za-zÀ-ÿ ]/g, "").trim();
  return cleaned.slice(0, 3).toUpperCase();
}

/** L'endpoint /odds ne renvoie que des matchs à venir ou en cours. */
function deriveStatus(commenceTime: string): Match["status"] {
  return new Date(commenceTime).getTime() <= Date.now() ? "live" : "upcoming";
}

/** Choisit le meilleur bookmaker dispo et en extrait le marché 1N2. */
function buildSelections(event: OddsEvent): Selection[] {
  const bookmaker =
    PREFERRED_BOOKMAKERS.map((k) => event.bookmakers.find((b) => b.key === k)).find(
      Boolean,
    ) ?? event.bookmakers[0];

  const h2h = bookmaker?.markets.find((m) => m.key === "h2h");
  if (!h2h) return [];

  const priceOf = (predicate: (name: string) => boolean) =>
    h2h.outcomes.find((o) => predicate(o.name))?.price;

  const home = priceOf((n) => n === event.home_team);
  const away = priceOf((n) => n === event.away_team);
  const draw = priceOf((n) => n.toLowerCase() === "draw");

  const selections: Selection[] = [];
  if (home != null) selections.push({ key: "home", label: event.home_team, odds: home });
  if (draw != null) selections.push({ key: "draw", label: "Match nul", odds: draw });
  if (away != null) selections.push({ key: "away", label: event.away_team, odds: away });
  return selections;
}

/** Traduit un événement The Odds API vers le type `Match` du domaine. */
function toMatch(event: OddsEvent): Match {
  return {
    id: event.id,
    sport: "football",
    competition: event.sport_title,
    startTime: event.commence_time,
    status: deriveStatus(event.commence_time),
    home: {
      name: event.home_team,
      short: deriveShort(event.home_team),
      colors: pickColors(event.home_team),
    },
    away: {
      name: event.away_team,
      short: deriveShort(event.away_team),
      colors: pickColors(event.away_team),
    },
    selections: buildSelections(event),
  };
}

/**
 * Récupère les matchs de la compétition configurée, cotes comprises.
 * Renvoie `[]` si la clé manque, si l'API échoue, ou s'il n'y a aucun match.
 * Réponse mise en cache ~10 min pour rester large sous le quota gratuit.
 */
export async function fetchOddsMatches(): Promise<Match[]> {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    console.warn("[bet-cookie] ODDS_API_KEY absente — fallback sur les mocks.");
    return [];
  }

  const url =
    `${API_BASE}/sports/${SPORT_KEY}/odds/` +
    `?regions=eu&markets=h2h&oddsFormat=decimal&apiKey=${apiKey}`;

  try {
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) {
      console.warn(`[bet-cookie] The Odds API ${res.status} — fallback sur les mocks.`);
      return [];
    }
    const events = (await res.json()) as OddsEvent[];
    return events
      .map(toMatch)
      // On écarte les matchs sans cote exploitable.
      .filter((m) => m.selections.length > 0);
  } catch (err) {
    console.warn("[bet-cookie] The Odds API injoignable — fallback sur les mocks.", err);
    return [];
  }
}
