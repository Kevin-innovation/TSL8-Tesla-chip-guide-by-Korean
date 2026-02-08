import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AppHeader from "@/components/AppHeader";
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
      <AppHeader />

      <SiteBanner priority />

      <main className="mx-auto w-full max-w-3xl px-4 py-6">{children}</main>

      <footer className="mx-auto w-full max-w-3xl px-4 pb-10 pt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
        본 사이트는 비공식 정보 공유용입니다. 주행 중 조작/설정 변경 금지, 지역
        법규/안전 규정 준수. 법규/안전 관련 항목은 ‘주의’로 표시되어 있습니다.
      </footer>
    </div>
  );
}
