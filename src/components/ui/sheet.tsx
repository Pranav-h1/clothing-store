"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/format";
import { Icon } from "./icon";

type Side = "right" | "left" | "center" | "bottom";

const panel: Record<Side, { base: string; hidden: string }> = {
  right: {
    base: "ml-auto h-dvh max-h-dvh w-full max-w-[28rem] sm:rounded-l-3xl",
    hidden: "translate-x-full",
  },
  left: {
    base: "mr-auto h-dvh max-h-dvh w-[88vw] max-w-[24rem] rounded-r-3xl",
    hidden: "-translate-x-full",
  },
  center: {
    base: "m-auto max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-3xl rounded-3xl",
    hidden: "translate-y-3 scale-[0.98] opacity-0",
  },
  bottom: {
    base: "mt-auto max-h-[88dvh] w-full rounded-t-3xl",
    hidden: "translate-y-full",
  },
};

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Visually hide the title (still announced to screen readers). */
  hideTitle?: boolean;
  side?: Side;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

/**
 * Accessible modal built on the native <dialog>: focus is trapped, Escape
 * closes it, focus returns to the trigger, and page scroll is locked.
 */
export function Sheet({ open, onClose, title, hideTitle, side = "right", children, footer, className }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  // `entered` flips on the frame after opening so the panel can transition in.
  const [entered, setEntered] = useState(false);
  const visible = open && entered;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
      document.documentElement.style.overflow = "hidden";
      const frame = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(frame);
    }
    // Let the exit transition finish before closing the native dialog.
    const timer = window.setTimeout(() => {
      setEntered(false);
      if (dialog.open) dialog.close();
      document.documentElement.style.overflow = "";
    }, 260);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => () => void (document.documentElement.style.overflow = ""), []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={cn(
        "fixed inset-0 m-0 flex h-dvh max-h-none w-screen max-w-none overflow-hidden bg-transparent p-0 not-open:hidden backdrop:transition-opacity backdrop:duration-300",
        side === "center" && "p-4",
        visible ? "backdrop:opacity-100" : "backdrop:opacity-0",
      )}
    >
      <div
        className={cn(
          "relative flex flex-col overflow-hidden bg-surface shadow-overlay transition-[transform,opacity] duration-300 ease-(--ease-out-soft)",
          panel[side].base,
          !visible && panel[side].hidden,
          className,
        )}
      >
        <header
          className={cn(
            "flex items-center justify-between gap-4 px-6 pt-5 pb-4",
            hideTitle && "absolute top-0 right-0 z-10 p-3",
          )}
        >
          <h2 id={titleId} className={cn("font-display text-2xl", hideTitle && "sr-only")}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "-mr-2 flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-sand",
              hideTitle && "m-0 bg-surface/90 shadow-soft",
            )}
            aria-label="Close"
          >
            <Icon name="close" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer && (
          <div className="border-t border-line px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>
        )}
      </div>
    </dialog>
  );
}
