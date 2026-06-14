import Link from "next/link";
import { api } from "@/data/api";
import { MatchList } from "@/components/betting/MatchList";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function HomePage() {
  const matches = await api.getSportsMatches();

  return (
    <div>
      {/* Hero gourmand */}
      <section className="mb-6 overflow-hidden rounded-3xl bg-choc-chip p-6 text-cream shadow-soft sm:p-8">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
              Mise tes cookies sur le sport 🍪
            </h1>
            <p className="mt-2 max-w-md text-cream/80">
              Parie en monnaie virtuelle, grimpe au classement et réclame ton bonus
              quotidien. Zéro euro, 100 % gourmandise.
            </p>
            <Link
              href="/boutique"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-caramel px-5 py-2.5 font-semibold text-choc-dark transition-colors hover:bg-cookie-dough"
            >
              Récupérer des cookies →
            </Link>
          </div>
          <span className="hidden text-7xl sm:block" aria-hidden>
            🍪
          </span>
        </div>
      </section>

      <PageHeader title="Matchs à parier" subtitle="Choisis ton match et place ta mise." />
      <MatchList matches={matches} />
    </div>
  );
}
