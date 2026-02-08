import crypto from "node:crypto";

const SESSION_COOKIE_NAME = "tsl_session";
const SESSION_VERSION = 1;
const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}

export function getAllowedAccessCodes(): string[] {
  const raw =
    process.env.TSL_ACCESS_CODES?.trim() ?? process.env.TSL_ACCESS_CODE?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isValidAccessCode(code: string): boolean {
  const trimmed = code.trim();
  if (!trimmed) return false;
  return getAllowedAccessCodes().some((allowed) =>
    timingSafeEquals(trimmed, allowed),
  );
}

export type SessionPayload = {
  v: number;
  iat: number; // unix seconds
  exp: number; // unix seconds
};

function getAuthSecretMaybe(): string | null {
  const secret = process.env.TSL_AUTH_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return "dev-secret-change-me";
  return null;
}

function sign(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

function timingSafeEquals(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export function createSessionToken(opts?: { ttlSeconds?: number }): string {
  const ttlSeconds = opts?.ttlSeconds ?? DEFAULT_SESSION_TTL_SECONDS;
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    v: SESSION_VERSION,
    iat: now,
    exp: now + ttlSeconds,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload), "utf-8").toString(
    "base64url",
  );
  const secret = getAuthSecretMaybe();
  if (!secret) throw new Error("TSL_AUTH_SECRET is not set");
  const signature = sign(payloadB64, secret);
  return `${payloadB64}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const secret = getAuthSecretMaybe();
  if (!secret) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, signature] = parts;
  if (!payloadB64 || !signature) return null;

  const expected = sign(payloadB64, secret);
  if (!timingSafeEquals(signature, expected)) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
  } catch {
    return null;
  }

  if (payload?.v !== SESSION_VERSION) return null;
  if (typeof payload.iat !== "number" || typeof payload.exp !== "number")
    return null;

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) return null;
  return payload;
}
