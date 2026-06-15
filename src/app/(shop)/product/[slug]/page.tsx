import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { getProductBySlug, getProducts } from "@/lib/products";
import { parseImages, formatPrice } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductGrid } from "@/components/product/ProductGrid";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (product)
      return {
        title: product.name,
        description: product.description.slice(0, 150),
      };
  } catch {
    /* ignore */
  }
  return { title: "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) notFound();

  const session = await getSession();
  const images = parseImages(product.images);
  const related = await getProducts({ category: product.category.slug })
    .then((p) => p.filter((x) => x.id !== product.id).slice(0, 4))
    .catch(() => []);

  return (
    <div className="container-page py-10">
      <nav className="mb-8 text-xs uppercase tracking-wider text-stone">
        <Link href="/shop" className="hover:text-champagne">Shop</Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${product.category.slug}`} className="capitalize hover:text-champagne">
          {product.category.name}
        </Link>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <ProductGallery images={images} name={product.name} />

        <div className="lg:py-6">
          <p className="text-xs uppercase tracking-[0.2em] text-champagne-dark">
            {product.accessory}
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-charcoal">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl text-charcoal">
            {formatPrice(product.price, product.currency)}
          </p>
          {product.material && (
            <p className="mt-2 text-sm text-stone">{product.material}</p>
          )}

          <p className="mt-6 leading-relaxed text-stone">
            {product.description}
          </p>

          <div className="mt-8">
            <ProductActions
              productId={product.id}
              stock={product.stock}
              authenticated={Boolean(session)}
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 border-t border-line pt-8 sm:grid-cols-3">
            {[
              { icon: Truck, label: "Free insured shipping" },
              { icon: RotateCcw, label: "30-day returns" },
              { icon: ShieldCheck, label: "Lifetime warranty" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-stone">
                <Icon size={18} className="text-champagne" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-10 text-center font-serif text-3xl text-charcoal">
            You may also love
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
