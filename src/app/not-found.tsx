import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <span className="text-7xl">🍪</span>
      <h1 className="font-display text-3xl font-extrabold text-choc-chip">
        Miette introuvable
      </h1>
      <p className="max-w-sm text-choc-chip/70">
        Cette page a été grignotée. Retourne miser tes cookies sur de vrais matchs !
      </p>
      <Link href="/">
        <Button size="lg">Retour à l’accueil</Button>
      </Link>
    </div>
  );
}
