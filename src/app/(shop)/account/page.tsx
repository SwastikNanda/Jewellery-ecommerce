import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Package, Heart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatPrice, parseImages } from "@/lib/utils";
import { ProductGrid } from "@/components/product/ProductGrid";
import { toCardData } from "@/lib/products";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My Account" };

const statusStyle: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  PAID: "bg-emerald-100 text-emerald-800",
  FULFILLED: "bg-sky-100 text-sky-800",
  CANCELLED: "bg-rose-100 text-rose-700",
};

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/account");

  const [orders, wishlist] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.wishlistItem.findMany({
      where: { userId: session.userId },
      include: { product: { include: { category: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="container-page py-12">
      <header className="mb-10 border-b border-line pb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-champagne-dark">
          My account
        </p>
        <h1 className="mt-3 font-serif text-4xl text-charcoal">
          Hello, {session.name}
        </h1>
        <p className="mt-2 text-sm text-stone">{session.email}</p>
      </header>

      <section className="mb-16">
        <h2 className="mb-6 flex items-center gap-2 font-serif text-2xl text-charcoal">
          <Package size={20} className="text-champagne" /> Order history
        </h2>
        {orders.length === 0 ? (
          <p className="text-stone">
            You haven&apos;t placed any orders yet.{" "}
            <Link href="/shop" className="text-champagne-dark underline">
              Start shopping
            </Link>
            .
          </p>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-line bg-white/50 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-stone">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="mt-1 text-xs text-stone">
                      {order.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyle[order.status] ?? "bg-cream text-stone"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative h-12 w-11 overflow-hidden rounded-lg bg-cream">
                        {item.imageUrl && (
                          <Image src={item.imageUrl} alt={item.name} fill sizes="44px" className="object-cover" />
                        )}
                      </div>
                      <span className="text-sm text-stone">
                        {item.name} × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-right text-sm font-medium text-charcoal">
                  Total {formatPrice(order.total, order.currency)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-6 flex items-center gap-2 font-serif text-2xl text-charcoal">
          <Heart size={20} className="text-champagne" /> Wishlist
        </h2>
        {wishlist.length === 0 ? (
          <p className="text-stone">Your wishlist is empty.</p>
        ) : (
          <ProductGrid
            products={wishlist.map((w) => ({
              ...toCardData(w.product),
              image: parseImages(w.product.images)[0] ?? null,
            }))}
          />
        )}
      </section>
    </div>
  );
}
