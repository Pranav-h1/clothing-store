"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { business } from "@/config/business";
import { signOutAdmin, useAdminSession } from "@/lib/auth/admin-auth";
import { cn } from "@/lib/format";
import { useHydrated } from "@/lib/stores/persistent-store";
import { Icon, type IconName } from "../ui/icon";
import { Skeleton } from "../ui/misc";
import { Sheet } from "../ui/sheet";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/products", label: "Products", icon: "box" },
  { href: "/admin/orders", label: "Orders", icon: "receipt" },
  { href: "/admin/inventory", label: "Inventory", icon: "grid" },
  { href: "/admin/customers", label: "Customers", icon: "users" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-1">
      {NAV.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm transition-colors",
                active ? "bg-ink text-paper" : "text-ink-soft hover:bg-sand",
              )}
            >
              <Icon name={item.icon} size={19} />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const session = useAdminSession();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !session) router.replace("/admin/login");
  }, [hydrated, session, router]);

  if (!hydrated || !session) {
    return (
      <div className="flex min-h-dvh" aria-busy="true" aria-label="Loading admin">
        <div className="hidden w-64 border-r border-line p-5 lg:block">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex-1 space-y-4 p-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </div>
    );
  }

  const logout = () => {
    signOutAdmin();
    router.push("/admin/login");
  };

  const sidebarFooter = (
    <div className="space-y-1 border-t border-line pt-4">
      <Link href="/" className="flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm text-ink-soft hover:bg-sand">
        <Icon name="store" size={19} /> View store
      </Link>
      <button
        type="button"
        onClick={logout}
        className="flex h-11 w-full items-center gap-3 rounded-xl px-3.5 text-sm text-ink-soft hover:bg-sand"
      >
        <Icon name="logout" size={19} /> Sign out
      </button>
      <p className="px-3.5 pt-3 text-[12px] text-muted">{session.email}</p>
    </div>
  );

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-surface p-4 lg:flex">
        <Link href="/admin" className="mb-8 block px-3.5 pt-2">
          <span className="block text-[13px] font-semibold tracking-[0.2em] uppercase">{business.brand.shortName}</span>
          <span className="text-[12px] text-muted">Store admin</span>
        </Link>
        <nav aria-label="Admin" className="flex-1">
          <NavList />
        </nav>
        {sidebarFooter}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {business.isDemo && (
          <aside aria-label="Demo notice" className="bg-warning-soft px-5 py-2 text-center text-[12px] text-warning">
            Demo admin — changes are saved in this browser only and affect this device&rsquo;s storefront.
          </aside>
        )}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line px-4 glass lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex size-11 items-center justify-center rounded-full hover:bg-sand"
            aria-label="Open admin menu"
          >
            <Icon name="menu" size={22} />
          </button>
          <p className="text-[13px] font-semibold tracking-[0.2em] uppercase">{business.brand.shortName}</p>
          <span className="text-[12px] text-muted">Admin</span>
        </header>
        <main id="main" key={pathname} className="page-enter flex-1 px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>

      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} title="Admin" side="left">
        <div className="flex h-full flex-col gap-6 px-4 pb-6">
          <nav aria-label="Admin mobile">
            <NavList onNavigate={() => setMenuOpen(false)} />
          </nav>
          {sidebarFooter}
        </div>
      </Sheet>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}
      </div>
      {action && <div className="self-start sm:self-auto">{action}</div>}
    </div>
  );
}
