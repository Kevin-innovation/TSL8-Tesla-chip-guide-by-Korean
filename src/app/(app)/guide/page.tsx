import SettingsSectionCard from "@/components/SettingsSection";
import { quickCommandExamples, tsl8ApAssistParams, tsl8BasicSettings } from "@/content/tsl8";

export default function GuidePage() {
  return (
    <div className="grid gap-6">
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
    </div>
  );
}
