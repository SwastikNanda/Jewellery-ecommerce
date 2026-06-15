import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { AuthForm } from "@/components/AuthForm";
import { Logo } from "@/components/ui/Logo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sign in" };

const hero =
  "https://images.pexels.com/photos/8003772/pexels-photo-8003772.jpeg?auto=compress&cs=tinysrgb&w=1200";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image src={hero} alt="Aurelle" fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-charcoal/35" />
        <div className="absolute bottom-12 left-12 text-ivory">
          <h2 className="max-w-sm font-serif text-3xl leading-tight">
            Welcome back to the Aurelle atelier
          </h2>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10">
            <Logo />
          </div>
          <h1 className="font-serif text-3xl text-charcoal">Sign in</h1>
          <p className="mb-8 mt-2 text-sm text-stone">
            Access your cart, orders and wishlist.
          </p>
          <Suspense>
            <AuthForm mode="login" />
          </Suspense>
          <p className="mt-8 text-center text-xs text-stone">
            <Link href="/" className="hover:text-champagne">
              ← Back to store
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
