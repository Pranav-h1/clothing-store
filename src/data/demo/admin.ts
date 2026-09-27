/**
 * DEMO ONLY — publicly known admin credentials so reviewers can open the
 * admin area. This is NOT authentication: anyone reading the source can see
 * them and the check runs in the browser.
 *
 * Production: remove this file and protect `/admin` with server-side auth
 * (session cookie verified in `src/proxy.ts` and in every admin API route).
 */
export const DEMO_ADMIN = {
  email: "admin@demo.store",
  password: "demo-admin",
  name: "Store Admin (demo)",
} as const;
