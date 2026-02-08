export function base64UrlEncodeUtf8(text: string): string {
  if (typeof Buffer !== "undefined") {
    // Some browser Buffer polyfills don't support the "base64url" encoding.
    // Use standard base64 and normalize to base64url manually for portability.
    return Buffer.from(text, "utf-8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }

  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function base64UrlDecodeUtf8(base64Url: string): string {
  const b64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);

  if (typeof Buffer !== "undefined") {
    // Same portability note as above: decode via standard base64.
    return Buffer.from(padded, "base64").toString("utf-8");
  }

  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
