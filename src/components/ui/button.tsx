import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/format";
import { Spinner } from "./spinner";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "light";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 select-none";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-ink-soft shadow-[0_1px_0_rgb(255_255_255/0.08)_inset]",
  secondary: "bg-sand text-ink hover:bg-sand-deep",
  outline: "border border-line-strong bg-transparent text-ink hover:border-ink hover:bg-surface",
  ghost: "text-ink hover:bg-sand",
  danger: "bg-danger text-white hover:bg-danger/90",
  light: "bg-surface/95 text-ink hover:bg-white shadow-soft",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-[15px]",
  icon: "size-11",
};

type Shared = { variant?: Variant; size?: Size; className?: string; children?: ReactNode };

export function buttonClasses({ variant = "primary", size = "md", className }: Shared) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  loading = false,
  children,
  disabled,
  type = "button",
  ...rest
}: Shared & ComponentProps<"button"> & { loading?: boolean }) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Spinner className="absolute" />}
      <span className={cn("inline-flex items-center gap-2", loading && "invisible")}>{children}</span>
    </button>
  );
}

export function ButtonLink({ variant, size, className, children, ...rest }: Shared & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
    </Link>
  );
}
