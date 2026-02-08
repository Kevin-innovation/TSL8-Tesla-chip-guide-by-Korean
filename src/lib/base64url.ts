export function base64UrlEncodeUtf8(text: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(text, "utf-8").toString("base64url");
  }

  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function base64UrlDecodeUtf8(base64Url: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(base64Url, "base64url").toString("utf-8");
  }

  const b64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
