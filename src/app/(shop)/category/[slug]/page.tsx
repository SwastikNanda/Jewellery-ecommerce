import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.charAt(0).toUpperCase() + slug.slice(1);
  return { title: `${title} Collection` };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let category;
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  try {
    category = await prisma.category.findUnique({ where: { slug } });
    if (!category) notFound();
    products = await getProducts({ category: slug });
  } catch {
    if (!category) {
      // DB error and no category resolved — treat generically
      category = { name: slug, description: null, imageUrl: null } as never;
    }
  }

  const c = category!;

  return (
    <div>
      <section className="relative h-[44vh] min-h-[320px] overflow-hidden">
        {c.imageUrl && (
          <Image
            src={c.imageUrl}
            alt={c.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-charcoal/45" />
        <div className="container-page relative flex h-full flex-col items-center justify-center text-center text-ivory">
          <p className="text-xs uppercase tracking-[0.3em] text-ivory/80">
            Collection
          </p>
          <h1 className="mt-3 font-serif text-5xl capitalize md:text-6xl">
            {c.name}
          </h1>
          {c.description && (
            <p className="mt-4 max-w-xl text-ivory/85">{c.description}</p>
          )}
        </div>
      </section>

      <div className="container-page py-14">
        <p className="mb-8 text-sm text-stone">{products.length} pieces</p>
        <ProductGrid
          products={products}
          empty="This collection is being curated. Check back soon."
        />
      </div>
    </div>
  );
}
