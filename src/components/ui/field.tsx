"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/format";
import { Icon } from "./icon";

const control =
  "w-full rounded-xl border bg-surface px-4 text-[15px] text-ink placeholder:text-subtle transition-[border-color,box-shadow] duration-150 outline-none focus:border-ink focus:ring-4 focus:ring-ink/8 disabled:bg-sand disabled:text-muted aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/10";

type FieldShellProps = {
  label: string;
  error?: string | null;
  hint?: ReactNode;
  optional?: boolean;
  className?: string;
  hideLabel?: boolean;
  children: (ids: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
};

function FieldShell({ label, error, hint, optional, className, hideLabel, children }: FieldShellProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : null;
  const errorId = error ? `${id}-error` : null;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className={cn("text-[13px] font-medium text-ink-soft", hideLabel && "sr-only")}>
        {label}
        {optional && <span className="font-normal text-subtle"> (optional)</span>}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {error ? (
        <p id={errorId!} className="flex items-start gap-1.5 text-[13px] text-danger">
          <Icon name="alert" size={14} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId!} className="text-[13px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = Omit<ComponentProps<"input">, "id"> & {
  label: string;
  error?: string | null;
  hint?: ReactNode;
  optional?: boolean;
  hideLabel?: boolean;
  wrapperClassName?: string;
};

export function Input({
  label,
  error,
  hint,
  optional,
  hideLabel,
  wrapperClassName,
  className,
  type,
  ...rest
}: InputProps) {
  const [reveal, setReveal] = useState(false);
  const isPassword = type === "password";
  return (
    <FieldShell
      label={label}
      error={error}
      hint={hint}
      optional={optional}
      hideLabel={hideLabel}
      className={wrapperClassName}
    >
      {({ id, describedBy, invalid }) => (
        <div className="relative">
          <input
            id={id}
            type={isPassword && reveal ? "text" : type}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={cn(control, "h-12", isPassword && "pr-12", className)}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setReveal((r) => !r)}
              className="absolute inset-y-0 right-1.5 my-auto flex size-9 items-center justify-center rounded-lg text-muted hover:text-ink"
              aria-label={reveal ? "Hide password" : "Show password"}
              aria-pressed={reveal}
            >
              <Icon name="eye" size={18} />
            </button>
          )}
        </div>
      )}
    </FieldShell>
  );
}

type TextareaProps = Omit<ComponentProps<"textarea">, "id"> & {
  label: string;
  error?: string | null;
  hint?: ReactNode;
  optional?: boolean;
  wrapperClassName?: string;
};

export function Textarea({ label, error, hint, optional, wrapperClassName, className, ...rest }: TextareaProps) {
  return (
    <FieldShell label={label} error={error} hint={hint} optional={optional} className={wrapperClassName}>
      {({ id, describedBy, invalid }) => (
        <textarea
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(control, "min-h-32 resize-y py-3 leading-relaxed", className)}
          {...rest}
        />
      )}
    </FieldShell>
  );
}

type SelectProps = Omit<ComponentProps<"select">, "id"> & {
  label: string;
  error?: string | null;
  hint?: ReactNode;
  hideLabel?: boolean;
  wrapperClassName?: string;
};

export function Select({ label, error, hint, hideLabel, wrapperClassName, className, children, ...rest }: SelectProps) {
  return (
    <FieldShell label={label} error={error} hint={hint} hideLabel={hideLabel} className={wrapperClassName}>
      {({ id, describedBy, invalid }) => (
        <div className="relative">
          <select
            id={id}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={cn(control, "h-12 appearance-none pr-10", className)}
            {...rest}
          >
            {children}
          </select>
          <Icon
            name="chevron-down"
            size={16}
            className="pointer-events-none absolute inset-y-0 right-4 my-auto text-muted"
          />
        </div>
      )}
    </FieldShell>
  );
}

export function Checkbox({
  label,
  description,
  className,
  ...rest
}: Omit<ComponentProps<"input">, "type"> & { label: ReactNode; description?: ReactNode }) {
  const id = useId();
  return (
    <label htmlFor={id} className={cn("group flex cursor-pointer items-start gap-3", className)}>
      <span className="relative mt-0.5 flex size-5 shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          className="peer size-5 cursor-pointer appearance-none rounded-md border border-line-strong bg-surface transition-colors checked:border-ink checked:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          {...rest}
        />
        <Icon
          name="check"
          size={14}
          strokeWidth={2.2}
          className="pointer-events-none absolute text-paper opacity-0 peer-checked:opacity-100"
        />
      </span>
      <span className="text-sm leading-snug text-ink-soft">
        {label}
        {description && <span className="mt-0.5 block text-[13px] text-muted">{description}</span>}
      </span>
    </label>
  );
}
