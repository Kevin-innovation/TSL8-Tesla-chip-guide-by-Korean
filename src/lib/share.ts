import { base64UrlDecodeUtf8, base64UrlEncodeUtf8 } from "@/lib/base64url";

export type QuickCommand = { trigger: string; action: string };

export type SharePayloadV1 = {
  v: 1;
  name: string;
  createdAt: number;
  apParams: Record<string, string>;
  basic: Record<string, string>;
  quickCommands: QuickCommand[];
};

export function encodeSharePayload(payload: SharePayloadV1): string {
  return base64UrlEncodeUtf8(JSON.stringify(payload));
}

function isRecordOfStrings(value: unknown): value is Record<string, string> {
  if (!value || typeof value !== "object") return false;
  for (const v of Object.values(value as Record<string, unknown>)) {
    if (typeof v !== "string") return false;
  }
  return true;
}

export function decodeSharePayload(encoded: string): SharePayloadV1 | null {
  let raw: string;
  try {
    raw = base64UrlDecodeUtf8(encoded);
  } catch {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== "object") return null;
  const obj = parsed as Partial<SharePayloadV1>;

  if (obj.v !== 1) return null;
  if (typeof obj.name !== "string") return null;
  if (typeof obj.createdAt !== "number") return null;
  if (!isRecordOfStrings(obj.apParams)) return null;
  if (!isRecordOfStrings(obj.basic)) return null;
  if (!Array.isArray(obj.quickCommands)) return null;
  for (const item of obj.quickCommands) {
    if (!item || typeof item !== "object") return null;
    const qc = item as Partial<QuickCommand>;
    if (typeof qc.trigger !== "string") return null;
    if (typeof qc.action !== "string") return null;
  }

  return obj as SharePayloadV1;
}

