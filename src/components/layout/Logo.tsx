import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid size-9 place-items-center rounded-2xl bg-choc-chip text-xl shadow-soft">
        🍪
      </span>
      <span className="font-display text-2xl font-extrabold tracking-tight text-choc-chip">
        Bet<span className="text-caramel">Cookie</span>
      </span>
    </Link>
  );
}
