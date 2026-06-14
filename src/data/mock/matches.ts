import type { Match, Team } from "@/data/types";

/**
 * Catalogue de matchs mockés — calé sur le dimanche 14 juin 2026, ~12h08 CEST (10h08 UTC).
 *
 * - Football  → Coupe du Monde 2026 (USA/Canada/Mexique). Matchs en soirée CEST (heures nord-américaines).
 * - Basket    → NBA Finals 2026. Matchs la nuit CEST (heures US). Logos = crests ESPN.
 * - Tennis    → saison sur gazon (Queen's, Halle, Berlin, Stuttgart). En journée → live à midi un dimanche.
 *
 * Statuts cohérents avec « maintenant » : seul le tennis de la mi-journée est `live`,
 * le foot et la NBA d'aujourd'hui sont `upcoming` (soir/nuit), le reste est `finished` (avec score).
 * Forme identique à la réponse API → remplaçable sans toucher à l'UI.
 */

/** Drapeau national haute déf via flagcdn (ex. "fr", "gb-eng"). */
const flag = (iso: string) => `https://flagcdn.com/w160/${iso}.png`;
/** Logo de franchise NBA via le CDN ESPN (abréviation en minuscules : "bos", "okc"…). */
const nba = (abbr: string) => `https://a.espncdn.com/i/teamlogos/nba/500/${abbr}.png`;

// ── Sélections nationales (Coupe du Monde) ───────────────────────────────────
const FRANCE: Team = { name: "France", short: "FRA", colors: { primary: "#0055A4", secondary: "#EF4135" }, logo: flag("fr") };
const CROATIE: Team = { name: "Croatie", short: "CRO", colors: { primary: "#FF0000", secondary: "#171796" }, logo: flag("hr") };
const BRESIL: Team = { name: "Brésil", short: "BRA", colors: { primary: "#009739", secondary: "#FFDF00" }, logo: flag("br") };
const SERBIE: Team = { name: "Serbie", short: "SRB", colors: { primary: "#C6363C", secondary: "#0C4076" }, logo: flag("rs") };
const URUGUAY: Team = { name: "Uruguay", short: "URU", colors: { primary: "#4F9CD6", secondary: "#001489" }, logo: flag("uy") };
const ARGENTINE: Team = { name: "Argentine", short: "ARG", colors: { primary: "#75AADB", secondary: "#ffffff" }, logo: flag("ar") };
const MEXIQUE: Team = { name: "Mexique", short: "MEX", colors: { primary: "#006847", secondary: "#CE1126" }, logo: flag("mx") };
const ANGLETERRE: Team = { name: "Angleterre", short: "ENG", colors: { primary: "#ffffff", secondary: "#CF081F" }, logo: flag("gb-eng") };
const PAYS_BAS: Team = { name: "Pays-Bas", short: "NED", colors: { primary: "#F36C21", secondary: "#21468B" }, logo: flag("nl") };
const PORTUGAL: Team = { name: "Portugal", short: "POR", colors: { primary: "#006600", secondary: "#FF0000" }, logo: flag("pt") };
const ALLEMAGNE: Team = { name: "Allemagne", short: "GER", colors: { primary: "#000000", secondary: "#DD0000" }, logo: flag("de") };
const MAROC: Team = { name: "Maroc", short: "MAR", colors: { primary: "#006233", secondary: "#C1272D" }, logo: flag("ma") };
const ESPAGNE: Team = { name: "Espagne", short: "ESP", colors: { primary: "#AA151B", secondary: "#F1BF00" }, logo: flag("es") };
const ITALIE: Team = { name: "Italie", short: "ITA", colors: { primary: "#009246", secondary: "#CE2B37" }, logo: flag("it") };
const USA: Team = { name: "États-Unis", short: "USA", colors: { primary: "#3C3B6E", secondary: "#B22234" }, logo: flag("us") };
const CANADA: Team = { name: "Canada", short: "CAN", colors: { primary: "#D52B1E", secondary: "#ffffff" }, logo: flag("ca") };
const BELGIQUE: Team = { name: "Belgique", short: "BEL", colors: { primary: "#FDDA24", secondary: "#000000" }, logo: flag("be") };
const JAPON: Team = { name: "Japon", short: "JPN", colors: { primary: "#BC002D", secondary: "#ffffff" }, logo: flag("jp") };

