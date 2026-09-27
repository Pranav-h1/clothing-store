import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/account/auth-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to track orders, save your details and see your wishlist.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
