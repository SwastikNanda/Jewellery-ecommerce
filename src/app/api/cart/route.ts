import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getCartLines } from "@/lib/cart";
import { cartItemSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

async function requireUserId() {
  const session = await getSession();
  return session?.userId ?? null;
}

export async function GET() {
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ items: await getCartLines(userId) });
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = cartItemSchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { productId, quantity } = parsed.data;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product)
    return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  const desired = (existing?.quantity ?? 0) + quantity;
  if (desired > product.stock)
    return NextResponse.json(
      { error: `Only ${product.stock} in stock` },
      { status: 400 },
    );

  await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    create: { userId, productId, quantity },
    update: { quantity: desired },
  });

  return NextResponse.json({ items: await getCartLines(userId) });
}

export async function PATCH(req: Request) {
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = cartItemSchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { productId, quantity } = parsed.data;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product)
    return NextResponse.json({ error: "Product not found" }, { status: 404 });

  if (quantity > product.stock)
    return NextResponse.json(
      { error: `Only ${product.stock} in stock` },
      { status: 400 },
    );

  await prisma.cartItem.update({
    where: { userId_productId: { userId, productId } },
    data: { quantity },
  });

  return NextResponse.json({ items: await getCartLines(userId) });
}

export async function DELETE(req: Request) {
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const productId = new URL(req.url).searchParams.get("productId");
  if (!productId)
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });

  await prisma.cartItem
    .delete({ where: { userId_productId: { userId, productId } } })
    .catch(() => null);

  return NextResponse.json({ items: await getCartLines(userId) });
}
