import { prisma } from "@/lib/prisma";
import { parseImages } from "@/lib/utils";
import type { ProductCardData } from "@/lib/types";
import type { Prisma } from "@prisma/client";

type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

export function toCardData(p: ProductWithCategory): ProductCardData {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    currency: p.currency,
    image: parseImages(p.images)[0] ?? null,
    accessory: p.accessory,
    categoryName: p.category?.name,
    stock: p.stock,
    featured: p.featured,
  };
}

export async function getFeaturedProducts(limit = 8) {
  const products = await prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return products.map(toCardData);
}

export async function getNewArrivals(limit = 8) {
  const products = await prisma.product.findMany({
    include: { category: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return products.map(toCardData);
}

export type ShopFilters = {
  category?: string;
  accessory?: string;
  q?: string;
  sort?: "newest" | "price-asc" | "price-desc";
  minPrice?: number;
  maxPrice?: number;
};

export async function getProducts(filters: ShopFilters = {}) {
  const where: Prisma.ProductWhereInput = {};
  if (filters.category) where.category = { slug: filters.category };
  if (filters.accessory) where.accessory = filters.accessory;
  if (filters.q)
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
      { accessory: { contains: filters.q, mode: "insensitive" } },
    ];
  if (filters.minPrice != null || filters.maxPrice != null) {
    where.price = {};
    if (filters.minPrice != null) where.price.gte = filters.minPrice;
    if (filters.maxPrice != null) where.price.lte = filters.maxPrice;
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "price-asc"
      ? { price: "asc" }
      : filters.sort === "price-desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy,
  });
  return products.map(toCardData);
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function getAccessoryTypes(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    distinct: ["accessory"],
    select: { accessory: true },
    orderBy: { accessory: "asc" },
  });
  return rows.map((r) => r.accessory);
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}
