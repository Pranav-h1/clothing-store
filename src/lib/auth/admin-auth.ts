"use client";

/**
 * DEMO ADMIN AUTH — a browser-only gate so reviewers can explore the admin UI.
 * It provides NO security: the credentials are in the source and the check
 * runs client-side. Admin changes only affect this browser.
 *
 * PRODUCTION: verify admin sessions on the server — check a signed, httpOnly
 * session cookie in `src/proxy.ts` for `/admin/*`, and again inside every
 * admin API route before reading or writing data. Use role-based access and
 * enforce 2FA for staff accounts.
 */

import { DEMO_ADMIN } from "@/data/demo/admin";
import { createPersistentStore } from "@/lib/stores/persistent-store";

const adminSessionStore = createPersistentStore<{ name: string; email: string } | null>("demo-admin-session-v1", null);

export const useAdminSession = adminSessionStore.use;

export async function signInAdmin(email: string, password: string): Promise<boolean> {
  // Small delay so the UI shows its loading state like a real network call.
  await new Promise((resolve) => setTimeout(resolve, 450));
  const ok = email.trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password;
  if (ok) adminSessionStore.set({ name: DEMO_ADMIN.name, email: DEMO_ADMIN.email });
  return ok;
}

export function signOutAdmin() {
  adminSessionStore.set(null);
}
