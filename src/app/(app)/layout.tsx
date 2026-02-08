import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LogoutButton from "@/components/LogoutButton";
import SiteBanner from "@/components/SiteBanner";
import { getSessionCookieName, verifySessionToken } from "@/lib/auth";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (!token || !verifySessionToken(token)) redirect("/gate");

  return (
    <div className="min-h-dvh bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-[var(--tsl-teal)] text-white dark:border-white/10">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <Link href="/guide" className="block truncate text-base font-extrabold">
              TSL 셋팅 공유
            </Link>
            <div className="truncate text-xs font-semibold text-white/80">
              TK테슬라방 - 하쿠
            </div>
          </div>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 sm:flex">
              <Link
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-white/90 hover:bg-white/15 hover:text-white"
                href="/guide"
              >
                가이드
              </Link>
              <Link
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-white/90 hover:bg-white/15 hover:text-white"
                href="/share"
              >
                셋팅 공유
              </Link>
            </nav>
            <LogoutButton />
          </div>
        </div>

        <div className="sm:hidden">
          <div className="mx-auto flex w-full max-w-3xl gap-2 overflow-x-auto px-4 pb-3">
            <Link
              className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white"
              href="/guide"
            >
              가이드
            </Link>
            <Link
              className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white"
              href="/share"
            >
              셋팅 공유
            </Link>
          </div>
        </div>
      </header>

      <SiteBanner priority />

      <main className="mx-auto w-full max-w-3xl px-4 py-6">{children}</main>

      <footer className="mx-auto w-full max-w-3xl px-4 pb-10 pt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
        본 사이트는 비공식 정보 공유용입니다. 주행 중 조작/설정 변경 금지, 지역
        법규/안전 규정 준수. 위험/금지 항목은 기본적으로 숨김 처리했습니다.
      </footer>
    </div>
  );
}
