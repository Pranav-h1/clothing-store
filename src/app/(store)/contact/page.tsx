import type { Metadata } from "next";
import { ContactAction, SocialLinks, type ContactChannel } from "@/components/contact-actions";
import { Icon, type IconName } from "@/components/ui/icon";
import { business } from "@/config/business";
import { faqs } from "@/content/pages";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact us",
  description: `Get in touch with ${business.brand.name} by phone, WhatsApp or email.`,
};

const channels: { channel: ContactChannel; icon: IconName; title: string; value: string; cta: string }[] = [
  {
    channel: "whatsapp",
    icon: "whatsapp",
    title: "WhatsApp",
    value: business.contact.whatsapp.display,
    cta: "Start a chat",
  },
  { channel: "phone", icon: "phone", title: "Phone", value: business.contact.phone.display, cta: "Call us" },
  { channel: "email", icon: "mail", title: "Email", value: business.contact.email, cta: "Write to us" },
];

export default function ContactPage() {
  return (
    <div className="container-page pt-10 pb-20 sm:pt-14">
      <div className="max-w-2xl">
        <p className="eyebrow text-muted">Contact us</p>
        <h1 className="mt-4 font-display text-6xl leading-[0.95] sm:text-7xl">We&rsquo;re here to help</h1>
        <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
          Questions about sizing, an order, or a piece you&rsquo;ve had your eye on? Reach us whichever way suits you.
        </p>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5">
        {channels.map((c) => (
          <li key={c.channel}>
            <ContactAction
              channel={c.channel}
              className="group flex h-full w-full flex-col rounded-3xl border border-line bg-surface p-6 text-left transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-sand transition-colors group-hover:bg-ink group-hover:text-paper">
                <Icon name={c.icon} size={21} />
              </span>
              <span className="mt-6 text-[13px] text-muted">{c.title}</span>
              <span className="mt-1 text-lg font-medium break-all">{c.value}</span>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium">
                {c.cta}{" "}
                <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </ContactAction>
          </li>
        ))}
      </ul>

      <div className="mt-12 grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        <aside className="space-y-5 lg:col-span-5">
          <div className="rounded-3xl bg-ink p-7 text-paper">
            <h2 className="font-display text-3xl">Opening hours</h2>
            <p className="mt-3 flex items-center gap-2 text-sm text-paper/80">
              <Icon name="info" size={16} /> {business.contact.hours}
            </p>
            <p className="mt-6 text-sm text-paper/70">Follow along</p>
            <SocialLinks className="mt-2 -ml-2.5" itemClassName="text-paper/80 hover:bg-paper/10 hover:text-paper" />
          </div>

          <section id="faq" aria-labelledby="faq-title" className="rounded-3xl border border-line bg-surface p-7">
            <h2 id="faq-title" className="font-display text-3xl">
              Common questions
            </h2>
            <div className="mt-4">
              {faqs.map((f) => (
                <details key={f.q} className="group border-b border-line last:border-b-0">
                  <summary className="flex list-none items-center justify-between gap-4 py-4 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <Icon
                      name="plus"
                      size={18}
                      className="shrink-0 text-muted transition-transform duration-300 group-open:rotate-45"
                    />
                  </summary>
                  <p className="pb-5 text-[15px] leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
