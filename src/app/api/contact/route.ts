import { NextResponse } from "next/server";
import { collectErrors, validateEmail, validateRequired } from "@/lib/validation";

/**
 * Contact form endpoint. Validates input; delivery is NOT connected yet.
 * To go live, send the message with an email provider (Resend, Postmark,
 * SES…) or save it to a helpdesk, using a server-side API key from env.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = String(body?.name ?? "");
  const email = String(body?.email ?? "");
  const message = String(body?.message ?? "");

  const errors = collectErrors({
    name: validateRequired(name, "your name"),
    email: validateEmail(email),
    message: message.trim().length < 10 ? "Write a message of at least 10 characters." : null,
  });
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 400 });
  if (message.length > 5000) {
    return NextResponse.json(
      { ok: false, errors: { message: "Keep your message under 5,000 characters." } },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, delivered: false });
}
