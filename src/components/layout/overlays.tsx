"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { closeQuickView } from "@/lib/stores/quick-view";
import { closeOverlay } from "@/lib/stores/ui";
import { QuickView } from "../product/quick-view";
import { CartDrawer } from "./cart-drawer";
import { MobileMenu } from "./mobile-menu";
import { SearchOverlay } from "./search-overlay";

/** Hosts the storefront's overlays and closes them whenever the URL changes. */
export function StoreOverlays() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    closeOverlay();
    closeQuickView();
  }, [pathname, searchParams]);

  return (
    <>
      <CartDrawer />
      <MobileMenu />
      <SearchOverlay />
      <QuickView />
    </>
  );
}
