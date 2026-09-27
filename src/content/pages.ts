import { photo } from "@/data/demo/photo";

/**
 * EDITABLE PAGE COPY — placeholder brand copy written to read naturally.
 * Rewrite freely; it makes no factual claims about any real company.
 * Images here are DEMO imagery (see `src/data/demo/photo.ts`).
 */

export const homeContent = {
  hero: {
    eyebrow: "Autumn / Winter 2026",
    title: "Clothes made to be",
    /** Rendered in italics after the title. */
    titleAccent: "lived in",
    body: "Considered pieces in honest materials — designed to be worn often, cared for easily and kept for years.",
    primaryCta: { label: "Shop the collection", href: "/shop" },
    secondaryCta: { label: "Explore new in", href: "/shop?filter=new" },
    image: photo("1581044777550-4cfa60707c03", "Woman in a pink ruffled dress standing in a golden field"),
    secondaryImage: photo("1609505848912-b7c3b8b4beda", "Woman in a white ruffled blouse against a dark backdrop"),
  },
  promo: {
    eyebrow: "The outerwear edit",
    title: "Coats worth waiting all year for",
    body: "Trenches, wool coats and leather — cut generously so they layer over everything you already own.",
    cta: { label: "Shop outerwear", href: "/collections/outerwear" },
    image: photo("1551232864-3f0890e580d9", "Rail of jackets in camel, black leather, knit and denim"),
  },
  story: {
    eyebrow: "Our story",
    title: "Fewer, better things",
    body: "We started with a simple idea: make the clothes we actually want to wear every day, and make them properly. Replace this paragraph with the real story of how your brand began.",
    cta: { label: "Read our story", href: "/about" },
    image: photo("1441984904996-e0b6ba687e04", "Minimal clothing boutique interior with rails of garments"),
  },
  materials: {
    eyebrow: "Materials & make",
    title: "Quality you can feel",
    image: photo("1523381210434-271e8be1f52b", "Close-up of green cotton tees on wooden hangers"),
    points: [
      {
        title: "Natural fibres first",
        body: "Cotton, wool, linen and silk chosen for how they feel and how they age.",
      },
      { title: "Made to last", body: "Reinforced seams, quality trims and fabrics tested for pilling and shrinkage." },
      { title: "Considered fits", body: "Every pattern refined across fittings so it sits right on real bodies." },
    ],
  },
  service: [
    { icon: "truck", title: "Free shipping", body: "On orders over the free-shipping threshold." },
    { icon: "return", title: "Easy returns", body: "Change your mind? Returns are simple (placeholder policy)." },
    { icon: "chat", title: "Real people", body: "Questions about fit or fabric? Message us on WhatsApp or email." },
    { icon: "lock", title: "Secure payment", body: "Checkout is processed by Razorpay." },
  ],
  newsletter: {
    title: "Letters from the studio",
    body: "New collections, restocks and the occasional styling note. No spam — unsubscribe anytime.",
  },
} as const;

export const aboutContent = {
  hero: {
    eyebrow: "About us",
    title: "Clothing with intention",
    body: "This page is placeholder copy describing the kind of brand this store is built for. Replace it with your own story, in your own words.",
    image: photo("1490481651871-ab68de25d43d", "Rail of cream and neutral shirts on wooden hangers"),
  },
  story: {
    title: "Where it began",
    paragraphs: [
      "Every brand starts somewhere — a workroom, a kitchen table, a market stall. Use this space to tell customers where yours began and who is behind it.",
      "Explain what you noticed missing in the clothes you could buy, and what you set out to make instead. Customers connect with the reason a brand exists far more than with its product list.",
    ],
    image: photo("1445205170230-053b83016050", "Boutique rails of knitwear and coats in warm light"),
  },
  pillars: [
    {
      title: "Fashion with focus",
      body: "A tight, considered range instead of endless trends. Describe the kind of clothing you specialise in.",
    },
    {
      title: "Quality over quantity",
      body: "Explain your standards: fabric weights, construction details, and the checks every garment passes.",
    },
    {
      title: "Craftsmanship",
      body: "Share how your pieces are made — the people, the skills and the time each one takes.",
    },
    { title: "Materials", body: "List the fibres you favour and why. Be specific only about claims you can verify." },
    {
      title: "Customer experience",
      body: "Describe how you help customers choose, receive and care for what they buy.",
    },
    { title: "Values", body: "What your brand will and will not do. Keep it honest, concrete and short." },
  ],
  closing: {
    title: "Thank you for being here",
    body: "Close with a short note to customers. Invite them to explore the collection or get in touch.",
    image: photo("1558769132-cb1aea458c5e", "Soft knit sweaters hanging beside dried pampas grass"),
  },
} as const;

export const faqs = [
  {
    q: "How long does delivery take?",
    a: "Orders are usually dispatched within 2–4 business days. Delivery times depend on your location — the real timelines will be listed here once shipping partners are confirmed.",
  },
  {
    q: "What is your returns policy?",
    a: "This is a placeholder answer. Add your return window, the condition items must be in, and how refunds are issued.",
  },
  {
    q: "How do I find my size?",
    a: "Each product page lists the available sizes. If you are between sizes, message us on WhatsApp or email and we will help you choose.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Checkout is powered by Razorpay, which supports cards, UPI, net banking and wallets depending on your country.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "Contact us as soon as possible with your order number. Orders that have not yet been dispatched can usually be changed.",
  },
] as const;
