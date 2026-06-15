"use client";

import { useEffect } from "react";
import { useCart } from "@/components/providers/CartProvider";

export function RefreshCart() {
  const { refresh } = useCart();
  useEffect(() => {
    refresh();
  }, [refresh]);
  return null;
}
