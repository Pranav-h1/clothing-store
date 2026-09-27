/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  BUSINESS CONFIGURATION — the single place for real business information.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Every value below is a clearly-marked PLACEHOLDER. When the real business
 *  details are available, edit this file only — every page, email link,
 *  WhatsApp button, footer, price label and SEO tag reads from here.
 *
 *  Do NOT put secrets here. This file is bundled into the browser.
 *  Payment secrets belong in environment variables (see `.env.example`).
 */

export type SocialLink = {
  /** Network name, used for the icon and accessible label. */
  network: "instagram" | "facebook" | "pinterest" | "youtube" | "x" | "tiktok";
  /** Public handle shown in the UI, e.g. "@yourbrand". */
  handle: string;
  /** Full profile URL. Leave `null` until the real profile exists. */
  url: string | null;
};

export const business = {
  /** Set to `false` when the store goes live with real data. Hides demo notices. */
  isDemo: true,

  brand: {
    name: "YOUR BRAND NAME",
    /** Short wordmark used in the header when space is tight. */
    shortName: "YOUR BRAND",
    tagline: "Considered clothing for everyday life",
    /**
     * Optional logo image path (e.g. "/brand/logo.svg" placed in /public).
     * When `null`, the brand name is rendered as a typographic wordmark.
     */
    logo: null as string | null,
    /** One-paragraph description used for SEO and the footer. */
    description:
      "A placeholder description for your clothing brand. Replace it with one or two sentences about what you make and who you make it for.",
  },

  contact: {
    email: "your@email.com",
    phone: {
      /** Shown to customers. */
      display: "+XX XXXXX XXXXX",
      /** Digits only with country code, e.g. "919876543210". `null` disables call links. */
      dial: null as string | null,
    },
    whatsapp: {
      display: "+XX XXXXX XXXXX",
      /** Digits only with country code for wa.me links. `null` disables the WhatsApp action. */
      number: null as string | null,
      /** Message pre-filled when a customer opens WhatsApp. */
      greeting: "Hello! I have a question about an order.",
    },
    /** Customer-service hours shown on the contact page. */
    hours: "Mon – Sat · 10:00 – 18:00 (placeholder)",
    /** Typical reply time shown on the contact page. */
    responseTime: "We reply within one business day (placeholder)",
  },

  social: [
    { network: "instagram", handle: "@yourbrand", url: null },
    { network: "facebook", handle: "yourbrand", url: null },
    { network: "pinterest", handle: "yourbrand", url: null },
    { network: "youtube", handle: "@yourbrand", url: null },
  ] as SocialLink[],

  locale: {
    country: "COUNTRY",
    /** BCP-47 locale for number and date formatting, e.g. "en-IN", "en-GB". */
    language: "en",
  },

  currency: {
    /** ISO 4217 code sent to the payment gateway, e.g. "INR". */
    code: "CURRENCY",
    /** Symbol shown next to prices, e.g. "₹". "¤" is the generic currency sign. */
    symbol: "¤",
    /** Digits after the decimal point in displayed prices. */
    fractionDigits: 0,
    /** Smallest-unit multiplier for the gateway (100 for INR paise, USD cents). */
    minorUnit: 100,
  },

  shipping: {
    /** Orders at or above this subtotal ship free. `null` disables free shipping. */
    freeShippingThreshold: 5000 as number | null,
    flatRate: 250,
    /** Shown in the product page and cart. */
    estimate: "Dispatched in 2–4 business days (placeholder)",
    returnsSummary: "Easy returns within 14 days of delivery (placeholder policy)",
  },

  /** Short trust statements shown under the add-to-cart button and in the footer. */
  promises: [
    { title: "Free shipping", body: "On orders over the free-shipping threshold" },
    { title: "Easy returns", body: "Placeholder policy — set your own terms" },
    { title: "Secure checkout", body: "Payments processed by Razorpay" },
  ],

  seo: {
    /** Absolute production URL, used for canonical links and social cards. */
    siteUrl: "https://example.com",
    titleTemplate: "%s · YOUR BRAND NAME",
    defaultTitle: "YOUR BRAND NAME — Clothing",
  },
} as const;

export type Business = typeof business;
