import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, ShieldCheck, Gem, Sparkles } from "lucide-react";
import { getFeaturedProducts, getNewArrivals } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

const px = (id: number, w = 1000) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const categories = [
  { slug: "wedding", title: "Wedding", copy: "Forever begins here", img: 13924051 },
  { slug: "vintage", title: "Vintage", copy: "Old-world romance", img: 8003772 },
  { slug: "modern", title: "Modern", copy: "Clean, quiet luxury", img: 3089997 },
  { slug: "aesthetic", title: "Aesthetic", copy: "Soft & dreamy", img: 8776984 },
];

export default async function HomePage() {
  let featured: Awaited<ReturnType<typeof getFeaturedProducts>> = [];
  let arrivals: Awaited<ReturnType<typeof getNewArrivals>> = [];
  let dbError = false;
  try {
    [featured, arrivals] = await Promise.all([
      getFeaturedProducts(8),
      getNewArrivals(8),
    ]);
  } catch {
    dbError = true;
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden">
        <Image
          src={px(15925159, 1600)}
          alt="Aurelle fine jewellery"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/55 via-charcoal/25 to-transparent" />
        <div className="container-page relative flex h-full flex-col justify-center">
          <div className="max-w-xl fade-in-up">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-ivory/80">
              Aurelle · Est. 2026
            </p>
            <h1 className="font-serif text-5xl leading-[1.05] text-ivory text-balance sm:text-6xl md:text-7xl">
              Jewellery for life&apos;s quiet, radiant moments
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/85">
              Ethically crafted, heirloom-quality pieces — designed to be worn
              today and treasured for generations.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button asChild variant="primary" size="lg">
                <Link href="/shop">
                  Shop the collection <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-ivory/60 text-ivory hover:bg-ivory hover:text-charcoal">
                <Link href="/category/wedding">Bridal</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-line bg-cream/50">
        <div className="container-page grid grid-cols-2 gap-6 py-8 text-center md:grid-cols-4">
          {[
            { icon: Gem, label: "Ethically sourced" },
            { icon: ShieldCheck, label: "Lifetime warranty" },
            { icon: Truck, label: "Free insured shipping" },
            { icon: Sparkles, label: "Hallmarked & certified" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon size={22} className="text-champagne" />
              <span className="text-xs uppercase tracking-wider text-stone">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by category */}
      <section className="container-page py-20">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-champagne-dark">
            Curated collections
          </p>
          <h2 className="mt-3 font-serif text-4xl text-charcoal">
            Shop by category
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
            >
              <Image
                src={px(c.img, 700)}
                alt={c.title}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
                <p className="text-[11px] uppercase tracking-[0.2em] text-ivory/80">
                  {c.copy}
                </p>
                <h3 className="mt-1 font-serif text-2xl">{c.title}</h3>
                <span className="mt-2 inline-flex items-center gap-1 text-xs uppercase tracking-wider text-ivory/90 opacity-0 transition-opacity group-hover:opacity-100">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container-page py-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-champagne-dark">
              Hand-picked
            </p>
            <h2 className="mt-3 font-serif text-4xl text-charcoal">
              Featured pieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden items-center gap-1 text-sm uppercase tracking-wider text-charcoal hover:text-champagne sm:flex"
          >
            View all <ArrowRight size={15} />
          </Link>
        </div>
        <ProductGrid
          products={featured.length ? featured : arrivals}
          empty={
            dbError ? (
              <SeedHint />
            ) : (
              <SeedHint />
            )
          }
        />
      </section>

      {/* Editorial banner */}
      <section className="relative my-20 h-[60vh] min-h-[420px] overflow-hidden">
        <Image
          src={px(6243548, 1600)}
          alt="The Aurelle atelier"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/45" />
        <div className="container-page relative flex h-full flex-col items-center justify-center text-center text-ivory">
          <h2 className="max-w-2xl font-serif text-4xl leading-tight text-balance md:text-5xl">
            Crafted by hand, in small batches, with intention
          </h2>
          <p className="mt-5 max-w-xl text-ivory/85">
            Every Aurelle piece is made to order by master artisans using
            recycled gold and conflict-free stones.
          </p>
          <Button asChild variant="primary" size="lg" className="mt-8">
            <Link href="/shop">Discover our craft</Link>
          </Button>
        </div>
      </section>

      {/* New arrivals */}
      <section className="container-page pb-8">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-champagne-dark">
            Fresh from the atelier
          </p>
          <h2 className="mt-3 font-serif text-4xl text-charcoal">New arrivals</h2>
        </div>
        <ProductGrid products={arrivals} empty={<SeedHint />} />
      </section>
    </>
  );
}

function SeedHint() {
  return (
    <div className="mx-auto max-w-md">
      <p className="mb-3">The catalogue is empty.</p>
      <p className="text-sm">
        Run <code className="rounded bg-cream px-1.5 py-0.5">npm run db:seed</code>{" "}
        to load the demo collection, or add pieces from the admin panel.
      </p>
    </div>
  );
}
