import { Home, Ticket, Trophy, Store, User } from "lucide-react";

/** Source unique des entrées de navigation (header desktop + bottom nav mobile). */
export const NAV_ITEMS = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/mes-paris", label: "Mes paris", icon: Ticket },
  { href: "/classement", label: "Classement", icon: Trophy },
  { href: "/boutique", label: "Boutique", icon: Store },
  { href: "/profil", label: "Profil", icon: User },
] as const;
