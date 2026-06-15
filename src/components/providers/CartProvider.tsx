"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type CartLine = {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  image: string | null;
  stock: number;
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  count: number;
  subtotal: number;
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
  authenticated,
}: {
  children: React.ReactNode;
  authenticated: boolean;
}) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const refresh = useCallback(async () => {
    if (!authenticated) return;
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      /* network error — keep current state */
    }
  }, [authenticated]);

  useEffect(() => {
    if (!authenticated) return;
    let active = true;
    fetch("/api/cart", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data) setItems(data.items ?? []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [authenticated]);

  const requireAuth = useCallback(() => {
    if (!authenticated) {
      toast.error("Please sign in to use your cart.");
      router.push("/login?redirect=/cart");
      return false;
    }
    return true;
  }, [authenticated, router]);

  const addToCart = useCallback(
    async (productId: string, quantity = 1) => {
      if (!requireAuth()) return;
      setLoading(true);
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? "Could not add to cart");
        }
        const data = await res.json();
        setItems(data.items ?? []);
        toast.success("Added to your cart");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [requireAuth],
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (!requireAuth()) return;
      setLoading(true);
      try {
        const res = await fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        });
        const data = await res.json();
        setItems(data.items ?? []);
      } catch {
        toast.error("Could not update quantity");
      } finally {
        setLoading(false);
      }
    },
    [requireAuth],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (!requireAuth()) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/cart?productId=${productId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        setItems(data.items ?? []);
        toast.success("Removed from cart");
      } catch {
        toast.error("Could not remove item");
      } finally {
        setLoading(false);
      }
    },
    [requireAuth],
  );

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
