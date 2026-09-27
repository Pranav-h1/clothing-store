import type { ReactNode } from "react";
import { cn, formatPrice } from "@/lib/format";
import { Icon, type IconName } from "./icon";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "info" | "dark";

const tones: Record<Tone, string> = {
  neutral: "bg-sand text-ink-soft",
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  dark: "bg-ink text-paper",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold tracking-wide uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Price({
  price,
  compareAt,
  className,
  size = "md",
}: {
  price: number;
  compareAt?: number | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const onSale = compareAt != null && compareAt > price;
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2 tabular-nums", className)}>
      <span
        className={cn(
          "font-medium",
          size === "sm" && "text-sm",
          size === "md" && "text-[15px]",
          size === "lg" && "text-xl",
          onSale && "text-accent",
        )}
      >
        {onSale && <span className="sr-only">Sale price </span>}
        {formatPrice(price)}
      </span>
      {onSale && (
        <s className={cn("text-muted", size === "lg" ? "text-base" : "text-[13px]")}>
          <span className="sr-only">Original price </span>
          {formatPrice(compareAt)}
        </s>
      )}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
  className,
}: {
  icon: IconName;
  title: string;
  body?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-16 text-center sm:py-24", className)}>
      <span className="mb-5 flex size-16 items-center justify-center rounded-full bg-sand text-ink-soft">
        <Icon name={icon} size={26} strokeWidth={1.4} />
      </span>
      <h2 className="font-display text-3xl">{title}</h2>
      {body && <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-muted">{body}</p>}
      {action && <div className="mt-7 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  action,
  align = "left",
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="mb-3 eyebrow text-muted">{eyebrow}</p>}
        <Heading className="font-display text-[2.25rem] leading-[1.05] sm:text-5xl">{title}</Heading>
        {body && <p className="mt-3 text-[15px] leading-relaxed text-muted sm:text-base">{body}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("skeleton rounded-xl", className)} />;
}

export function Notice({
  tone = "info",
  icon = "info",
  title,
  children,
  className,
}: {
  tone?: "info" | "warning" | "success" | "danger" | "neutral";
  icon?: IconName;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-3 rounded-2xl p-4 text-[13px] leading-relaxed", tones[tone], className)}>
      <Icon name={icon} size={18} className="mt-px shrink-0" />
      <div>
        {title && <p className="mb-0.5 font-semibold">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}
