import { ProductCard } from "@/components/product/ProductCard";
import type { ProductCardData } from "@/lib/types";

export function ProductGrid({
  products,
  empty,
}: {
  products: ProductCardData[];
  empty?: React.ReactNode;
}) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-stone">
        {empty ?? "No pieces found."}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
