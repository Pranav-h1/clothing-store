/** Shared form validation — used by the client forms and the API routes. */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value: string): string | null {
  if (!value.trim()) return "Enter your email address.";
  return EMAIL_PATTERN.test(value.trim()) ? null : "Enter a valid email address, like name@example.com.";
}

/** Accepts international formats: optional +, digits, spaces, dashes, brackets; 7–15 digits. */
export function validatePhone(value: string): string | null {
  if (!value.trim()) return "Enter your phone number.";
  if (!/^\+?[\d\s()-]+$/.test(value.trim())) return "Use digits, spaces and an optional leading +.";
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15 ? null : "Enter a valid phone number with country code.";
}

export function validateRequired(value: string, label: string): string | null {
  return value.trim() ? null : `Enter ${label}.`;
}

export const PASSWORD_MIN = 8;

export function validatePassword(value: string): string | null {
  if (value.length < PASSWORD_MIN) return `Use at least ${PASSWORD_MIN} characters.`;
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return "Use at least one letter and one number.";
  return null;
}

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

/** Returns only the fields that have an error. */
export function collectErrors<K extends string>(checks: Record<K, string | null>): FieldErrors<K> {
  const errors: FieldErrors<K> = {};
  for (const key in checks) if (checks[key]) errors[key] = checks[key]!;
  return errors;
}
