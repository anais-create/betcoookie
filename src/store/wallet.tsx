"use client";

/**
 * Wallet store — miroir client de l'état de session détenu par le backend.
 *
 * Le backend fait foi : le solde, les paris et le bonus quotidien vivent en base
 * (Prisma/SQLite) et transitent par les Route Handlers sous /api. Ce provider
 * hydrate l'état au montage via GET /api/me, puis chaque mutation (placer un pari,
 * réclamer un pack, régler) appelle l'API et applique la réponse autoritative.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Bet, Match, SelectionKey, SessionState, User } from "@/data/types";

interface PlaceBetInput {
  match: Match;
  selectionKey: SelectionKey;
  selectionLabel: string;
  odds: number;
  stake: number;
}

interface WalletContextValue {
  user: User | null;
  balance: number;
  bets: Bet[];
  loading: boolean;
  dailyClaimedToday: boolean;
  placeBet: (input: PlaceBetInput) => Promise<{ ok: boolean; error?: string }>;
  claim: (packId: string) => Promise<{ ok: boolean; error?: string }>;
  settle: () => Promise<number>;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

const EMPTY: SessionState = { user: null, bets: [], lastDailyClaim: null };

function isSameDay(iso: string): boolean {
  const last = new Date(iso);
  const now = new Date();
  return (
    last.getFullYear() === now.getFullYear() &&
    last.getMonth() === now.getMonth() &&
    last.getDate() === now.getDate()
  );
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionState>(EMPTY);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (res.ok) setSession((await res.json()) as SessionState);
    } catch {
      /* hors-ligne : on garde l'état courant */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const placeBet = useCallback<WalletContextValue["placeBet"]>(async (input) => {
    try {
      const res = await fetch("/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId: input.match.id,
          selectionKey: input.selectionKey,
          stake: input.stake,
        }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error as string };
      setSession((s) =>
        s.user
          ? { ...s, bets: [data.bet as Bet, ...s.bets], user: { ...s.user, balance: data.balance } }
          : s,
      );
      return { ok: true };
    } catch {
      return { ok: false, error: "Réseau indisponible." };
    }
  }, []);

  const claim = useCallback<WalletContextValue["claim"]>(async (packId) => {
    try {
      const res = await fetch("/api/wallet/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.error as string };
      setSession((s) =>
        s.user
          ? { ...s, user: { ...s.user, balance: data.balance }, lastDailyClaim: data.lastDailyClaim }
          : s,
      );
      return { ok: true };
    } catch {
      return { ok: false, error: "Réseau indisponible." };
    }
  }, []);

  const settle = useCallback<WalletContextValue["settle"]>(async () => {
    const res = await fetch("/api/bets/settle", { method: "POST" });
    const data = await res.json();
    await refresh();
    return (data?.balance as number) ?? session.user?.balance ?? 0;
  }, [refresh, session.user?.balance]);

  const logout = useCallback<WalletContextValue["logout"]>(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession(EMPTY);
  }, []);

  const dailyClaimedToday = useMemo(
    () => (session.lastDailyClaim ? isSameDay(session.lastDailyClaim) : false),
    [session.lastDailyClaim],
  );

  const value = useMemo<WalletContextValue>(
    () => ({
      user: session.user,
      balance: session.user?.balance ?? 0,
      bets: session.bets,
      loading,
      dailyClaimedToday,
      placeBet,
      claim,
      settle,
      refresh,
      logout,
    }),
    [session, loading, dailyClaimedToday, placeBet, claim, settle, refresh, logout],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet doit être utilisé dans <WalletProvider>");
  return ctx;
}