// ── Franchises NBA ───────────────────────────────────────────────────────────
const THUNDER: Team = { name: "Oklahoma City Thunder", short: "OKC", colors: { primary: "#007AC1", secondary: "#EF3B24" }, logo: nba("okc") };
const CELTICS: Team = { name: "Boston Celtics", short: "BOS", colors: { primary: "#007A33", secondary: "#BB9753" }, logo: nba("bos") };
const PACERS: Team = { name: "Indiana Pacers", short: "IND", colors: { primary: "#002D62", secondary: "#FDBB30" }, logo: nba("ind") };
const NUGGETS: Team = { name: "Denver Nuggets", short: "DEN", colors: { primary: "#0E2240", secondary: "#FEC524" }, logo: nba("den") };

// ── Joueurs de tennis (logo = drapeau du pays) ───────────────────────────────
const ALCARAZ: Team = { name: "Carlos Alcaraz", short: "ALC", colors: { primary: "#AA151B", secondary: "#F1BF00" }, logo: flag("es") };
const SINNER: Team = { name: "Jannik Sinner", short: "SIN", colors: { primary: "#009246", secondary: "#CE2B37" }, logo: flag("it") };
const ZVEREV: Team = { name: "Alexander Zverev", short: "ZVE", colors: { primary: "#000000", secondary: "#DD0000" }, logo: flag("de") };
const DJOKOVIC: Team = { name: "Novak Djokovic", short: "DJO", colors: { primary: "#C6363C", secondary: "#0C4076" }, logo: flag("rs") };
const DRAPER: Team = { name: "Jack Draper", short: "DRA", colors: { primary: "#00247D", secondary: "#CF142B" }, logo: flag("gb-eng") };
const RUNE: Team = { name: "Holger Rune", short: "RUN", colors: { primary: "#C8102E", secondary: "#ffffff" }, logo: flag("dk") };
const FRITZ: Team = { name: "Taylor Fritz", short: "FRI", colors: { primary: "#3C3B6E", secondary: "#B22234" }, logo: flag("us") };
const SWIATEK: Team = { name: "Iga Świątek", short: "SWI", colors: { primary: "#DC143C", secondary: "#ffffff" }, logo: flag("pl") };
const GAUFF: Team = { name: "Coco Gauff", short: "GAU", colors: { primary: "#3C3B6E", secondary: "#B22234" }, logo: flag("us") };

