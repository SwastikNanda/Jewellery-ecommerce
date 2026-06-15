import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Plus,
  Store,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { Logo } from "@/components/ui/Logo";

export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/products/new", label: "Add product", icon: Plus },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/admin");
  if (session.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen bg-cream/40">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-ivory p-6 md:flex">
        <Logo />
        <nav className="mt-10 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-charcoal transition hover:bg-cream"
            >
              <Icon size={17} className="text-stone" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-line pt-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-stone hover:text-champagne"
          >
            <Store size={16} /> View store
          </Link>
          <p className="mt-3 text-xs text-stone">{session.email}</p>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-line bg-ivory/80 px-6 py-4 backdrop-blur md:hidden">
          <Logo />
          <nav className="flex gap-3 text-xs">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="text-charcoal">
                {n.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
