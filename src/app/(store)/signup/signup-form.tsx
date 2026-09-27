"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox, Input } from "@/components/ui/field";
import { Notice } from "@/components/ui/misc";
import { AuthError, signUp, updateProfile } from "@/lib/auth/customer-auth";
import { safeNext } from "@/lib/safe-redirect";
import { toast } from "@/lib/stores/ui";
import {
  PASSWORD_MIN,
  collectErrors,
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
  type FieldErrors,
} from "@/lib/validation";

type Key = "name" | "email" | "phone" | "password";

export function SignupForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [values, setValues] = useState({ name: "", email: "", phone: "", password: "" });
  const [marketing, setMarketing] = useState(false);
  const [errors, setErrors] = useState<FieldErrors<Key>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const bind = (key: Key) => ({
    value: values[key],
    error: errors[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const problems = collectErrors<Key>({
      name: validateRequired(values.name, "your name"),
      email: validateEmail(values.email),
      phone: validatePhone(values.phone),
      password: validatePassword(values.password),
    });
    setErrors(problems);
    if (Object.keys(problems).length) return;
    setLoading(true);
    try {
      const user = await signUp(values);
      if (marketing) updateProfile({ marketingOptIn: true });
      toast({ tone: "success", title: `Welcome, ${user.name.split(" ")[0]}`, description: "Your account is ready." });
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
      <Input label="Full name" autoComplete="name" {...bind("name")} />
      <Input label="Email" type="email" autoComplete="email" {...bind("email")} />
      <Input
        label="Phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+XX XXXXX XXXXX"
        {...bind("phone")}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        hint={`At least ${PASSWORD_MIN} characters, with a letter and a number.`}
        {...bind("password")}
      />
      <Checkbox
        label="Email me about new arrivals and offers"
        checked={marketing}
        onChange={(e) => setMarketing(e.target.checked)}
      />
      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Create account
      </Button>
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-ink underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  );
}
