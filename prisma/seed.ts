import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Verified Pexels jewellery photo IDs (stable public image URLs).
const IMG = [
  13924051, 10862233, 7514818, 29080968, 15925159, 8003772, 6467703, 9645737,
  3089997, 8776984, 20601213, 5500088, 21787515, 12526431, 6243548, 33737462,
  34247685, 4735885, 34523447, 37467308, 66354, 12133990, 36347463, 34505711,
  33582433, 32785885, 36697251, 13058959, 20544951, 1437343, 4997548, 6924156,
  20838859, 1697570, 8396318, 32697980, 29566891, 34549909, 8516783, 13813961,
  15960447, 9818318, 15960443, 29544342, 11273738, 17232934, 20175061, 34599417,
  20654848, 30229724, 17833396, 19383239, 8675736, 3091637, 20013420, 30381729,
  28491852, 6248765, 29469392, 4974392,
];

const img = (id: number, w = 1000) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

let cursor = 0;
const pickImages = (n = 2): string[] => {
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    out.push(img(IMG[cursor % IMG.length]));
    cursor++;
  }
  return out;
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type Seed = {
  name: string;
  description: string;
  price: number; // paise
  accessory: string;
  material: string;
  featured?: boolean;
  stock?: number;
};

const collections: Record<string, { meta: { description: string }; items: Seed[] }> = {
  wedding: {
    meta: {
      description:
        "Timeless pieces for the moments you will never forget — bridal sets, eternity bands and statement diamonds.",
    },
    items: [
      { name: "Eternal Vow Diamond Ring", description: "A brilliant solitaire set in 18k recycled gold — the quiet centrepiece of a lifetime promise.", price: 8499900, accessory: "Ring", material: "18k Gold · Diamond", featured: true },
      { name: "Aurora Bridal Necklace", description: "Cascading pavé diamonds on a whisper-fine chain, designed to sit perfectly above any neckline.", price: 6299900, accessory: "Necklace", material: "White Gold · Diamond", featured: true },
      { name: "Promise Eternity Band", description: "A continuous circle of channel-set stones — understated, endlessly elegant.", price: 3899900, accessory: "Ring", material: "Platinum · Diamond" },
      { name: "Veil Drop Earrings", description: "Delicate pear-cut drops that catch the light with every turn of the head.", price: 4599900, accessory: "Earrings", material: "18k Gold · Diamond" },
      { name: "Lumière Tennis Bracelet", description: "A graduated line of round brilliants, hand-set for seamless sparkle.", price: 5499900, accessory: "Bracelet", material: "White Gold · Diamond" },
      { name: "First Light Pendant", description: "A single floating diamond on an adjustable chain — the gentlest of heirlooms.", price: 2799900, accessory: "Pendant", material: "18k Gold · Diamond" },
    ],
  },
  vintage: {
    meta: {
      description:
        "Old-world romance reimagined — filigree, milgrain detailing and warm antique golds.",
    },
    items: [
      { name: "Belle Époque Filigree Ring", description: "Intricate hand-pierced metalwork framing a rose-cut stone, inspired by the 1900s.", price: 3299900, accessory: "Ring", material: "Yellow Gold · Sapphire", featured: true },
      { name: "Heirloom Locket Necklace", description: "An engraved oval locket on a rolo chain — keep someone close, always.", price: 1899900, accessory: "Necklace", material: "Antique Gold" },
      { name: "Art Deco Chandelier Earrings", description: "Geometry and glamour in equal measure, with milgrain edges and onyx accents.", price: 2599900, accessory: "Earrings", material: "Gold · Onyx" },
      { name: "Victorian Cuff Bracelet", description: "A sculpted cuff with scrollwork detailing, reminiscent of a bygone era.", price: 3099900, accessory: "Bracelet", material: "Gold Vermeil" },
      { name: "Estate Garnet Pendant", description: "A deep red garnet cabochon cradled in beaded gold.", price: 1599900, accessory: "Pendant", material: "Gold · Garnet" },
      { name: "Antique Pearl Choker", description: "Hand-knotted freshwater pearls with an ornate vintage clasp.", price: 2199900, accessory: "Necklace", material: "Pearl · Gold" },
    ],
  },
  modern: {
    meta: {
      description:
        "Clean lines and architectural forms for the contemporary wardrobe.",
    },
    items: [
      { name: "Linea Minimal Band", description: "A single sweep of polished gold — the everyday ring, perfected.", price: 1299900, accessory: "Ring", material: "14k Gold", featured: true },
      { name: "Axis Bar Necklace", description: "A floating horizontal bar on a fine cable chain — quietly architectural.", price: 1099900, accessory: "Necklace", material: "14k Gold" },
      { name: "Orbit Hoop Earrings", description: "Sculptural endless hoops with a brushed matte finish.", price: 999900, accessory: "Earrings", material: "Gold Vermeil" },
      { name: "Meridian Chain Bracelet", description: "A bold flat-link chain that wears like a second skin.", price: 1799900, accessory: "Bracelet", material: "18k Gold" },
      { name: "Facet Signet Ring", description: "A faceted dome signet, reimagined for the modern hand.", price: 1499900, accessory: "Ring", material: "Sterling Silver" },
      { name: "Prism Drop Pendant", description: "A geometric crystal prism suspended on a slim chain.", price: 1199900, accessory: "Pendant", material: "Gold · Quartz" },
    ],
  },
  aesthetic: {
    meta: {
      description:
        "Soft, dreamy and effortlessly photogenic — pieces made to be layered and loved.",
    },
    items: [
      { name: "Celestial Star Studs", description: "Tiny twinkling star studs for the everyday celestial dreamer.", price: 699900, accessory: "Earrings", material: "Gold · Crystal", featured: true },
      { name: "Pearl Drop Layering Necklace", description: "A single baroque pearl on a dainty chain, made for stacking.", price: 899900, accessory: "Necklace", material: "Pearl · Gold" },
      { name: "Butterfly Whisper Ring", description: "A delicate butterfly perched on an open band — soft and romantic.", price: 749900, accessory: "Ring", material: "Rose Gold" },
      { name: "Moonstone Charm Bracelet", description: "Glowing moonstone beads with a tiny gold charm.", price: 829900, accessory: "Bracelet", material: "Gold · Moonstone" },
      { name: "Dainty Coin Anklet", description: "A sun-kissed coin charm on a barely-there anklet.", price: 599900, accessory: "Anklet", material: "Gold Vermeil" },
      { name: "Petal Huggie Hoops", description: "Petite huggie hoops with a soft petal silhouette.", price: 679900, accessory: "Earrings", material: "14k Gold" },
    ],
  },
};

