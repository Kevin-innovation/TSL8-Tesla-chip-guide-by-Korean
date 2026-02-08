import Link from "next/link";

import SettingsSectionCard from "@/components/SettingsSection";
import Tsl6Browser from "@/components/Tsl6Browser";
import { quickCommandExamples, tsl8ApAssistParams, tsl8BasicSettings } from "@/content/tsl8";
import { loadTsl6Data } from "@/lib/tsl6";

type GuideView = "tsl8" | "tsl6";

function SegmentedLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
        active
          ? "bg-white text-slate-900 shadow-sm dark:bg-black/30 dark:text-white"
          : "text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

export default async function GuidePage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v } = await searchParams;
  const view: GuideView = v === "tsl6" ? "tsl6" : "tsl8";

  const tsl6Data = view === "tsl6" ? await loadTsl6Data() : null;

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black/20">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              {view === "tsl8"
                ? "TSL8 앱 설정 가이드 (스크린샷 기준)"
                : "TSL6 기능 할당표 (PDF 참고)"}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {view === "tsl8" ? (
                <>
                  이 페이지는 <span className="font-semibold">TSL8 앱 스크린샷</span>
                  에 나온 항목만 기준으로 정리합니다. PDF(TSL6)는 번역/용어 참고용이며,
                  스크린샷에 없는 기능은 가이드에서 제외했습니다.
                </>
              ) : (
                <>
                  이 내용은 <span className="font-semibold">TSL6 PDF</span>에서
                  추출한 목록입니다. TSL8과 메뉴/기능이 다를 수 있으니{" "}
                  <span className="font-semibold">참고용</span>으로만 보세요.
                </>
              )}
            </p>
          </div>

          <div className="inline-flex shrink-0 rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
            <SegmentedLink href="/guide?v=tsl8" active={view === "tsl8"}>
              TSL8
            </SegmentedLink>
            <SegmentedLink href="/guide?v=tsl6" active={view === "tsl6"}>
              TSL6(PDF)
            </SegmentedLink>
          </div>
        </div>
      </section>

      {view === "tsl8" ? (
        <>
          <SettingsSectionCard section={tsl8ApAssistParams} />
          <SettingsSectionCard section={tsl8BasicSettings} />

          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black/20">
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              단축 명령 설정(예시)
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              앱의 <span className="font-semibold">단축 명령 설정</span> 화면에서,
              “트리거(조건/버튼)”와 “동작(실행 기능)”을 한 쌍으로 구성합니다.
            </p>

            <div className="mt-4 grid gap-3">
              {quickCommandExamples.map((ex, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border-2 border-[var(--tsl-teal)]/60 bg-white px-4 py-3 dark:border-[var(--tsl-teal)]/50 dark:bg-black/10"
                >
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    #{idx + 1}
                  </div>
                  <div className="mt-2 grid gap-2">
                    <div className="inline-flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold text-slate-700 dark:bg-white/10 dark:text-slate-200">
                        트리거
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {ex.triggerKo}
                      </span>
                    </div>
                    <div className="inline-flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold text-slate-700 dark:bg-white/10 dark:text-slate-200">
                        동작
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {ex.actionKo}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black/20">
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              번역 정리 기준
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <li>오타/직역(예: “커졌을 때”) → 자연스러운 표현(“켜졌을 때”)으로 수정</li>
              <li>
                버튼 조작 표현 통일(더블클릭 → “두 번 누르기”, 길게 클릭 → “길게 누르기”)
              </li>
              <li>용어 통일(운전석/조수석/2열, 상향등/안개등/비상등 등)</li>
              <li>
                법규/안전 관련 항목은 “주의”로 표시하고, 스크린샷에 없는 기능은 가이드에서 제외
              </li>
            </ul>
          </section>
        </>
      ) : (
        <>
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-900 shadow-sm dark:border-amber-500/30 dark:bg-amber-900/20 dark:text-amber-100">
            <div className="text-sm font-extrabold">주의</div>
            <div className="mt-1 text-sm leading-7">
              TSL6 목록은 TSL8 앱과 일치하지 않을 수 있습니다. 실제 차량/지역 법규/안전
              규정 준수는 사용자 책임입니다.
            </div>
          </section>

          {tsl6Data ? <Tsl6Browser data={tsl6Data} /> : null}
        </>
      )}
    </div>
  );
}
