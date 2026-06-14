"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useWallet } from "@/store/wallet";
import { formatCookies } from "@/lib/format";
import { cn } from "@/lib/cn";

/** Pastille de solde de cookies, toujours visible, cliquable vers la boutique. */
export function CookieBalance({ className }: { className?: string }) {
  const { balance } = useWallet();
  return (
    <Link
      href="/boutique"
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-cookie-base/40 bg-cream px-3 py-1.5 shadow-soft transition-transform hover:-translate-y-0.5",
        className,
      )}
    >
      <span className="text-lg leading-none" aria-hidden>
        🍪
      </span>
      <span className="font-display text-lg font-bold tabular-nums text-choc-chip">
        {formatCookies(balance)}
      </span>
      <span className="grid size-5 place-items-center rounded-full bg-choc-chip text-cream transition-colors group-hover:bg-choc-dark">
        <Plus size={14} strokeWidth={3} />
      </span>
    </Link>
  );
}
