import Link from "next/link";
import { business } from "@/config/business";
import { footerNav } from "@/content/navigation";
import { ContactAction, SocialLinks } from "../contact-actions";
import { NewsletterForm } from "../newsletter-form";
import { Icon } from "../ui/icon";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-ink text-paper">
      <div className="container-page grid gap-12 pt-16 pb-10 lg:grid-cols-12 lg:gap-8 lg:pt-20">
        <div className="lg:col-span-5">
          <p className="text-base font-semibold tracking-[0.22em] uppercase">{business.brand.name}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/65">{business.brand.description}</p>
          <div className="mt-8 max-w-md">
            <p className="mb-3 text-sm font-medium">Join the list for new arrivals and restocks</p>
            <NewsletterForm tone="dark" />
          </div>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-4">
          {footerNav.map((group) => (
            <div key={group.title}>
              <p className="mb-4 eyebrow text-paper/50">{group.title}</p>
              <ul className="space-y-2.5 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-paper/80 transition-colors hover:text-paper">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <p className="mb-4 eyebrow text-paper/50">Get in touch</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <ContactAction
                  channel="email"
                  className="inline-flex items-center gap-2 text-paper/80 hover:text-paper"
                >
                  <Icon name="mail" size={16} /> {business.contact.email}
                </ContactAction>
              </li>
              <li>
                <ContactAction
                  channel="phone"
                  className="inline-flex items-center gap-2 text-paper/80 hover:text-paper"
                >
                  <Icon name="phone" size={16} /> {business.contact.phone.display}
                </ContactAction>
              </li>
              <li>
                <ContactAction
                  channel="whatsapp"
                  className="inline-flex items-center gap-2 text-paper/80 hover:text-paper"
                >
                  <Icon name="whatsapp" size={16} /> WhatsApp
                </ContactAction>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="container-page">
        <div className="flex flex-col-reverse gap-4 border-t border-paper/10 py-6 text-[12px] text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.brand.name}. {business.isDemo && "Demo storefront — sample content only."}
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="lock" size={14} /> Secure payments by Razorpay
            </span>
            <SocialLinks className="-mr-2.5" itemClassName="text-paper/70 hover:bg-paper/10 hover:text-paper" />
          </div>
        </div>
      </div>
    </footer>
  );
}
