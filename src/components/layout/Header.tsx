"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { CookieBalance } from "@/components/layout/CookieBalance";
import { Logo } from "@/components/layout/Logo";
import { useWallet } from "@/store/wallet";
import { cn } from "@/lib/cn";

/** En-tête sticky. Nav inline sur desktop, bottom nav prend le relais sur mobile. */
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useWallet();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-cookie-base/20 bg-cookie-dough/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "bg-choc-chip text-cream"
                    : "text-choc-chip/80 hover:bg-cookie-dough hover:text-choc-chip",
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <>
              <CookieBalance />
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Se déconnecter"
                title="Se déconnecter"
                className="grid size-9 place-items-center rounded-full border border-cookie-base/40 bg-cream text-choc-chip/70 shadow-soft transition-colors hover:text-choc-chip"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : loading ? null : (
            <Link
              href="/login"
              className="inline-flex items-center rounded-2xl bg-choc-chip px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-choc-dark"
            >
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
