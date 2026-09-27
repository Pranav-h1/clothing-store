/** Storefront navigation. Collections are generated from the catalog categories. */
export const primaryNav = [
  { label: "Shop all", href: "/shop" },
  { label: "New in", href: "/shop?filter=new" },
  { label: "Best sellers", href: "/shop?filter=bestsellers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = [
  {
    title: "Shop",
    links: [
      { label: "Shop all", href: "/shop" },
      { label: "New in", href: "/shop?filter=new" },
      { label: "Best sellers", href: "/shop?filter=bestsellers" },
      { label: "Sale", href: "/shop?filter=sale" },
      { label: "Collections", href: "/collections" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact us", href: "/contact" },
      { label: "FAQ", href: "/contact#faq" },
      { label: "Track an order", href: "/account/orders" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "My account", href: "/account" },
      { label: "Wishlist", href: "/wishlist" },
    ],
  },
] as const;