export const MATCHES: Match[] = [
  // ───────── EN DIRECT maintenant (~12h08 CEST) : tennis sur gazon en journée ──────────
  {
    id: "m3",
    sport: "tennis",
    competition: "Queen's · 1/4 de finale",
    startTime: "2026-06-14T10:00:00.000Z", // 12h00 CEST — vient de commencer
    status: "live",
    home: ALCARAZ,
    away: DRAPER,
    selections: [
      { key: "home", label: "Alcaraz", odds: 1.40 },
      { key: "away", label: "Draper", odds: 2.90 },
    ],
  },
  {
    id: "m10",
    sport: "tennis",
    competition: "Queen's · 1/4 de finale",
    startTime: "2026-06-14T09:00:00.000Z", // 11h00 CEST — en cours
    status: "live",
    home: DJOKOVIC,
    away: RUNE,
    selections: [
      { key: "home", label: "Djokovic", odds: 1.85 },
      { key: "away", label: "Rune", odds: 1.95 },
    ],
  },
  {
    id: "m13",
    sport: "tennis",
    competition: "Berlin (WTA) · 1/2 finale",
    startTime: "2026-06-14T09:30:00.000Z", // 11h30 CEST — en cours
    status: "live",
    home: SWIATEK,
    away: GAUFF,
    selections: [
      { key: "home", label: "Świątek", odds: 1.70 },
      { key: "away", label: "Gauff", odds: 2.10 },
    ],
  },

  // ───────── À VENIR aujourd'hui : foot en soirée, NBA cette nuit, tennis plus tard ──────────
  {
    id: "m6",
    sport: "tennis",
    competition: "Halle · 1/2 finale",
    startTime: "2026-06-14T14:30:00.000Z", // 16h30 CEST cet après-midi
    status: "upcoming",
    home: SINNER,
    away: ZVEREV,
    selections: [
      { key: "home", label: "Sinner", odds: 1.50 },
      { key: "away", label: "Zverev", odds: 2.60 },
    ],
  },
  {
    id: "m1",
    sport: "football",
    competition: "Coupe du Monde 2026",
    startTime: "2026-06-14T18:00:00.000Z", // 20h00 CEST ce soir
    status: "upcoming",
    home: ARGENTINE,
    away: MEXIQUE,
    selections: [
      { key: "home", label: "Argentine", odds: 1.55 },
      { key: "draw", label: "Match nul", odds: 4.0 },
      { key: "away", label: "Mexique", odds: 6.0 },
    ],
  },
  {
    id: "m4",
    sport: "football",
    competition: "Coupe du Monde 2026",
    startTime: "2026-06-14T21:00:00.000Z", // 23h00 CEST ce soir
    status: "upcoming",
    home: ANGLETERRE,
    away: PAYS_BAS,
    selections: [
      { key: "home", label: "Angleterre", odds: 2.20 },
      { key: "draw", label: "Match nul", odds: 3.30 },
      { key: "away", label: "Pays-Bas", odds: 3.10 },
    ],
  },
  {
    id: "m2",
    sport: "basket",
    competition: "NBA Finals · Game 6",
    startTime: "2026-06-15T01:00:00.000Z", // 03h00 CEST cette nuit (soirée US)
    status: "upcoming",
    home: THUNDER,
    away: CELTICS,
    selections: [
      { key: "home", label: "Thunder", odds: 1.80 },
      { key: "away", label: "Celtics", odds: 2.00 },
    ],
  },
  {
    id: "m5",
    sport: "football",
    competition: "Coupe du Monde 2026",
    startTime: "2026-06-15T18:00:00.000Z",
    status: "upcoming",
    home: PORTUGAL,
    away: ALLEMAGNE,
    selections: [
      { key: "home", label: "Portugal", odds: 2.60 },
      { key: "draw", label: "Match nul", odds: 3.20 },
      { key: "away", label: "Allemagne", odds: 2.65 },
    ],
  },
  {
    id: "m7",
    sport: "football",
    competition: "Coupe du Monde 2026",
    startTime: "2026-06-15T21:00:00.000Z",
    status: "upcoming",
    home: FRANCE,
    away: MAROC,
    selections: [
      { key: "home", label: "France", odds: 1.65 },
      { key: "draw", label: "Match nul", odds: 3.70 },
      { key: "away", label: "Maroc", odds: 5.00 },
    ],
  },
  {
    id: "m11",
    sport: "football",
    competition: "Coupe du Monde 2026",
    startTime: "2026-06-16T18:00:00.000Z",
    status: "upcoming",
    home: ESPAGNE,
    away: ITALIE,
    selections: [
      { key: "home", label: "Espagne", odds: 2.05 },
      { key: "draw", label: "Match nul", odds: 3.30 },
      { key: "away", label: "Italie", odds: 3.60 },
    ],
  },
  {
    id: "m8",
    sport: "football",
    competition: "Coupe du Monde 2026",
    startTime: "2026-06-16T21:00:00.000Z",
    status: "upcoming",
    home: BRESIL,
    away: URUGUAY,
    selections: [
      { key: "home", label: "Brésil", odds: 1.75 },
      { key: "draw", label: "Match nul", odds: 3.50 },
      { key: "away", label: "Uruguay", odds: 4.50 },
    ],
  },
  {
    id: "m12",
    sport: "football",
    competition: "Coupe du Monde 2026",
    startTime: "2026-06-17T23:00:00.000Z",
    status: "upcoming",
    home: USA,
    away: CANADA,
    selections: [
      { key: "home", label: "États-Unis", odds: 2.30 },
      { key: "draw", label: "Match nul", odds: 3.20 },
      { key: "away", label: "Canada", odds: 3.00 },
    ],
  },
  {
    id: "m9",
    sport: "basket",
    competition: "NBA Finals · Game 7",
    startTime: "2026-06-18T01:00:00.000Z",
    status: "upcoming",
    home: CELTICS,
    away: THUNDER,
    selections: [
      { key: "home", label: "Celtics", odds: 1.95 },
      { key: "away", label: "Thunder", odds: 1.85 },
    ],
  },

  // ───────── TERMINÉS (avec score) ──────────
  {
    id: "m17",
    sport: "basket",
    competition: "NBA Finals · Game 5",
    startTime: "2026-06-13T01:30:00.000Z", // nuit de vendredi à samedi
    status: "finished",
    home: THUNDER,
    away: CELTICS,
    selections: [
      { key: "home", label: "Thunder", odds: 1.65 },
      { key: "away", label: "Celtics", odds: 2.25 },
    ],
    score: { home: 118, away: 110 },
  },
  {
    id: "m16",
    sport: "football",
    competition: "Coupe du Monde 2026",
    startTime: "2026-06-13T18:00:00.000Z", // samedi soir
    status: "finished",
    home: BELGIQUE,
    away: JAPON,
    selections: [
      { key: "home", label: "Belgique", odds: 1.50 },
      { key: "draw", label: "Match nul", odds: 4.00 },
      { key: "away", label: "Japon", odds: 6.50 },
    ],
    score: { home: 1, away: 2 },
  },
  {
    id: "m14",
    sport: "football",
    competition: "Coupe du Monde 2026",
    startTime: "2026-06-12T18:00:00.000Z", // vendredi
    status: "finished",
    home: FRANCE,
    away: CROATIE,
    selections: [
      { key: "home", label: "France", odds: 1.75 },
      { key: "draw", label: "Match nul", odds: 3.50 },
      { key: "away", label: "Croatie", odds: 4.60 },
    ],
    score: { home: 2, away: 1 },
  },
  {
    id: "m15",
    sport: "football",
    competition: "Coupe du Monde 2026",
    startTime: "2026-06-12T21:00:00.000Z", // vendredi soir
    status: "finished",
    home: BRESIL,
    away: SERBIE,
    selections: [
      { key: "home", label: "Brésil", odds: 1.60 },
      { key: "draw", label: "Match nul", odds: 3.80 },
      { key: "away", label: "Serbie", odds: 5.50 },
    ],
    score: { home: 3, away: 0 },
  },
  {
    id: "m18",
    sport: "basket",
    competition: "NBA Finals · Game 4",
    startTime: "2026-06-11T01:30:00.000Z",
    status: "finished",
    home: PACERS,
    away: NUGGETS,
    selections: [
      { key: "home", label: "Pacers", odds: 2.10 },
      { key: "away", label: "Nuggets", odds: 1.72 },
    ],
    score: { home: 104, away: 121 },
  },
  {
    id: "m19",
    sport: "tennis",
    competition: "Stuttgart · Finale",
    startTime: "2026-06-07T13:30:00.000Z", // dimanche précédent (semaine de Stuttgart)
    status: "finished",
    home: SINNER,
    away: FRITZ,
    selections: [
      { key: "home", label: "Sinner", odds: 1.35 },
      { key: "away", label: "Fritz", odds: 3.10 },
    ],
    score: { home: 2, away: 0 },
  },
];
