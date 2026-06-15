import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { fulfillOrder } from "@/lib/orders";
import { parseImages } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Line = {
  productId: string;
  name: string;
  unitPrice: number;
  currency: string;
  quantity: number;
  image: string | null;
};

export async function POST(req: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const buyNowId: string | undefined = body.productId;
  const buyNowQty: number = Math.max(1, Number(body.quantity) || 1);

  // Build order lines from either "buy now" or the persisted cart.
  let lines: Line[] = [];

  if (buyNowId) {
    const product = await prisma.product.findUnique({
      where: { id: buyNowId },
    });
    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    if (product.stock < buyNowQty)
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    lines = [
      {
        productId: product.id,
        name: product.name,
        unitPrice: product.price,
        currency: product.currency,
        quantity: buyNowQty,
        image: parseImages(product.images)[0] ?? null,
      },
    ];
  } else {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.userId },
      include: { product: true },
    });
    if (cartItems.length === 0)
      return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
    lines = cartItems.map((c) => ({
      productId: c.productId,
      name: c.product.name,
      unitPrice: c.product.price,
      currency: c.product.currency,
      quantity: c.quantity,
      image: parseImages(c.product.images)[0] ?? null,
    }));
  }

  const currency = lines[0]?.currency ?? "INR";
  const total = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId: session.userId,
      email: session.email,
      total,
      currency,
      status: "PENDING",
      items: {
        create: lines.map((l) => ({
          productId: l.productId,
          name: l.name,
          unitPrice: l.unitPrice,
          quantity: l.quantity,
          imageUrl: l.image,
        })),
      },
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // If Stripe keys aren't configured, simulate a successful payment so the
  // flow remains usable in local/demo environments.
  if (!isStripeConfigured()) {
    await fulfillOrder(order.id);
    return NextResponse.json({
      url: `${appUrl}/checkout/success?order=${order.id}&simulated=1`,
      simulated: true,
    });
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lines.map((l) => ({
      quantity: l.quantity,
      price_data: {
        currency: currency.toLowerCase(),
        unit_amount: l.unitPrice,
        product_data: {
          name: l.name,
          images: l.image ? [l.image] : undefined,
        },
      },
    })),
    customer_email: session.email,
    metadata: { orderId: order.id, buyNow: buyNowId ? "1" : "0" },
    success_url: `${appUrl}/checkout/success?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/cart?cancelled=1`,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: checkout.id },
  });

  return NextResponse.json({ url: checkout.url });
}
