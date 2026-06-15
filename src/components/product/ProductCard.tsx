import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { ProductCardData } from "@/lib/types";
import { AddToCartButton } from "@/components/product/AddToCartButton";

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block fade-in-up"
    >
      <div className="hover-lift relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-stone">
            No image
          </div>
        )}

        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-champagne-dark">
            Featured
          </span>
        )}
        {product.stock <= 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-charcoal/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-ivory">
            Sold out
          </span>
        )}

        <div className="absolute bottom-3 right-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <AddToCartButton productId={product.id} stock={product.stock} compact />
        </div>
      </div>

      <div className="mt-4 px-1">
        <p className="text-[11px] uppercase tracking-[0.18em] text-stone">
          {product.accessory}
        </p>
        <h3 className="mt-1 font-serif text-lg leading-snug text-charcoal">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-champagne-dark">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </Link>
  );
}
