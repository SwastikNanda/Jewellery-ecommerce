import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import type { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const ALLOWED: OrderStatus[] = ["PENDING", "PAID", "FULFILLED", "CANCELLED"];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (session?.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { status } = await req.json();
  if (!ALLOWED.includes(status))
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  await prisma.order.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true });
}
