import { prisma } from "@/lib/prisma";

/** Mark an order paid, decrement stock, and clear the buyer's cart. Idempotent. */
export async function fulfillOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order || order.status === "PAID" || order.status === "FULFILLED") return;

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    });
    for (const item of order.items) {
      if (item.productId) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }
    await tx.cartItem.deleteMany({ where: { userId: order.userId } });
  });
}
