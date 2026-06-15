import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Share2, AtSign, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-cream/60">
      <div className="container-page grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone">
            Heirloom-quality jewellery, ethically crafted to be treasured for
            generations.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal">
            Shop
          </h4>
          <ul className="space-y-2.5 text-sm text-stone">
            <li><Link href="/category/wedding" className="hover:text-champagne">Wedding</Link></li>
            <li><Link href="/category/vintage" className="hover:text-champagne">Vintage</Link></li>
            <li><Link href="/category/modern" className="hover:text-champagne">Modern</Link></li>
            <li><Link href="/category/aesthetic" className="hover:text-champagne">Aesthetic</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal">
            Company
          </h4>
          <ul className="space-y-2.5 text-sm text-stone">
            <li><Link href="/shop" className="hover:text-champagne">All Pieces</Link></li>
            <li><Link href="/account" className="hover:text-champagne">My Account</Link></li>
            <li><span className="cursor-default">Our Story</span></li>
            <li><span className="cursor-default">Craftsmanship</span></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal">
            Stay in touch
          </h4>
          <p className="mb-4 text-sm text-stone">
            Join our list for private previews and new arrivals.
          </p>
          <div className="flex gap-3 text-stone">
            <a href="#" aria-label="Instagram" className="hover:text-champagne"><AtSign size={18} /></a>
            <a href="#" aria-label="Facebook" className="hover:text-champagne"><Share2 size={18} /></a>
            <a href="#" aria-label="Newsletter" className="hover:text-champagne"><Send size={18} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-stone sm:flex-row">
          <p>© {new Date().getFullYear()} Aurelle Fine Jewellery. All rights reserved.</p>
          <p>Crafted with care · Secure checkout by Stripe</p>
        </div>
      </div>
    </footer>
  );
}
