"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, Lock } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const [loading, setLoading] = useState(false);

  async function checkout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Checkout failed");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
        <ShoppingBag size={40} className="text-stone/50" />
        <h1 className="mt-6 font-serif text-3xl text-charcoal">
          Your cart is empty
        </h1>
        <p className="mt-2 text-stone">
          Discover something you&apos;ll treasure.
        </p>
        <Button asChild variant="primary" size="lg" className="mt-8">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  const shipping = 0;

  return (
    <div className="container-page py-12">
      <h1 className="mb-10 font-serif text-4xl text-charcoal">Your cart</h1>
      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-line">
          {items.map((item) => (
            <li key={item.id} className="flex gap-5 py-6">
              <Link
                href={`/product/${item.slug}`}
                className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-cream"
              >
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                )}
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-serif text-lg text-charcoal hover:text-champagne"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-stone hover:text-red-600"
                    aria-label="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="mt-1 text-sm text-champagne-dark">
                  {formatPrice(item.price, item.currency)}
                </p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border border-line">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                      }
                      className="flex h-9 w-9 items-center justify-center text-charcoal"
                      aria-label="Decrease"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          Math.min(item.stock, item.quantity + 1),
                        )
                      }
                      disabled={item.quantity >= item.stock}
                      className="flex h-9 w-9 items-center justify-center text-charcoal disabled:opacity-40"
                      aria-label="Increase"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-sm font-medium text-charcoal">
                    {formatPrice(item.price * item.quantity, item.currency)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-line bg-cream/40 p-7">
          <h2 className="font-serif text-xl text-charcoal">Order summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone">Subtotal</dt>
              <dd className="text-charcoal">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone">Shipping</dt>
              <dd className="text-charcoal">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-medium">
              <dt className="text-charcoal">Total</dt>
              <dd className="text-charcoal">{formatPrice(subtotal + shipping)}</dd>
            </div>
          </dl>
          <Button
            onClick={checkout}
            disabled={loading}
            variant="primary"
            size="lg"
            className="mt-7 w-full"
          >
            <Lock size={16} />
            {loading ? "Redirecting…" : "Secure checkout"}
          </Button>
          <p className="mt-4 text-center text-xs text-stone">
            Encrypted checkout powered by Stripe
          </p>
        </aside>
      </div>
    </div>
  );
}
