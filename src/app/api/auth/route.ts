import { NextResponse } from "next/server";

import {
  createSessionToken,
  getSessionCookieName,
  isValidAccessCode,
} from "@/lib/auth";

export async function POST(req: Request) {
  let code = "";
  try {
    const body = (await req.json()) as { code?: unknown };
    code = typeof body.code === "string" ? body.code : "";
  } catch {
    // ignore
  }

  if (!isValidAccessCode(code)) {
    return NextResponse.json(
      { ok: false, error: "INVALID_CODE" },
      { status: 401 },
    );
  }

  let token = "";
  try {
    token = createSessionToken();
  } catch {
    return NextResponse.json(
      { ok: false, error: "SERVER_MISCONFIG" },
      { status: 500 },
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: getSessionCookieName(),
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
