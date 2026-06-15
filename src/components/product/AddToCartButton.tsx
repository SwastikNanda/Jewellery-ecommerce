"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  productId,
  stock,
  className,
  compact = false,
}: {
  productId: string;
  stock: number;
  className?: string;
  compact?: boolean;
}) {
  const { addToCart } = useCart();
  const [busy, setBusy] = useState(false);
  const soldOut = stock <= 0;

  async function handle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    setBusy(true);
    await addToCart(productId, 1);
    setBusy(false);
  }

  if (compact) {
    return (
      <button
        onClick={handle}
        disabled={busy || soldOut}
        aria-label="Add to cart"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-md transition hover:bg-champagne hover:text-white disabled:opacity-50",
          className,
        )}
      >
        <ShoppingBag size={16} />
      </button>
    );
  }

  return (
    <button
      onClick={handle}
      disabled={busy || soldOut}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-charcoal/30 px-6 text-sm font-medium uppercase tracking-wide text-charcoal transition hover:border-charcoal hover:bg-charcoal hover:text-ivory disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <ShoppingBag size={16} />
      {soldOut ? "Sold out" : busy ? "Adding…" : "Add to cart"}
    </button>
  );
}
