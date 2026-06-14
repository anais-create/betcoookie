import { api } from "@/data/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";

export default async function ClassementPage() {
  const entries = await api.getLeaderboard();

  return (
    <div>
      <PageHeader
        title="Classement"
        emoji="🏆"
        subtitle="Les parieurs les plus gourmands de la semaine."
      />
      <Leaderboard entries={entries} />
    </div>
  );
}
