"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Search,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useCart } from "@/components/providers/CartProvider";
import { toast } from "sonner";

type NavUser = { name: string; role: string } | null;

const links = [
  { href: "/shop", label: "Shop All" },
  { href: "/category/wedding", label: "Wedding" },
  { href: "/category/vintage", label: "Vintage" },
  { href: "/category/modern", label: "Modern" },
  { href: "/category/aesthetic", label: "Aesthetic" },
];

export function Navbar({ user }: { user: NavUser }) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-ivory/85 backdrop-blur-md">
      <div className="container-page flex h-18 items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Logo />
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-xs font-medium uppercase tracking-[0.15em] transition-colors hover:text-champagne ${
                pathname === l.href ? "text-champagne" : "text-charcoal"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/shop"
            aria-label="Search"
            className="hidden text-charcoal transition-colors hover:text-champagne sm:block"
          >
            <Search size={19} />
          </Link>

          {user ? (
            <div className="group relative">
              <button
                className="flex items-center gap-1.5 text-charcoal transition-colors hover:text-champagne"
                aria-label="Account"
              >
                <UserIcon size={19} />
              </button>
              <div className="invisible absolute right-0 top-full w-52 translate-y-2 rounded-2xl border border-line bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-1 group-hover:opacity-100">
                <p className="px-3 py-2 text-xs text-stone">
                  Hi, <span className="font-medium text-charcoal">{user.name}</span>
                </p>
                <Link
                  href="/account"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-cream"
                >
                  <UserIcon size={16} /> My Account
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-cream"
                  >
                    <LayoutDashboard size={16} /> Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-700 hover:bg-cream"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-charcoal transition-colors hover:text-champagne"
              aria-label="Sign in"
            >
              <UserIcon size={19} />
            </Link>
          )}

          <Link
            href="/cart"
            className="relative text-charcoal transition-colors hover:text-champagne"
            aria-label="Cart"
          >
            <ShoppingBag size={19} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-champagne px-1 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-ivory px-5 py-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm uppercase tracking-wider text-charcoal"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
