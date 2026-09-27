import { NextResponse } from "next/server";
import { validateEmail } from "@/lib/validation";

/**
 * Newsletter sign-up. Validates the address; no mailing list is connected yet.
 * To go live, add the subscriber to your email platform (Mailchimp, Klaviyo,
 * Brevo…) with a server-side API key from env, ideally with double opt-in.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? "");
  const error = validateEmail(email);
  if (error) return NextResponse.json({ ok: false, error }, { status: 400 });
  return NextResponse.json({ ok: true, subscribed: false });
}
