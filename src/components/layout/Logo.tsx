import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex shrink-0 items-center gap-2", className)}>
      <span className="grid size-8 place-items-center rounded-2xl bg-choc-chip text-lg shadow-soft sm:size-9 sm:text-xl">
        🍪
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight text-choc-chip sm:text-2xl">
        Bet<span className="text-caramel">Cookie</span>
      </span>
    </Link>
  );
}
