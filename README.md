# Clothing storefront (demo)

A premium clothing e-commerce front end with a full shopping flow, customer accounts and a store admin. It runs as a
**demo**: every business detail is a placeholder, the product catalog is sample data, and payments are simulated until
Razorpay keys are added.

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4. The only runtime dependencies besides
Next/React are `tailwind-merge` and `server-only`.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run lint && npm run typecheck && npm run format:check
```

**Demo admin:** `/admin/login` with `admin@demo.store` / `demo-admin` (shown on the login page).
**Demo customer:** create any account at `/signup`; it lives in your browser only.

## Where things live

| What                                                                                             | Where                                                                                            |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| **Business details** (brand, logo, phone, WhatsApp, email, socials, country, currency, shipping) | `src/config/business.ts`                                                                         |
| Page copy (hero, about, FAQ, navigation)                                                         | `src/content/`                                                                                   |
| **Demo data** (products, categories, orders, customers, admin login)                             | `src/data/demo/`                                                                                 |
| Catalog switch point (demo → real data)                                                          | `src/data/catalog.ts`                                                                            |
| Design tokens (colours, fonts, shadows, motion)                                                  | `src/app/globals.css` (`@theme`)                                                                 |
| Payments (server, secrets)                                                                       | `src/lib/payments/razorpay-server.ts`, `src/app/api/checkout/`, `src/app/api/webhooks/razorpay/` |
| Payments (browser, no secrets)                                                                   | `src/lib/payments/checkout-client.ts`                                                            |
| Demo auth (customers / admin)                                                                    | `src/lib/auth/customer-auth.ts`, `src/lib/auth/admin-auth.ts`                                    |
| Browser persistence for cart, wishlist, demo orders, admin edits                                 | `src/lib/stores/`                                                                                |

Pages: home, shop (search, filters, sort), collections, product details, cart, checkout, order confirmation, login,
sign up, account (profile, saved address, orders, settings), wishlist, about, contact, and admin (dashboard, products
with add/edit/delete, orders with status updates, inventory, customers, settings).

## Going live — checklist

1. **Business information** — edit `src/config/business.ts`. Set `isDemo: false` to remove demo notices and allow
   search indexing. Add real `phone.dial` / `whatsapp.number` (digits with country code) to activate call and WhatsApp
   buttons, and real social URLs to activate those links.
2. **Currency** — set `currency.code` (e.g. `INR`), `symbol` (`₹`), `locale.language` (`en-IN`) and `minorUnit`.
3. **Logo** — put the file in `public/brand/` and set `brand.logo`.
4. **Products** — replace `src/data/demo/products.ts` and `categories.ts`, or point `src/data/catalog.ts` at a CMS or
   database. Product fields are defined in `src/lib/types.ts`.
5. **Photography** — use local files in `public/` or your image CDN. Demo images are Unsplash photos (see
   `src/data/demo/photo.ts`); add your CDN host to the loader in `src/components/ui/smart-image.tsx`.
6. **Payments** — copy `.env.example` to `.env.local` and add Razorpay **test** keys first. The checkout switches from
   simulated payments to real Razorpay Checkout automatically; the secret never reaches the browser. Configure the
   webhook at `/api/webhooks/razorpay`, then switch to live keys.
7. **Orders & inventory** — today orders are recorded in the browser (`src/lib/place-order.ts`). In production, create
   the order on the server after payment verification (`/api/checkout/verify`) and the webhook, and decrement stock in
   the database.
8. **Accounts** — replace the demo functions in `src/lib/auth/customer-auth.ts` with a real auth provider (server-side
   password hashing, httpOnly session cookies). Keep the exported function names and pages won't need changes.
9. **Admin** — remove `src/data/demo/admin.ts`, protect `/admin/*` with a server-checked session in `src/proxy.ts`, and
   route admin edits through authenticated API routes.
10. **Email** — connect a provider in `src/app/api/contact/route.ts` and `src/app/api/newsletter/route.ts`.
11. **SEO** — set `seo.siteUrl`; `robots.ts` and `sitemap.ts` pick it up.

## What is demo-only (by design)

- Customer accounts, the wishlist, orders and admin edits are stored in `localStorage` in this browser. Passwords are
  salted and hashed (PBKDF2), but this is **not** production authentication.
- The admin gate runs in the browser and uses published credentials — it is **not** security.
- Contact and newsletter forms validate on the server but do not deliver anything yet.
- Without Razorpay keys, payment is simulated and clearly labelled as such.
