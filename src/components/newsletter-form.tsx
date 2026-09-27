"use client";

import { useState } from "react";
import { business } from "@/config/business";
import { cn } from "@/lib/format";
import { validateEmail } from "@/lib/validation";
import { Icon } from "./ui/icon";
import { Spinner } from "./ui/spinner";

export function NewsletterForm({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const problem = validateEmail(email);
    setError(problem);
    if (problem) return;
    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  const dark = tone === "dark";

  if (status === "done") {
    return (
      <div className={cn("flex items-start gap-3", className)} role="status">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-success text-white">
          <Icon name="check" size={14} strokeWidth={2} />
        </span>
        <p className={cn("text-sm leading-relaxed", dark ? "text-paper/80" : "text-ink-soft")}>
          Thank you — you&rsquo;re on the list.
          {business.isDemo && <span className="block opacity-70">Demo mode: no mailing list is connected yet.</span>}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className={className}>
      <label htmlFor={`newsletter-${tone}`} className="sr-only">
        Email address
      </label>
      <div
        className={cn(
          "flex h-13 items-center rounded-full border p-1 pl-5 transition-[border-color,box-shadow] focus-within:ring-4",
          dark
            ? "border-paper/25 bg-paper/5 focus-within:border-paper/60 focus-within:ring-paper/10"
            : "border-line-strong bg-surface focus-within:border-ink focus-within:ring-ink/8",
          error && "border-danger",
        )}
      >
        <input
          id={`newsletter-${tone}`}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `newsletter-${tone}-error` : undefined}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-[15px] outline-none focus-visible:outline-none",
            dark ? "text-paper placeholder:text-paper/50" : "placeholder:text-subtle",
          )}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors",
            dark ? "bg-paper text-ink hover:bg-white" : "bg-ink text-paper hover:bg-ink-soft",
          )}
        >
          {status === "loading" ? <Spinner /> : "Subscribe"}
        </button>
      </div>
      {error && (
        <p
          id={`newsletter-${tone}-error`}
          className={cn("mt-2 pl-5 text-[13px]", dark ? "text-[#f3b4ab]" : "text-danger")}
        >
          {error}
        </p>
      )}
    </form>
  );
}
