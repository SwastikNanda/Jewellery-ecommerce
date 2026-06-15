"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/providers/CartProvider";

export function ProductActions({
  productId,
  stock,
  authenticated,
}: {
  productId: string;
  stock: number;
  authenticated: boolean;
}) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState<"cart" | "buy" | null>(null);
  const soldOut = stock <= 0;

  async function handleAdd() {
    setBusy("cart");
    await addToCart(productId, qty);
    setBusy(null);
  }

  async function handleBuyNow() {
    if (!authenticated) {
      toast.error("Please sign in to continue.");
      router.push(`/login?redirect=/product`);
      return;
    }
    setBusy("buy");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: qty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Checkout failed");
      setBusy(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <span className="text-xs font-medium uppercase tracking-wider text-stone">
          Quantity
        </span>
        <div className="flex items-center rounded-full border border-line">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={soldOut}
            className="flex h-10 w-10 items-center justify-center text-charcoal disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus size={15} />
          </button>
          <span className="w-10 text-center text-sm">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(stock, q + 1))}
            disabled={soldOut || qty >= stock}
            className="flex h-10 w-10 items-center justify-center text-charcoal disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus size={15} />
          </button>
        </div>
        <span className="text-xs text-stone">
          {soldOut ? "Out of stock" : `${stock} available`}
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleAdd}
          disabled={soldOut || busy !== null}
          className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-full border border-charcoal/40 text-sm font-medium uppercase tracking-wide text-charcoal transition hover:bg-charcoal hover:text-ivory disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingBag size={17} />
          {busy === "cart" ? "Adding…" : "Add to cart"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={soldOut || busy !== null}
          className="inline-flex h-13 flex-1 items-center justify-center rounded-full bg-champagne text-sm font-medium uppercase tracking-wide text-white transition hover:bg-champagne-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy === "buy" ? "Redirecting…" : soldOut ? "Sold out" : "Buy now"}
        </button>
      </div>
    </div>
  );
}
