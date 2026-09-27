import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/format";
import { Icon } from "./icon";

export function Breadcrumbs({ items, className }: { items: { label: string; href?: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-[13px] text-muted", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <Fragment key={item.label}>
            {i > 0 && (
              <li aria-hidden="true" className="flex">
                <Icon name="chevron-right" size={12} />
              </li>
            )}
            <li
              className={cn(!item.href && "max-w-[16rem] truncate text-ink")}
              aria-current={item.href ? undefined : "page"}
            >
              {item.href ? (
                <Link href={item.href} className="transition-colors hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
