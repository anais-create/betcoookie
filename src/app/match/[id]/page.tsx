import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { api } from "@/data/api";
import { Card } from "@/components/ui/Card";
import { MatchMeta } from "@/components/betting/MatchMeta";
import { TeamRow } from "@/components/betting/TeamRow";
import { BetForm } from "@/components/betting/BetForm";
import type { SelectionKey } from "@/data/types";

export default async function MatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sel?: string }>;
}) {
  const { id } = await params;
  const { sel } = await searchParams;
  const match = await api.getMatch(id);
  if (!match) notFound();

  const initialSelection = match.selections.some((s) => s.key === sel)
    ? (sel as SelectionKey)
    : undefined;

  return (
    <div>
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-choc-chip/70 hover:text-choc-chip"
      >
        <ArrowLeft size={16} /> Retour aux matchs
      </Link>

      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        {/* Infos match */}
        <Card className="flex flex-col gap-5 p-6">
          <MatchMeta match={match} />
          <TeamRow match={match} className="py-2" />
          <div className="rounded-2xl bg-cookie-dough/60 p-4 text-sm text-choc-chip/80">
            <p className="font-semibold text-choc-chip">À propos de ce match</p>
            <p className="mt-1">
              {match.competition} — {match.home.name} reçoit {match.away.name}. Les cotes
              ci-contre sont en cookies : à toi de flairer le bon pronostic ! 🍪
            </p>
          </div>
        </Card>

        {/* Formulaire de mise — panneau latéral sticky sur desktop */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <BetForm match={match} initialSelection={initialSelection} />
        </div>
      </div>
    </div>
  );
}
