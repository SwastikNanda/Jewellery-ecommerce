import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { RefreshCart } from "./RefreshCart";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  const session = await getSession();
  if (!session) redirect("/login");
  if (!orderId) redirect("/");

  const order = await prisma.order
    .findFirst({
      where: { id: orderId, userId: session.userId },
      include: { items: true },
    })
    .catch(() => null);

  if (!order) redirect("/");

  const paid = order.status === "PAID" || order.status === "FULFILLED";

  return (
    <div className="container-page max-w-2xl py-20 text-center">
      <RefreshCart />
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-champagne/15">
        {paid ? (
          <CheckCircle2 size={34} className="text-champagne-dark" />
        ) : (
          <Clock size={34} className="text-champagne-dark" />
        )}
      </div>
      <h1 className="mt-6 font-serif text-4xl text-charcoal">
        {paid ? "Thank you for your order" : "Your order is processing"}
      </h1>
      <p className="mt-3 text-stone">
        {paid
          ? "A confirmation has been sent to your email. We can't wait for you to wear it."
          : "We're confirming your payment — this only takes a moment."}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wider text-stone">
        Order #{order.id.slice(-8).toUpperCase()}
      </p>

      <div className="mt-10 rounded-2xl border border-line bg-cream/40 p-6 text-left">
        <ul className="divide-y divide-line">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-4">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-cream">
                {item.imageUrl && (
                  <Image src={item.imageUrl} alt={item.name} fill sizes="56px" className="object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-charcoal">{item.name}</p>
                <p className="text-xs text-stone">Qty {item.quantity}</p>
              </div>
              <p className="text-sm text-charcoal">
                {formatPrice(item.unitPrice * item.quantity, order.currency)}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-line pt-4 text-base font-medium">
          <span className="text-charcoal">Total</span>
          <span className="text-charcoal">
            {formatPrice(order.total, order.currency)}
          </span>
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-4">
        <Button asChild variant="outline" size="lg">
          <Link href="/account">View my orders</Link>
        </Button>
        <Button asChild variant="primary" size="lg">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
