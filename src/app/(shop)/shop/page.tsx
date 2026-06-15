import { Suspense } from "react";
import type { Metadata } from "next";
import {
  getProducts,
  getAccessoryTypes,
  getCategories,
  type ShopFilters as Filters,
} from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ShopFilters } from "@/components/product/ShopFilters";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse the full Aurelle collection of fine jewellery.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const filters: Filters = {
    category: sp.category,
    accessory: sp.accessory,
    q: sp.q,
    sort: (sp.sort as Filters["sort"]) ?? "newest",
  };

  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let accessories: string[] = [];
  let categories: { slug: string; name: string }[] = [];
  try {
    [products, accessories, categories] = await Promise.all([
      getProducts(filters),
      getAccessoryTypes(),
      getCategories(),
    ]);
  } catch {
    /* DB unavailable — render empty state */
  }

  return (
    <div className="container-page py-12">
      <header className="mb-10 border-b border-line pb-8 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-champagne-dark">
          The collection
        </p>
        <h1 className="mt-3 font-serif text-4xl text-charcoal md:text-5xl">
          {sp.q ? `Results for “${sp.q}”` : "Shop all jewellery"}
        </h1>
        <p className="mt-3 text-sm text-stone">{products.length} pieces</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <Suspense>
          <ShopFilters accessories={accessories} categories={categories} />
        </Suspense>
        <ProductGrid
          products={products}
          empty="No pieces match your filters yet."
        />
      </div>
    </div>
  );
}
