"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Notice } from "@/components/ui/misc";
import { AuthError, signIn } from "@/lib/auth/customer-auth";
import { safeNext } from "@/lib/safe-redirect";
import { toast } from "@/lib/stores/ui";
import { collectErrors, validateEmail } from "@/lib/validation";

export function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const problems = collectErrors({
      email: validateEmail(email),
      password: password ? null : "Enter your password.",
    });
    setErrors(problems);
    if (Object.keys(problems).length) return;
    setLoading(true);
    try {
      const user = await signIn(email, password);
      toast({ tone: "success", title: `Welcome back, ${user.name.split(" ")[0]}` });
      router.push(next);
    } catch (error) {
      setFormError(error instanceof AuthError ? error.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {formError && (
        <Notice tone="danger" icon="alert">
          <span role="alert">{formError}</span>
        </Notice>
      )}
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Sign in
      </Button>
      <p className="text-center text-sm text-muted">
        New here?{" "}
        <Link
          href={`/signup${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-medium text-ink underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
