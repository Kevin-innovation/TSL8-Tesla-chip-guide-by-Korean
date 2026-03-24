import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AppHeader from "@/components/AppHeader";
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
    <div className="min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(104,182,166,0.16),_transparent_36%),linear-gradient(180deg,_rgba(255,255,255,0.8),_rgba(247,250,249,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(74,168,151,0.22),_transparent_30%),linear-gradient(180deg,_rgba(7,18,20,0.96),_rgba(7,18,20,1))]">
      <AppHeader />

      <main className="mx-auto w-full max-w-[112rem] px-4 py-6 sm:px-5 lg:px-8 xl:px-10 2xl:px-12">
        {children}
      </main>

      <footer className="mx-auto w-full max-w-[112rem] px-4 pb-10 pt-2 sm:px-5 lg:px-8 xl:px-10 2xl:px-12">
        <div className="rounded-3xl border border-black/5 bg-white/80 px-5 py-4 text-xs leading-5 text-slate-500 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/20 dark:text-slate-400">
          본 사이트는 비공식 정보 공유용입니다. 주행 중 조작/설정 변경 금지, 지역
          법규/안전 규정 준수. 법규/안전 관련 항목은 ‘주의’로 표시되어 있습니다.
        </div>
      </footer>
    </div>
  );
}
