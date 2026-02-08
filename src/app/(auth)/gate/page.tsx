import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import GateForm from "@/components/GateForm";
import SiteBanner from "@/components/SiteBanner";
import {
  getAllowedAccessCodes,
  getSessionCookieName,
  verifySessionToken,
} from "@/lib/auth";

export default async function GatePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (token && verifySessionToken(token)) redirect("/guide");

  const hasCodes = getAllowedAccessCodes().length > 0;
  const hasSecret =
    Boolean(process.env.TSL_AUTH_SECRET?.trim()) ||
    process.env.NODE_ENV !== "production";
  const canLogin = hasCodes && hasSecret;

  return (
    <div className="min-h-dvh bg-[var(--background)] pb-12">
      <SiteBanner containerClassName="max-w-md" priority />

      <div className="mx-auto w-full max-w-md px-4 pt-6">
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black/20">
          <div className="text-center">
            <div className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              TSL 셋팅 공유
            </div>
            <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              TSL8 설정 가이드 · 단축 명령 공유
              <br />
              <span className="font-semibold">TK테슬라방 - 하쿠</span>
            </div>
          </div>

          {!canLogin ? (
            <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 dark:bg-amber-900/25 dark:text-amber-100">
              서버 설정이 완료되지 않았습니다.
              <div className="mt-2 text-xs font-medium leading-5">
                필요한 환경변수: <span className="font-extrabold">TSL_ACCESS_CODES</span>
                {process.env.NODE_ENV === "production" ? (
                  <>
                    , <span className="font-extrabold">TSL_AUTH_SECRET</span>
                  </>
                ) : null}
              </div>
            </div>
          ) : (
            <GateForm />
          )}
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
          주의: 본 사이트는 비공식 정보 공유용입니다. 주행 중 사용 금지, 지역
          법규/안전 규정 준수.
        </p>
      </div>
    </div>
  );
}
