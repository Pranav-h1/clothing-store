"use client";

import Link from "next/link";
import { business } from "@/config/business";
import { primaryNav } from "@/content/navigation";
import { categories } from "@/data/catalog";
import { useCurrentUser } from "@/lib/auth/customer-auth";
import { closeOverlay, overlayStore } from "@/lib/stores/ui";
import { ContactAction, SocialLinks } from "../contact-actions";
import { Icon } from "../ui/icon";
import { Sheet } from "../ui/sheet";
import { SmartImage } from "../ui/smart-image";

export function MobileMenu() {
  const overlay = overlayStore.use();
  const user = useCurrentUser();

  return (
    <Sheet open={overlay === "menu"} onClose={closeOverlay} title="Menu" side="left">
      <nav aria-label="Mobile" className="flex flex-col gap-8 px-6 pb-8">
        <ul className="space-y-1">
          {primaryNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={closeOverlay}
                className="flex items-center justify-between py-2 font-display text-[1.75rem] leading-tight"
              >
                {item.label}
                <Icon name="chevron-right" size={18} className="text-subtle" />
              </Link>
            </li>
          ))}
        </ul>

        <div>
          <p className="mb-3 eyebrow text-muted">Collections</p>
          <ul className="grid grid-cols-2 gap-3">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}`} onClick={closeOverlay} className="group block">
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-xl">
                    <SmartImage src={c.image.src} alt="" fill sizes="45vw" className="object-cover" />
                  </span>
                  <span className="mt-1.5 block text-[13px] font-medium">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <ul className="space-y-1 border-t border-line pt-6 text-[15px]">
          <li>
            <Link href={user ? "/account" : "/login"} onClick={closeOverlay} className="flex items-center gap-3 py-2.5">
              <Icon name="user" size={19} /> {user ? `Hi, ${user.name.split(" ")[0]}` : "Sign in / Create account"}
            </Link>
          </li>
          <li>
            <Link href="/account/orders" onClick={closeOverlay} className="flex items-center gap-3 py-2.5">
              <Icon name="receipt" size={19} /> My orders
            </Link>
          </li>
          <li>
            <ContactAction channel="whatsapp" className="flex w-full items-center gap-3 py-2.5 text-left">
              <Icon name="whatsapp" size={19} /> WhatsApp {business.contact.whatsapp.display}
            </ContactAction>
          </li>
          <li>
            <ContactAction channel="email" className="flex w-full items-center gap-3 py-2.5 text-left">
              <Icon name="mail" size={19} /> {business.contact.email}
            </ContactAction>
          </li>
        </ul>

        <SocialLinks className="-ml-2.5" itemClassName="hover:bg-sand" />
      </nav>
    </Sheet>
  );
}
