export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  image: string | null;
  accessory: string;
  categoryName?: string;
  stock: number;
  featured?: boolean;
};
