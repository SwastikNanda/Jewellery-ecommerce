import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal">Orders</h1>
      <p className="mt-1 text-sm text-stone">{orders.length} total orders.</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-ivory">
        <table className="w-full text-sm">
          <thead className="border-b border-line text-left text-xs uppercase tracking-wider text-stone">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-stone">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b border-line/60 align-top last:border-0">
                  <td className="px-5 py-4 font-medium text-charcoal">
                    #{o.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-5 py-4 text-stone">
                    <p className="text-charcoal">{o.user?.name ?? "—"}</p>
                    <p className="text-xs">{o.email}</p>
                  </td>
                  <td className="px-5 py-4 text-stone">
                    {o.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-stone">
                    {o.items.map((i) => (
                      <p key={i.id} className="text-xs">
                        {i.name} × {i.quantity}
                      </p>
                    ))}
                  </td>
                  <td className="px-5 py-4 text-charcoal">
                    {formatPrice(o.total, o.currency)}
                  </td>
                  <td className="px-5 py-4">
                    <OrderStatusSelect orderId={o.id} current={o.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
