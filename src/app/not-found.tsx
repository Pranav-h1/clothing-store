import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <Logo className="mb-16" />
      <p className="eyebrow text-muted">Error 404</p>
      <h1 className="mt-4 font-display text-6xl leading-none sm:text-7xl">Page not found</h1>
      <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
        The page you&rsquo;re looking for has moved or no longer exists.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/shop" variant="outline">
          Shop all
        </ButtonLink>
      </div>
    </div>
  );
}
