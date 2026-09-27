"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DEMO CUSTOMER AUTH — for demonstrating the account experience only.
 * ─────────────────────────────────────────────────────────────────────────────
 *  Accounts live in this browser's localStorage. Passwords are salted and
 *  hashed (PBKDF2), but browser storage is not a secure credential store and
 *  there is no server verifying anything.
 *
 *  PRODUCTION: replace the functions in this module with calls to a real auth
 *  backend (e.g. Auth.js, Supabase Auth, Clerk, or your own API) that:
 *    • hashes passwords server-side (argon2id / bcrypt),
 *    • issues an httpOnly, Secure, SameSite session cookie,
 *    • rate-limits sign-in attempts and verifies email addresses.
 *  Keep the exported function names and the `AuthUser` shape, and the pages
 *  will not need to change.
 */

import type { Address } from "@/lib/types";
import { createPersistentStore } from "@/lib/stores/persistent-store";
import { hashPassword, verifyPassword } from "./password";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address | null;
  marketingOptIn: boolean;
  createdAt: string;
};

type StoredAccount = { user: AuthUser; hash: string; salt: string };

const accountsStore = createPersistentStore<Record<string, StoredAccount>>("demo-accounts-v1", {});
const sessionStore = createPersistentStore<string | null>("demo-session-v1", null);

export class AuthError extends Error {}

const normalize = (email: string) => email.trim().toLowerCase();

export function useCurrentUser(): AuthUser | null {
  const email = sessionStore.use();
  const accounts = accountsStore.use();
  return email ? (accounts[email]?.user ?? null) : null;
}

export async function signUp(input: { name: string; email: string; phone: string; password: string }) {
  const email = normalize(input.email);
  if (accountsStore.get()[email]) throw new AuthError("An account with this email already exists.");
  const { hash, salt } = await hashPassword(input.password);
  const user: AuthUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email,
    phone: input.phone.trim(),
    address: null,
    marketingOptIn: false,
    createdAt: new Date().toISOString(),
  };
  accountsStore.set((accounts) => ({ ...accounts, [email]: { user, hash, salt } }));
  sessionStore.set(email);
  return user;
}

export async function signIn(emailInput: string, password: string) {
  const email = normalize(emailInput);
  const account = accountsStore.get()[email];
  // Same message for unknown email and wrong password — don't leak which accounts exist.
  if (!account || !(await verifyPassword(password, account.hash, account.salt))) {
    throw new AuthError("That email and password combination didn't match.");
  }
  sessionStore.set(email);
  return account.user;
}

export function signOut() {
  sessionStore.set(null);
}

export function updateProfile(patch: Partial<Omit<AuthUser, "id" | "email" | "createdAt">>) {
  const email = sessionStore.get();
  if (!email) throw new AuthError("You are signed out.");
  accountsStore.set((accounts) => {
    const account = accounts[email];
    if (!account) return accounts;
    return { ...accounts, [email]: { ...account, user: { ...account.user, ...patch } } };
  });
}

export async function changePassword(current: string, next: string) {
  const email = sessionStore.get();
  const account = email ? accountsStore.get()[email] : undefined;
  if (!email || !account) throw new AuthError("You are signed out.");
  if (!(await verifyPassword(current, account.hash, account.salt))) {
    throw new AuthError("Your current password is incorrect.");
  }
  const { hash, salt } = await hashPassword(next);
  accountsStore.set((accounts) => ({ ...accounts, [email]: { ...account, hash, salt } }));
}

export function deleteAccount() {
  const email = sessionStore.get();
  if (!email) return;
  accountsStore.set((accounts) => {
    const next = { ...accounts };
    delete next[email];
    return next;
  });
  sessionStore.set(null);
}
