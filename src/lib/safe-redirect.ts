/** Only allow same-site relative redirects (blocks `//evil.com` and absolute URLs). */
export function safeNext(value: string | null, fallback = "/account") {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}
