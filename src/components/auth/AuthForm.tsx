"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { useWallet } from "@/store/wallet";

type Mode = "login" | "register";

/** Formulaire d'auth réel : POST /api/auth/{login,register}, puis hydrate le wallet. */
export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { refresh } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isRegister = mode === "register";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = isRegister
      ? {
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? ""),
        }
      : {
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? ""),
        };

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }
      // Le cookie de session est posé par la réponse ; on recharge l'état wallet.
      await refresh();
      const from = new URLSearchParams(window.location.search).get("from");
      router.push(from && from.startsWith("/") ? from : "/");
    } catch {
      setError("Réseau indisponible. Réessaie.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-6 py-8">
      <Logo />
      <Card className="w-full p-6">
        <h1 className="font-display text-2xl font-extrabold text-choc-chip">
          {isRegister ? "Crée ton compte 🍪" : "Content de te revoir 🍪"}
        </h1>
        <p className="mt-1 text-sm text-choc-chip/70">
          {isRegister
            ? "Reçois 1 000 cookies offerts pour démarrer."
            : "Connecte-toi pour retrouver tes cookies."}
        </p>

        <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
          {isRegister && (
            <Field label="Pseudo" name="name" type="text" placeholder="CookieMonster" required minLength={2} />
          )}
          <Field label="Email" name="email" type="email" placeholder="toi@cookie.fr" required />
          <Field
            label="Mot de passe"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={6}
          />
          {error && <p className="text-sm font-medium text-berry-loss">{error}</p>}
          <Button type="submit" fullWidth size="lg" disabled={loading} className="mt-2">
            {loading ? "Un instant…" : isRegister ? "Créer mon compte" : "Se connecter"}
          </Button>
        </form>
      </Card>

      <p className="text-sm text-choc-chip/70">
        {isRegister ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="font-semibold text-caramel hover:underline"
        >
          {isRegister ? "Se connecter" : "S’inscrire"}
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-semibold text-choc-chip/80">{label}</span>
      <input
        {...props}
        className="rounded-2xl border border-cookie-base/40 bg-cream px-4 py-2.5 text-base text-choc-chip outline-none transition-colors focus:border-caramel"
      />
    </label>
  );
}
