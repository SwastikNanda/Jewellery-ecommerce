import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/utils";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl text-charcoal">Edit product</h1>
      <p className="mb-8 text-sm text-stone">Update details for {product.name}.</p>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          name: product.name,
          description: product.description,
          // Convert paise back to rupees for the form.
          price: product.price / 100,
          images: parseImages(product.images),
          material: product.material ?? "",
          accessory: product.accessory,
          stock: product.stock,
          featured: product.featured,
          categoryId: product.categoryId,
        }}
      />
    </div>
  );
}
