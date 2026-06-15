"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

const sorts = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function ShopFilters({
  accessories,
  categories,
}: {
  accessories: string[];
  categories: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.push(`${pathname}?${next.toString()}`);
    },
    [params, pathname, router],
  );

  const current = (k: string) => params.get(k) ?? "";

  return (
    <aside className="space-y-8">
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal">
          Search
        </h3>
        <input
          defaultValue={current("q")}
          placeholder="Search pieces…"
          onKeyDown={(e) => {
            if (e.key === "Enter")
              setParam("q", (e.target as HTMLInputElement).value || null);
          }}
          className="h-11 w-full rounded-xl border border-line bg-white/70 px-4 text-sm focus:border-champagne focus:outline-none"
        />
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal">
          Collection
        </h3>
        <ul className="space-y-1.5 text-sm">
          <li>
            <button
              onClick={() => setParam("category", null)}
              className={!current("category") ? "text-champagne" : "text-stone hover:text-charcoal"}
            >
              All collections
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <button
                onClick={() => setParam("category", c.slug)}
                className={
                  current("category") === c.slug
                    ? "text-champagne"
                    : "text-stone hover:text-charcoal"
                }
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal">
          Type
        </h3>
        <ul className="space-y-1.5 text-sm">
          <li>
            <button
              onClick={() => setParam("accessory", null)}
              className={!current("accessory") ? "text-champagne" : "text-stone hover:text-charcoal"}
            >
              All types
            </button>
          </li>
          {accessories.map((a) => (
            <li key={a}>
              <button
                onClick={() => setParam("accessory", a)}
                className={
                  current("accessory") === a
                    ? "text-champagne"
                    : "text-stone hover:text-charcoal"
                }
              >
                {a}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal">
          Sort by
        </h3>
        <select
          value={current("sort") || "newest"}
          onChange={(e) => setParam("sort", e.target.value)}
          className="h-11 w-full rounded-xl border border-line bg-white/70 px-3 text-sm focus:border-champagne focus:outline-none"
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {(current("q") || current("category") || current("accessory")) && (
        <button
          onClick={() => router.push(pathname)}
          className="text-xs uppercase tracking-wider text-champagne-dark underline"
        >
          Clear all filters
        </button>
      )}
    </aside>
  );
}
