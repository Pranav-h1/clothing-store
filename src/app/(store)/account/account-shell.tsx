"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/misc";
import { signOut, useCurrentUser } from "@/lib/auth/customer-auth";
import { cn } from "@/lib/format";
import { useHydrated } from "@/lib/stores/persistent-store";
import { toast } from "@/lib/stores/ui";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/account", label: "Overview", icon: "user" },
  { href: "/account/orders", label: "Orders", icon: "receipt" },
  { href: "/wishlist", label: "Wishlist", icon: "heart" },
  { href: "/account/settings", label: "Settings", icon: "settings" },
];

/**
 * Set while the customer is deliberately leaving (sign out / delete account),
 * so the guard below doesn't bounce them to the login page instead.
 */
let leaving = false;

export function leaveAccount(action: () => void) {
  leaving = true;
  action();
}

export function AccountShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const user = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (user) leaving = false;
    else if (hydrated && !leaving) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [hydrated, user, router, pathname]);

  if (!hydrated || !user) {
    return (
      <div
        className="container-page grid gap-10 py-14 lg:grid-cols-[15rem_1fr]"
        aria-busy="true"
        aria-label="Loading account"
      >
        <Skeleton className="h-48" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="container-page pt-10 pb-20 sm:pt-14">
      <div className="mb-8 sm:mb-10">
        <p className="eyebrow text-muted">My account</p>
        <h1 className="mt-2 font-display text-5xl sm:text-6xl">Hi, {user.name.split(" ")[0]}</h1>
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-[15rem_1fr] lg:gap-14">
        <nav
          aria-label="Account"
          className="-mx-5 scrollbar-none overflow-x-auto px-5 lg:sticky lg:top-28 lg:mx-0 lg:px-0"
        >
          <ul className="flex gap-2 lg:flex-col lg:gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-11 items-center gap-3 rounded-full px-4 text-sm whitespace-nowrap transition-colors lg:rounded-xl",
                      active ? "bg-ink text-paper" : "bg-sand hover:bg-sand-deep lg:bg-transparent lg:hover:bg-sand",
                    )}
                  >
                    <Icon name={item.icon} size={18} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                onClick={() =>
                  leaveAccount(() => {
                    signOut();
                    toast({ title: "Signed out" });
                    router.push("/");
                  })
                }
                className="flex h-11 w-full items-center gap-3 rounded-full bg-sand px-4 text-sm whitespace-nowrap text-muted transition-colors hover:text-ink lg:rounded-xl lg:bg-transparent lg:hover:bg-sand"
              >
                <Icon name="logout" size={18} />
                Sign out
              </button>
            </li>
          </ul>
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
