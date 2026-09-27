"use client";

import Link from "next/link";
import { dismissToast, toastStore } from "@/lib/stores/ui";
import { cn } from "@/lib/format";
import { Icon } from "./icon";

export function Toaster() {
  const toasts = toastStore.use();
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-end sm:px-6 sm:pb-6"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.tone === "error" ? "alert" : "status"}
          className="pointer-events-auto flex w-full max-w-sm animate-rise items-start gap-3 rounded-2xl border border-white/60 p-4 shadow-lift glass"
        >
          <span
            className={cn(
              "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
              t.tone === "success" && "bg-success text-white",
              t.tone === "error" && "bg-danger text-white",
              t.tone === "neutral" && "bg-ink text-paper",
            )}
          >
            <Icon
              name={t.tone === "error" ? "alert" : t.tone === "success" ? "check" : "info"}
              size={14}
              strokeWidth={2}
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink">{t.title}</p>
            {t.description && <p className="mt-0.5 text-[13px] leading-snug text-muted">{t.description}</p>}
            {t.action && (
              <Link
                href={t.action.href}
                onClick={() => dismissToast(t.id)}
                className="mt-2 inline-flex text-[13px] font-medium text-ink underline underline-offset-4 hover:no-underline"
              >
                {t.action.label}
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            className="-m-1 flex size-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-sand hover:text-ink"
            aria-label="Dismiss notification"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
