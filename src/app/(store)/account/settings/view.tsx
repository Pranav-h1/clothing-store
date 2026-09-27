"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox, Input } from "@/components/ui/field";
import { Sheet } from "@/components/ui/sheet";
import { AuthError, changePassword, deleteAccount, updateProfile, useCurrentUser } from "@/lib/auth/customer-auth";
import { toast } from "@/lib/stores/ui";
import { leaveAccount } from "../account-shell";
import { PASSWORD_MIN, validatePassword } from "@/lib/validation";

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 rounded-3xl border border-line bg-surface p-6 sm:p-8 md:grid-cols-[1fr_1.4fr] md:gap-10">
      <div>
        <h2 className="font-display text-3xl">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      </div>
      <div>{children}</div>
    </section>
  );
}

function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [errors, setErrors] = useState<{ current?: string; next?: string }>({});
  const [loading, setLoading] = useState(false);

  return (
    <form
      noValidate
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const problems = {
          current: current ? undefined : "Enter your current password.",
          next: validatePassword(next) ?? undefined,
        };
        setErrors(problems);
        if (problems.current || problems.next) return;
        setLoading(true);
        try {
          await changePassword(current, next);
          setCurrent("");
          setNext("");
          toast({ tone: "success", title: "Password updated" });
        } catch (error) {
          setErrors({ current: error instanceof AuthError ? error.message : "Something went wrong." });
        } finally {
          setLoading(false);
        }
      }}
    >
      <Input
        label="Current password"
        type="password"
        autoComplete="current-password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        error={errors.current}
      />
      <Input
        label="New password"
        type="password"
        autoComplete="new-password"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        error={errors.next}
        hint={`At least ${PASSWORD_MIN} characters, with a letter and a number.`}
      />
      <Button type="submit" loading={loading}>
        Update password
      </Button>
    </form>
  );
}

export default function AccountSettingsPage() {
  const user = useCurrentUser();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  if (!user) return null;

  return (
    <div className="space-y-6">
      <Section title="Password" description="Use a strong password you don't use anywhere else.">
        <PasswordForm />
      </Section>

      <Section title="Communication" description="Choose what we send you. Order updates are always sent.">
        <Checkbox
          label="New arrivals and offers"
          description="An occasional email about new collections and restocks."
          checked={user.marketingOptIn}
          onChange={(e) => {
            updateProfile({ marketingOptIn: e.target.checked });
            toast({ tone: "success", title: "Preferences saved" });
          }}
        />
      </Section>

      <Section
        title="Delete account"
        description="Permanently remove your account and saved details from this browser."
      >
        <Button
          variant="outline"
          className="border-danger/40 text-danger hover:border-danger hover:bg-danger-soft"
          onClick={() => setConfirmOpen(true)}
        >
          Delete my account
        </Button>
      </Section>

      <Sheet
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete account?"
        side="center"
        className="max-w-md"
      >
        <div className="px-6 pb-6">
          <p className="text-[15px] leading-relaxed text-muted">
            This removes your profile and saved address. Past orders stay on record for the store. This can&rsquo;t be
            undone.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Keep account
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                leaveAccount(() => {
                  deleteAccount();
                  toast({ title: "Account deleted" });
                  router.push("/");
                })
              }
            >
              Delete
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
