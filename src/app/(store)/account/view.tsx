"use client";

import Link from "next/link";
import { useState } from "react";
import { OrderCard } from "@/components/account/order-card";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { EmptyState } from "@/components/ui/misc";
import { business } from "@/config/business";
import { updateProfile, useCurrentUser, type AuthUser } from "@/lib/auth/customer-auth";
import { formatDate } from "@/lib/format";
import { useOrders } from "@/lib/stores/orders";
import { toast } from "@/lib/stores/ui";
import type { Address } from "@/lib/types";
import { collectErrors, validatePhone, validateRequired, type FieldErrors } from "@/lib/validation";

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="font-display text-3xl">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function ProfileForm({ user }: { user: AuthUser }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [errors, setErrors] = useState<FieldErrors<"name" | "phone">>({});

  if (!editing) {
    return (
      <Card
        title="Profile"
        action={
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Icon name="edit" size={15} /> Edit
          </Button>
        }
      >
        <dl className="grid gap-5 text-[15px] sm:grid-cols-3">
          {[
            ["Name", user.name],
            ["Email", user.email],
            ["Phone", user.phone],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[13px] text-muted">{k}</dt>
              <dd className="mt-1 break-words">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-[13px] text-muted">Member since {formatDate(user.createdAt)}</p>
      </Card>
    );
  }

  return (
    <Card title="Profile">
      <form
        noValidate
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          const problems = collectErrors({ name: validateRequired(name, "your name"), phone: validatePhone(phone) });
          setErrors(problems);
          if (Object.keys(problems).length) return;
          updateProfile({ name: name.trim(), phone: phone.trim() });
          setEditing(false);
          toast({ tone: "success", title: "Profile updated" });
        }}
      >
        <Input
          label="Full name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <Input
          label="Phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
        />
        <Input
          label="Email"
          value={user.email}
          disabled
          hint="Contact us to change your email."
          wrapperClassName="sm:col-span-2"
        />
        <div className="flex gap-3 sm:col-span-2">
          <Button type="submit">Save changes</Button>
          <Button variant="ghost" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

type AddressKey = "fullName" | "phone" | "line1" | "city" | "region" | "postalCode";

function AddressForm({ user }: { user: AuthUser }) {
  const blank: Address = {
    fullName: user.name,
    phone: user.phone,
    line1: "",
    line2: "",
    city: "",
    region: "",
    postalCode: "",
    country: business.locale.country,
  };
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Address>(user.address ?? blank);
  const [errors, setErrors] = useState<FieldErrors<AddressKey>>({});
  const bind = (key: keyof Address) => ({
    value: draft[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDraft((d) => ({ ...d, [key]: e.target.value })),
    error: errors[key as AddressKey],
  });

  if (!editing) {
    const a = user.address;
    return (
      <Card
        title="Saved address"
        action={
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            {a ? <Icon name="edit" size={15} /> : <Icon name="plus" size={15} />} {a ? "Edit" : "Add"}
          </Button>
        }
      >
        {a ? (
          <address className="text-[15px] leading-relaxed not-italic">
            {a.fullName} · {a.phone}
            <br />
            {a.line1}
            {a.line2 && `, ${a.line2}`}
            <br />
            {a.city}, {a.region} {a.postalCode}, {a.country}
          </address>
        ) : (
          <p className="text-[15px] text-muted">
            Save an address for faster checkout. Addresses you use at checkout can be saved too.
          </p>
        )}
      </Card>
    );
  }

  return (
    <Card title="Saved address">
      <form
        noValidate
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          const problems = collectErrors<AddressKey>({
            fullName: validateRequired(draft.fullName, "a name"),
            phone: validatePhone(draft.phone),
            line1: validateRequired(draft.line1, "a street address"),
            city: validateRequired(draft.city, "a city"),
            region: validateRequired(draft.region, "a state or region"),
            postalCode: validateRequired(draft.postalCode, "a postal code"),
          });
          setErrors(problems);
          if (Object.keys(problems).length) return;
          updateProfile({ address: draft });
          setEditing(false);
          toast({ tone: "success", title: "Address saved" });
        }}
      >
        <Input label="Full name" autoComplete="name" {...bind("fullName")} />
        <Input label="Phone" type="tel" autoComplete="tel" {...bind("phone")} />
        <Input label="Address" autoComplete="address-line1" wrapperClassName="sm:col-span-2" {...bind("line1")} />
        <Input
          label="Apartment, suite, landmark"
          optional
          autoComplete="address-line2"
          wrapperClassName="sm:col-span-2"
          {...bind("line2")}
        />
        <Input label="City" autoComplete="address-level2" {...bind("city")} />
        <Input label="State / Region" autoComplete="address-level1" {...bind("region")} />
        <Input label="Postal code" autoComplete="postal-code" {...bind("postalCode")} />
        <Input label="Country" value={draft.country} disabled />
        <div className="flex gap-3 sm:col-span-2">
          <Button type="submit">Save address</Button>
          <Button variant="ghost" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default function AccountOverviewPage() {
  const user = useCurrentUser();
  const orders = useOrders();
  if (!user) return null;
  const mine = orders.filter((o) => o.customer.email.toLowerCase() === user.email);

  return (
    <div className="space-y-6">
      <ProfileForm user={user} />
      <AddressForm user={user} />
      <Card
        title="Recent orders"
        action={
          mine.length > 0 && (
            <Link href="/account/orders" className="text-sm font-medium underline-offset-4 hover:underline">
              View all
            </Link>
          )
        }
      >
        {mine.length === 0 ? (
          <EmptyState
            icon="receipt"
            title="No orders yet"
            body="When you place an order it will appear here."
            action={<ButtonLink href="/shop">Start shopping</ButtonLink>}
            className="py-8 sm:py-10"
          />
        ) : (
          <div className="space-y-3">
            {mine.slice(0, 2).map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
