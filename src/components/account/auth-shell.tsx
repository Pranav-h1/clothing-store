import type { ReactNode } from "react";
import { business } from "@/config/business";
import { photo } from "@/data/demo/photo";
import { Notice } from "../ui/misc";
import { SmartImage } from "../ui/smart-image";

const image = photo("1490481651871-ab68de25d43d", "Cream and neutral shirts hanging on a clothing rail");

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="container-page grid items-stretch gap-10 py-10 sm:py-14 lg:grid-cols-2 lg:gap-16">
      <div className="relative hidden min-h-[36rem] overflow-hidden rounded-3xl lg:block">
        <SmartImage src={image.src} alt={image.alt} fill sizes="45vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <p className="absolute right-8 bottom-8 left-8 font-display text-4xl leading-tight text-white">
          {business.brand.tagline}.
        </p>
      </div>
      <div className="flex items-center">
        <div className="mx-auto w-full max-w-md">
          <h1 className="font-display text-5xl leading-none">{title}</h1>
          <p className="mt-3 text-[15px] text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {business.isDemo && (
            <Notice tone="neutral" icon="info" title="Demo accounts" className="mt-8">
              Accounts are stored only in this browser (passwords are hashed). The production store will use a secure
              server-side login — see <code>src/lib/auth/customer-auth.ts</code>.
            </Notice>
          )}
        </div>
      </div>
    </div>
  );
}
