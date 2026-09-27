import { Suspense } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StoreOverlays } from "@/components/layout/overlays";

export default function StoreLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-[70] rounded-full bg-ink px-5 py-3 text-sm text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <Suspense>
        <StoreOverlays />
      </Suspense>
    </div>
  );
}
