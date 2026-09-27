import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/account/auth-shell";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <AuthShell title="Create an account" subtitle="Faster checkout, order tracking and a wishlist that follows you.">
      <Suspense>
        <SignupForm />
      </Suspense>
    </AuthShell>
  );
}
