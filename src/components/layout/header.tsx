"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { business } from "@/config/business";
import { primaryNav } from "@/content/navigation";
import { categories } from "@/data/catalog";
import { useCurrentUser } from "@/lib/auth/customer-auth";
import { cn, formatPrice, pluralize } from "@/lib/format";
import { useCart } from "@/lib/stores/cart";
import { useHydrated } from "@/lib/stores/persistent-store";
import { openOverlay } from "@/lib/stores/ui";
import { useWishlist } from "@/lib/stores/wishlist";
import { Icon } from "../ui/icon";
import { SmartImage } from "../ui/smart-image";
import { Logo } from "./logo";

function AnnouncementBar() {
  const threshold = business.shipping.freeShippingThreshold;
  return (
    <aside aria-label="Store announcement" className="bg-ink text-paper">
      <p className="container-page flex h-9 items-center justify-center gap-2 text-center text-[12px] tracking-wide">
        {business.isDemo && (
          <span className="rounded-full bg-paper/15 px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] uppercase">
            Demo
          </span>
        )}
        <span className="truncate">
          {threshold !== null ? `Free shipping on orders over ${formatPrice(threshold)}` : business.brand.tagline}
          {business.isDemo && <span className="hidden sm:inline"> · Sample products and test payments only</span>}
        </span>
      </p>
    </aside>
  );
}

function CountBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span
      key={count}
      className="absolute top-1 right-0.5 flex h-[18px] min-w-[18px] animate-pop items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold text-paper tabular-nums"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

const iconButton =
  "relative flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-sand/80";

function ShopMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="container-page grid grid-cols-12 gap-8 py-10">
      <div className="col-span-3">
        <p className="mb-4 eyebrow text-muted">Shop</p>
        <ul className="space-y-2.5">
          {[
            { label: "Shop all", href: "/shop" },
            { label: "New in", href: "/shop?filter=new" },
            { label: "Best sellers", href: "/shop?filter=bestsellers" },
            { label: "Sale", href: "/shop?filter=sale" },
          ].map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={onNavigate}
                className="font-display text-2xl transition-colors hover:text-muted"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-3">
        <p className="mb-4 eyebrow text-muted">Categories</p>
        <ul className="space-y-2">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/collections/${c.slug}`}
                onClick={onNavigate}
                className="text-[15px] text-ink-soft transition-colors hover:text-ink"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-6 grid grid-cols-2 gap-4">
        {categories.slice(0, 2).map((c) => (
          <Link
            key={c.slug}
            href={`/collections/${c.slug}`}
            onClick={onNavigate}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
          >
            <SmartImage
              src={c.image.src}
              alt={c.image.alt}
              fill
              sizes="22vw"
              className="object-cover transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
            <span className="absolute bottom-4 left-4 flex items-center gap-2 text-sm font-medium text-white">
              {c.name}
              <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const { count } = useCart();
  const wishlist = useWishlist();
  const user = useCurrentUser();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const openMenu = () => {
    window.clearTimeout(closeTimer.current);
    setMenuOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setMenuOpen(false), 120);
  };

  const isActive = (href: string) => {
    const path = href.split("?")[0];
    return !href.includes("?") && (pathname === path || (path !== "/" && pathname.startsWith(`${path}/`)));
  };

  return (
    <>
      <AnnouncementBar />
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300",
          scrolled || menuOpen
            ? "border-line/70 shadow-[0_1px_0_rgb(28_25_23/0.02)] glass"
            : "border-transparent bg-paper",
        )}
        onMouseLeave={scheduleClose}
      >
        <div className="container-page grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 lg:h-[4.5rem]">
          {/* Left */}
          <div className="flex items-center gap-1 lg:gap-7">
            <button
              type="button"
              className={cn(iconButton, "-ml-2.5 lg:hidden")}
              onClick={() => openOverlay("menu")}
              aria-label="Open menu"
            >
              <Icon name="menu" size={22} />
            </button>
            <button
              type="button"
              className={cn(iconButton, "lg:hidden")}
              onClick={() => openOverlay("search")}
              aria-label="Search"
            >
              <Icon name="search" size={21} />
            </button>
            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-7 text-[14px]">
                <li onMouseEnter={openMenu}>
                  <button
                    type="button"
                    className="flex items-center gap-1 py-2 text-ink-soft transition-colors hover:text-ink aria-expanded:text-ink"
                    aria-expanded={menuOpen}
                    aria-controls="shop-menu"
                    onClick={() => setMenuOpen((o) => !o)}
                  >
                    Shop
                    <Icon
                      name="chevron-down"
                      size={14}
                      className={cn("transition-transform duration-200", menuOpen && "rotate-180")}
                    />
                  </button>
                </li>
                {primaryNav.slice(1).map((item) => (
                  <li key={item.href} onMouseEnter={scheduleClose}>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative py-2 text-ink-soft transition-colors hover:text-ink",
                        isActive(item.href) &&
                          "text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-ink",
                      )}
                      aria-current={isActive(item.href) ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Center */}
          <Logo />

          {/* Right */}
          <div className="-mr-2.5 flex items-center justify-end">
            <button
              type="button"
              className={cn(iconButton, "hidden lg:flex")}
              onClick={() => openOverlay("search")}
              aria-label="Search"
            >
              <Icon name="search" size={21} />
            </button>
            <Link
              href={user ? "/account" : "/login"}
              className={cn(iconButton, "hidden sm:flex")}
              aria-label={user ? "My account" : "Sign in"}
            >
              <Icon name="user" size={21} />
              {hydrated && user && (
                <span className="absolute right-2.5 bottom-2.5 size-2 rounded-full bg-success ring-2 ring-paper" />
              )}
            </Link>
            <Link
              href="/wishlist"
              className={iconButton}
              aria-label={`Wishlist, ${pluralize(wishlist.length, "item")}`}
            >
              <Icon name="heart" size={21} />
              <CountBadge count={hydrated ? wishlist.length : 0} />
            </Link>
            <button
              type="button"
              className={iconButton}
              onClick={() => openOverlay("cart")}
              aria-label={`Shopping bag, ${pluralize(count, "item")}`}
            >
              <Icon name="bag" size={21} />
              <CountBadge count={hydrated ? count : 0} />
            </button>
          </div>
        </div>

        {/* Desktop mega menu */}
        <div
          id="shop-menu"
          onMouseEnter={openMenu}
          className={cn(
            "absolute inset-x-0 top-full hidden border-b border-line/70 bg-surface/95 backdrop-blur-xl transition-[opacity,transform,visibility] duration-250 ease-(--ease-out-soft) lg:block",
            menuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
          )}
        >
          <ShopMenu onNavigate={() => setMenuOpen(false)} />
        </div>
      </header>
    </>
  );
}