const categoryImages: Record<string, number> = {
  wedding: 13924051,
  vintage: 8003772,
  modern: 3089997,
  aesthetic: 8776984,
};

async function main() {
  console.log("🌱 Seeding Aurelle…");

  // --- Admin + demo customer ---
  const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? "admin@aurelle.com").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin@123";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: {
      name: "Aurelle Admin",
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 12),
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@aurelle.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@aurelle.com",
      password: await bcrypt.hash("Customer@123", 12),
      role: "USER",
    },
  });

  // --- Categories + products ---
  for (const [slug, data] of Object.entries(collections)) {
    const name = slug.charAt(0).toUpperCase() + slug.slice(1);
    const category = await prisma.category.upsert({
      where: { slug },
      update: { description: data.meta.description, imageUrl: img(categoryImages[slug], 900) },
      create: {
        name,
        slug,
        description: data.meta.description,
        imageUrl: img(categoryImages[slug], 900),
      },
    });

    for (const item of data.items) {
      const pslug = slugify(item.name);
      await prisma.product.upsert({
        where: { slug: pslug },
        update: {
          price: item.price,
          stock: item.stock ?? 12,
          categoryId: category.id,
        },
        create: {
          name: item.name,
          slug: pslug,
          description: item.description,
          price: item.price,
          currency: "INR",
          images: JSON.stringify(pickImages(2)),
          material: item.material,
          accessory: item.accessory,
          stock: item.stock ?? 12,
          featured: item.featured ?? false,
          categoryId: category.id,
        },
      });
    }
    console.log(`  ✓ ${name} (${data.items.length} pieces)`);
  }

  console.log("✅ Seed complete.");
  console.log(`   Admin login: ${adminEmail} / ${adminPassword}`);
  console.log("   Customer login: customer@aurelle.com / Customer@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
