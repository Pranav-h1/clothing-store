import type { OrderStatus } from "@/lib/types";
import { Badge } from "./ui/misc";

const tone = {
  pending: "warning",
  paid: "info",
  processing: "info",
  shipped: "accent",
  delivered: "success",
  cancelled: "neutral",
} as const;

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={tone[status]}>{STATUS_LABEL[status]}</Badge>;
}

/** Customer-facing progress: paid → processing → shipped → delivered. */
export function OrderProgress({ status }: { status: OrderStatus }) {
  if (status === "cancelled") return <p className="text-sm text-muted">This order was cancelled.</p>;
  const steps: OrderStatus[] = ["paid", "processing", "shipped", "delivered"];
  const current = status === "pending" ? -1 : steps.indexOf(status);
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Order progress">
      {steps.map((step, i) => (
        <li key={step} aria-current={i === current ? "step" : undefined}>
          <div className={`h-1 rounded-full ${i <= current ? "bg-ink" : "bg-sand-deep"}`} />
          <p className={`mt-2 text-[12px] ${i <= current ? "font-medium text-ink" : "text-muted"}`}>
            {STATUS_LABEL[step]}
          </p>
        </li>
      ))}
    </ol>
  );
}
