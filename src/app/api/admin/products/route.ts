import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getSession();
  if (session?.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = productSchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );

  const d = parsed.data;
  let slug = slugify(d.name);
  // Ensure slug uniqueness.
  if (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const product = await prisma.product.create({
    data: {
      name: d.name,
      slug,
      description: d.description,
      price: d.price,
      currency: d.currency,
      images: JSON.stringify(d.images),
      material: d.material || null,
      accessory: d.accessory,
      stock: d.stock,
      featured: d.featured,
      categoryId: d.categoryId,
    },
  });

  return NextResponse.json({ ok: true, id: product.id });
}
