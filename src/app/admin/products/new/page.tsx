import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl text-charcoal">Add product</h1>
      <p className="mb-8 text-sm text-stone">
        Create a new piece for your catalogue.
      </p>
      <ProductForm categories={categories} />
    </div>
  );
}
