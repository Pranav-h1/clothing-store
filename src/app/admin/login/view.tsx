"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Notice } from "@/components/ui/misc";
import { DEMO_ADMIN } from "@/data/demo/admin";
import { signInAdmin, useAdminSession } from "@/lib/auth/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const session = useAdminSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) router.replace("/admin");
  }, [session, router]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo />
          <p className="eyebrow text-muted">Store admin</p>
        </div>
        <div className="rounded-3xl border border-line bg-surface p-7 shadow-soft sm:p-9">
          <h1 className="font-display text-4xl">Sign in</h1>
          <p className="mt-2 text-sm text-muted">Manage products, inventory and orders.</p>
          <form
            noValidate
            className="mt-7 space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setLoading(true);
              const ok = await signInAdmin(email, password);
              setLoading(false);
              if (ok) router.push("/admin");
              else setError("Incorrect email or password.");
            }}
          >
            {error && (
              <Notice tone="danger" icon="alert">
                <span role="alert">{error}</span>
              </Notice>
            )}
            <Input
              label="Email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Sign in
            </Button>
          </form>
        </div>

        <Notice tone="warning" icon="info" title="Demo admin — not secure" className="mt-5">
          <p>
            Use <strong>{DEMO_ADMIN.email}</strong> / <strong>{DEMO_ADMIN.password}</strong>. This check runs in the
            browser and changes are saved only on this device. Production must use server-side authentication.
          </p>
          <button
            type="button"
            className="mt-2 font-semibold underline underline-offset-4"
            onClick={() => {
              setEmail(DEMO_ADMIN.email);
              setPassword(DEMO_ADMIN.password);
            }}
          >
            Fill demo credentials
          </button>
        </Notice>

        <Link href="/" className="mt-8 flex items-center justify-center gap-2 text-sm text-muted hover:text-ink">
          <Icon name="arrow-left" size={16} /> Back to store
        </Link>
      </div>
    </div>
  );
}
