"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Notice } from "@/components/ui/misc";
import { business } from "@/config/business";
import { collectErrors, validateEmail, validateRequired, type FieldErrors } from "@/lib/validation";

type Key = "name" | "email" | "message";

const TOPICS = ["Order & delivery", "Returns & exchanges", "Sizing & fit", "Product question", "Something else"];

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", orderId: "", topic: TOPICS[0], message: "" });
  const [errors, setErrors] = useState<FieldErrors<Key>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const bind = (key: keyof typeof values) => ({
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value })),
  });

  if (status === "sent") {
    return (
      <div
        className="flex flex-col items-center rounded-3xl border border-line bg-surface px-6 py-16 text-center"
        role="status"
      >
        <span className="flex size-14 animate-rise items-center justify-center rounded-full bg-success text-white">
          <Icon name="check" size={26} strokeWidth={2} />
        </span>
        <h2 className="mt-6 font-display text-4xl">Message received</h2>
        <p className="mt-2 max-w-sm text-[15px] text-muted">{business.contact.responseTime}</p>
        {business.isDemo && (
          <p className="mt-4 max-w-sm text-[13px] text-subtle">
            Demo mode: the form validates and submits, but no email provider is connected, so the message wasn&rsquo;t
            delivered.
          </p>
        )}
        <Button
          variant="outline"
          className="mt-8"
          onClick={() => {
            setValues((v) => ({ ...v, orderId: "", message: "" }));
            setStatus("idle");
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="rounded-3xl border border-line bg-surface p-6 sm:p-8"
      onSubmit={async (e) => {
        e.preventDefault();
        setFormError(null);
        const problems = collectErrors<Key>({
          name: validateRequired(values.name, "your name"),
          email: validateEmail(values.email),
          message: values.message.trim().length < 10 ? "Write a message of at least 10 characters." : null,
        });
        setErrors(problems);
        if (Object.keys(problems).length) return;
        setStatus("sending");
        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const data = await res.json();
          if (!res.ok) {
            setErrors(data.errors ?? {});
            throw new Error("Please check the highlighted fields.");
          }
          setStatus("sent");
        } catch (error) {
          setFormError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
          setStatus("idle");
        }
      }}
    >
      <h2 className="font-display text-3xl">Send us a message</h2>
      <p className="mt-1 text-sm text-muted">{business.contact.responseTime}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {formError && (
          <Notice tone="danger" icon="alert" className="sm:col-span-2">
            <span role="alert">{formError}</span>
          </Notice>
        )}
        <Input label="Name" autoComplete="name" error={errors.name} {...bind("name")} />
        <Input label="Email" type="email" autoComplete="email" error={errors.email} {...bind("email")} />
        <Select label="Topic" {...bind("topic")}>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
        <Input label="Order number" optional placeholder="e.g. ORD-XXXX" {...bind("orderId")} />
        <Textarea
          label="Message"
          error={errors.message}
          wrapperClassName="sm:col-span-2"
          maxLength={5000}
          {...bind("message")}
        />
        <Button type="submit" size="lg" loading={status === "sending"} className="sm:col-span-2 sm:justify-self-start">
          Send message
        </Button>
      </div>
    </form>
  );
}
