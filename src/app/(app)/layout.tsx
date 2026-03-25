import AppHeader from "@/components/AppHeader";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(104,182,166,0.16),_transparent_36%),linear-gradient(180deg,_rgba(255,255,255,0.8),_rgba(247,250,249,1))] dark:bg-[radial-gradient(circle_at_top,_rgba(74,168,151,0.22),_transparent_30%),linear-gradient(180deg,_rgba(7,18,20,0.96),_rgba(7,18,20,1))]">
      <AppHeader />

      <main className="mx-auto w-full max-w-[112rem] px-4 py-4 sm:px-5 sm:py-6 lg:px-8 xl:px-10 2xl:px-12">
        {children}
      </main>

      <footer className="mx-auto w-full max-w-[112rem] px-4 pb-10 pt-2 sm:px-5 lg:px-8 xl:px-10 2xl:px-12">
        <div className="rounded-3xl border border-black/5 bg-white/80 px-5 py-4 text-center text-xs leading-6 text-slate-500 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/20 dark:text-slate-400">
          <p>
            본 사이트는 비공식 정보 공유용입니다. 주행 중 조작/설정 변경 금지, 지역
            법규 및 안전 규정을 준수하세요. 법규/안전 관련 항목은 ‘주의’로 표시되어
            있습니다.
          </p>
          <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
            © 2026 하쿠 · 🚗 대구•경북 테슬라 오너모임 by 하쿠 · TSL8 Guide
          </p>
        </div>
      </footer>
    </div>
  );
}
