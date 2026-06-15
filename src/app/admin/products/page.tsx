import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice, parseImages } from "@/lib/utils";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Products</h1>
          <p className="mt-1 text-sm text-stone">
            {products.length} pieces in your catalogue.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-charcoal px-6 text-sm font-medium uppercase tracking-wide text-ivory transition hover:bg-charcoal/90"
        >
          <Plus size={16} /> Add product
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-ivory">
        <table className="w-full text-sm">
          <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-stone">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Collection</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-stone">
                  No products yet. Add your first piece.
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const img = parseImages(p.images)[0];
                return (
                  <tr key={p.id} className="border-b border-line/60 last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-11 overflow-hidden rounded-lg bg-cream">
                          {img && (
                            <Image src={img} alt={p.name} fill sizes="44px" className="object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">{p.name}</p>
                          <p className="text-xs text-stone">{p.accessory}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 capitalize text-stone">
                      {p.category.name}
                    </td>
                    <td className="px-5 py-3 text-charcoal">
                      {formatPrice(p.price, p.currency)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          p.stock > 0 ? "text-charcoal" : "text-red-600"
                        }
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="text-stone transition hover:text-champagne"
                          aria-label="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                        <DeleteProductButton id={p.id} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
