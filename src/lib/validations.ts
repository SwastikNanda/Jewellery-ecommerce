import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const productSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(10).max(2000),
  price: z.coerce.number().int().min(0, "Price must be positive"),
  currency: z.string().default("INR"),
  images: z.array(z.string().url("Each image must be a valid URL")).min(1),
  material: z.string().max(120).optional().or(z.literal("")),
  accessory: z.string().min(2).max(60),
  stock: z.coerce.number().int().min(0),
  featured: z.coerce.boolean().default(false),
  categoryId: z.string().min(1, "Category is required"),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(99),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
