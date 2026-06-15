"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Category = { id: string; name: string };

export type ProductFormData = {
  id?: string;
  name: string;
  description: string;
  price: number; // rupees (major units) in the form
  images: string[];
  material: string;
  accessory: string;
  stock: number;
  featured: boolean;
  categoryId: string;
};

const accessoryOptions = [
  "Ring",
  "Necklace",
  "Earrings",
  "Bracelet",
  "Pendant",
  "Anklet",
];

export function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: ProductFormData;
}) {
  const router = useRouter();
  const editing = Boolean(initial?.id);
  const [images, setImages] = useState<string[]>(initial?.images ?? [""]);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const cleanImages = images.map((i) => i.trim()).filter(Boolean);

    const payload = {
      name: String(fd.get("name")),
      description: String(fd.get("description")),
      // Convert rupees to paise (minor units).
      price: Math.round(Number(fd.get("price")) * 100),
      currency: "INR",
      images: cleanImages,
      material: String(fd.get("material") ?? ""),
      accessory: String(fd.get("accessory")),
      stock: Number(fd.get("stock")),
      featured: fd.get("featured") === "on",
      categoryId: String(fd.get("categoryId")),
    };

    const url = editing
      ? `/api/admin/products/${initial!.id}`
      : "/api/admin/products";
    const method = editing ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      toast.success(editing ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
      <div>
        <Label htmlFor="name">Product name</Label>
        <Input id="name" name="name" defaultValue={initial?.name} required />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initial?.description}
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={0}
            step="1"
            defaultValue={initial?.price}
            required
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min={0}
            defaultValue={initial?.stock ?? 1}
            required
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="categoryId">Collection</Label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={initial?.categoryId ?? ""}
            required
            className="h-11 w-full rounded-xl border border-line bg-white/70 px-3 text-sm focus:border-champagne focus:outline-none"
          >
            <option value="" disabled>
              Select a collection
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="accessory">Type</Label>
          <select
            id="accessory"
            name="accessory"
            defaultValue={initial?.accessory ?? "Ring"}
            className="h-11 w-full rounded-xl border border-line bg-white/70 px-3 text-sm focus:border-champagne focus:outline-none"
          >
            {accessoryOptions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="material">Material (optional)</Label>
        <Input
          id="material"
          name="material"
          placeholder="18k Gold · Diamond"
          defaultValue={initial?.material}
        />
      </div>

      <div>
        <Label>Image URLs</Label>
        <div className="space-y-3">
          {images.map((image, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={image}
                placeholder="https://…"
                onChange={(e) =>
                  setImages((prev) =>
                    prev.map((v, idx) => (idx === i ? e.target.value : v)),
                  )
                }
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setImages((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line text-stone hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setImages((prev) => [...prev, ""])}
          className="mt-3 inline-flex items-center gap-1 text-xs uppercase tracking-wider text-champagne-dark"
        >
          <Plus size={14} /> Add image
        </button>
        <p className="mt-2 text-xs text-stone">
          Paste hosted image URLs (e.g. a CDN, Cloudinary or Vercel Blob link).
        </p>
      </div>

      <label className="flex items-center gap-3 text-sm text-charcoal">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={initial?.featured}
          className="h-4 w-4 accent-champagne"
        />
        Feature on homepage
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="dark" size="lg" disabled={loading}>
          {loading ? "Saving…" : editing ? "Update product" : "Create product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
