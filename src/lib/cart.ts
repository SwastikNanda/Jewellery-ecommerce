import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/utils";
import type { CartLine } from "@/components/providers/CartProvider";

export async function getCartLines(userId: string): Promise<CartLine[]> {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });

  return items.map((item) => {
    const images = parseImages(item.product.images);
    return {
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      price: item.product.price,
      currency: item.product.currency,
      image: images[0] ?? null,
      stock: item.product.stock,
      quantity: item.quantity,
    };
  });
}
