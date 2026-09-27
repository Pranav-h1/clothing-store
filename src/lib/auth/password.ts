/**
 * Password hashing with PBKDF2-SHA256 (Web Crypto). Used by the DEMO auth so
 * that even demo passwords are never stored in plain text. In production,
 * hash on the server (argon2id or bcrypt) — never trust client-side hashing
 * as your only protection.
 */
const ITERATIONS = 210_000;

function toHex(buffer: ArrayBuffer | Uint8Array): string {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

async function derive(password: string, salt: Uint8Array<ArrayBuffer>): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS },
    key,
    256,
  );
  return toHex(bits);
}

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return { hash: await derive(password, salt), salt: toHex(salt) };
}

export async function verifyPassword(password: string, hash: string, salt: string) {
  const candidate = await derive(password, fromHex(salt));
  // Constant-time comparison.
  let diff = candidate.length ^ hash.length;
  for (let i = 0; i < Math.min(candidate.length, hash.length); i++) {
    diff |= candidate.charCodeAt(i) ^ hash.charCodeAt(i);
  }
  return diff === 0;
}
