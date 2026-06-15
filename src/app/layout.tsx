import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { CartProvider } from "@/components/providers/CartProvider";
import { getSession } from "@/lib/auth";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aurelle · Fine Jewellery",
    template: "%s · Aurelle",
  },
  description:
    "Aurelle — heirloom-quality fine jewellery. Shop wedding, vintage, modern and aesthetic collections of rings, necklaces, earrings and more.",
  keywords: [
    "jewellery",
    "fine jewelry",
    "wedding rings",
    "vintage jewellery",
    "necklaces",
    "earrings",
  ],
  openGraph: {
    title: "Aurelle · Fine Jewellery",
    description: "Heirloom-quality fine jewellery, ethically crafted.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <CartProvider authenticated={Boolean(session)}>
          {children}
        </CartProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#2e2a26",
              color: "#faf7f2",
              border: "none",
            },
          }}
        />
      </body>
    </html>
  );
}
