"use client";

import { OrderCard } from "@/components/account/order-card";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import { useCurrentUser } from "@/lib/auth/customer-auth";
import { useOrders } from "@/lib/stores/orders";

export default function AccountOrdersPage() {
  const user = useCurrentUser();
  const orders = useOrders();
  if (!user) return null;
  const mine = orders.filter((o) => o.customer.email.toLowerCase() === user.email);

  return (
    <section aria-labelledby="orders-title">
      <h2 id="orders-title" className="mb-6 font-display text-4xl">
        My orders
      </h2>
      {mine.length === 0 ? (
        <div className="rounded-3xl border border-line bg-surface">
          <EmptyState
            icon="receipt"
            title="No orders yet"
            body={`Orders placed with ${user.email} will show up here, with live status updates.`}
            action={<ButtonLink href="/shop">Start shopping</ButtonLink>}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {mine.map((o, i) => (
            <OrderCard key={o.id} order={o} defaultOpen={i === 0} />
          ))}
        </div>
      )}
    </section>
  );
}
