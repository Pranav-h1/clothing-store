"use client";

import type { ReactNode } from "react";
import { business, type SocialLink } from "@/config/business";
import { cn } from "@/lib/format";
import { toast } from "@/lib/stores/ui";
import { Icon } from "./ui/icon";

export type ContactChannel = "phone" | "whatsapp" | "email";

/** Returns a working href for a channel, or `null` while it is still a placeholder. */
export function contactHref(channel: ContactChannel): string | null {
  const { contact } = business;
  switch (channel) {
    case "phone":
      return contact.phone.dial ? `tel:+${contact.phone.dial}` : null;
    case "whatsapp":
      return contact.whatsapp.number
        ? `https://wa.me/${contact.whatsapp.number}?text=${encodeURIComponent(contact.whatsapp.greeting)}`
        : null;
    case "email":
      return `mailto:${contact.email}`;
  }
}

const placeholderMessage: Record<ContactChannel, string> = {
  phone: "Calling is disabled until the real phone number is added.",
  whatsapp: "WhatsApp opens once the real WhatsApp number is added.",
  email: "",
};

/**
 * A link to a contact channel. While the number is a placeholder it renders a
 * button that explains why nothing happens, instead of a broken link.
 */
export function ContactAction({
  channel,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  channel: ContactChannel;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  const href = contactHref(channel);
  if (href) {
    const external = channel === "whatsapp";
    return (
      <a
        href={href}
        className={className}
        aria-label={ariaLabel}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onClick={() =>
        toast({
          title: "Demo contact details",
          description: `${placeholderMessage[channel]} Edit src/config/business.ts.`,
        })
      }
    >
      {children}
    </button>
  );
}

const socialLabel: Record<SocialLink["network"], string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  pinterest: "Pinterest",
  youtube: "YouTube",
  x: "X",
  tiktok: "TikTok",
};

export function SocialLinks({ className, itemClassName }: { className?: string; itemClassName?: string }) {
  return (
    <ul className={cn("flex items-center gap-1", className)}>
      {business.social.map((s) => {
        const label = `${socialLabel[s.network]} ${s.handle}`;
        const cls = cn("flex size-10 items-center justify-center rounded-full transition-colors", itemClassName);
        return (
          <li key={s.network}>
            {s.url ? (
              <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls}>
                <Icon name={s.network} size={19} />
              </a>
            ) : (
              <button
                type="button"
                aria-label={`${label} (placeholder)`}
                className={cls}
                onClick={() =>
                  toast({
                    title: `${socialLabel[s.network]} link not set`,
                    description: "Add the real profile URL in src/config/business.ts.",
                  })
                }
              >
                <Icon name={s.network} size={19} />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
