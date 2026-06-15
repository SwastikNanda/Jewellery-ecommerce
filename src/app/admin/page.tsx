import Link from "next/link";
import { Package, ShoppingCart, IndianRupee, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, orderCount, userCount, paidOrders, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.findMany({
        where: { status: { in: ["PAID", "FULFILLED"] } },
        select: { total: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { items: true },
      }),
    ]);

  const revenue = paidOrders.reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: "Revenue", value: formatPrice(revenue), icon: IndianRupee },
    { label: "Orders", value: orderCount.toString(), icon: ShoppingCart },
    { label: "Products", value: productCount.toString(), icon: Package },
    { label: "Customers", value: userCount.toString(), icon: Users },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal">Dashboard</h1>
      <p className="mt-1 text-sm text-stone">
        An overview of your store&apos;s performance.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-line bg-ivory p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-stone">
                {label}
              </span>
              <Icon size={18} className="text-champagne" />
            </div>
            <p className="mt-3 font-serif text-3xl text-charcoal">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-charcoal">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="text-xs uppercase tracking-wider text-champagne-dark underline"
          >
            View all
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line bg-ivory">
          <table className="w-full text-sm">
            <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-stone">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-stone">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-line/60 last:border-0">
                    <td className="px-5 py-3 font-medium text-charcoal">
                      #{o.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3 text-stone">{o.email}</td>
                    <td className="px-5 py-3 text-stone">{o.items.length}</td>
                    <td className="px-5 py-3 text-charcoal">
                      {formatPrice(o.total, o.currency)}
                    </td>
                    <td className="px-5 py-3 text-stone">{o.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
