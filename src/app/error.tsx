"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Hook an error-reporting service (e.g. Sentry) in here for production.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center px-6 py-16 text-center">
      <p className="eyebrow text-muted">Something went wrong</p>
      <h1 className="mt-4 font-display text-5xl leading-none sm:text-6xl">We hit a snag</h1>
      <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
        Sorry about that. Please try again — if it keeps happening, contact us and we&rsquo;ll sort it out.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <ButtonLink href="/" variant="outline">
          Back to home
        </ButtonLink>
      </div>
    </div>
  );
}
