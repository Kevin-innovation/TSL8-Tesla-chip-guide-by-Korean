import Link from "next/link";

import SettingsSectionCard from "@/components/SettingsSection";
import { quickCommandExamples, tsl8ApAssistParams, tsl8BasicSettings } from "@/content/tsl8";
import { loadTsl6Data } from "@/lib/tsl6";

type CategorySummary = { category: string; count: number; examples: string[] };

function summarizeByCategory(
  items: Array<{ categoryKo: string; ko: string }>,
  { maxCategories = 6, maxExamples = 3 }: { maxCategories?: number; maxExamples?: number } = {},
): CategorySummary[] {
  const map = new Map<string, { count: number; examples: string[]; seen: Set<string> }>();

  for (const item of items) {
    const label = item.ko.trim();
    if (!label) continue;
    if (label.includes("작업 없음")) continue;

    const category = item.categoryKo.trim() || "기타";
    const entry = map.get(category) ?? {
      count: 0,
      examples: [],
      seen: new Set<string>(),
    };

    entry.count += 1;
    if (entry.examples.length < maxExamples && !entry.seen.has(label)) {
      entry.examples.push(label);
      entry.seen.add(label);
    }

    map.set(category, entry);
  }

  return [...map.entries()]
    .map(([category, data]) => ({ category, count: data.count, examples: data.examples }))
    .sort((a, b) => b.count - a.count)
    .slice(0, maxCategories);
}

export default async function GuidePage() {
  const tsl6 = await loadTsl6Data();
  const triggerSummary = summarizeByCategory(tsl6.entities);
  const actionSummary = summarizeByCategory(
    tsl6.functions.filter((f) => !f.prohibited),
  );

  const basicById = new Map(tsl8BasicSettings.rows.map((r) => [r.id, r] as const));
  const recommendedBasics = [
    {
      id: "door_open_hazard",
      reason: "도어가 열릴 때 주변 차량/보행자에게 알림이 필요할 때 유용합니다.",
    },
    {
      id: "reverse_hazard",
      reason: "후진 시 시인성을 높이고 싶을 때 유용합니다.",
    },
    {
      id: "handle_frunk",
      reason: "프렁크를 자주 쓰는 경우, 버튼 조합으로 빠르게 열 수 있습니다.",
    },
    {
      id: "ac_auto_dry",
      reason: "에어컨 냄새/습기 관리를 위해 자동 건조를 사용합니다.",
    },
    {
      id: "passenger_easy_entry",
      reason: "조수석 승하차 편의 동작을 조건에 맞게 자동 수행합니다.",
    },
  ] as const;
  const recommendedBasicRows = recommendedBasics
    .map((r) => {
      const row = basicById.get(r.id);
      if (!row) return null;
      return { row, reason: r.reason };
    })
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  return (
    <div className="grid gap-6">
      <SettingsSectionCard section={tsl8ApAssistParams} />
      <SettingsSectionCard section={tsl8BasicSettings} />

      <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black/20">
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          추천 시작 설정
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
          아래는 <span className="font-semibold">입문용으로 자주 쓰는</span> 항목을
          추려 정리한 예시입니다. 차량/지역 법규/개인 취향에 따라 달라질 수 있어요.
        </p>

        <div className="mt-4 grid gap-3">
          {recommendedBasicRows.map(({ row, reason }) => (
            <div
              key={row.id}
              className="rounded-3xl border border-black/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-extrabold text-slate-900 dark:text-slate-50">
                    {row.label}
                  </div>
                  <div className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                    {reason}
                  </div>
                </div>
                <div className="shrink-0">
                  <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm dark:border-white/10 dark:bg-black/20 dark:text-slate-100">
                    {row.valueExample ?? "(미설정)"}
                    <span className="ml-1 text-slate-500 dark:text-slate-400">
                      ▾
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Link
            href="/share"
            className="inline-flex items-center justify-center rounded-2xl bg-[var(--tsl-teal)] px-4 py-2 text-sm font-extrabold text-white shadow-sm hover:brightness-95"
          >
            내 셋팅 만들기
          </Link>
        </div>
      </section>

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
          단축 명령: 트리거/동작 목록(요약)
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
          트리거(조건/이벤트)와 동작(기능) 목록은{" "}
          <span className="font-semibold">TSL6 기능 할당표(PDF) 추출 데이터</span>를
          기반으로 정리했습니다. 전체 목록은{" "}
          <Link href="/share" className="font-semibold underline">
            셋팅 공유
          </Link>
          에서 검색 입력창을 눌러 확인할 수 있어요.
        </p>

        <details className="mt-4 rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm dark:border-white/10 dark:bg-black/30">
          <summary className="cursor-pointer select-none font-extrabold text-slate-900 dark:text-slate-50">
            카테고리/예시 보기
          </summary>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-slate-50">
                트리거(조건) TOP
              </div>
              <ul className="mt-2 space-y-3">
                {triggerSummary.map((c) => (
                  <li key={c.category}>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {c.category}{" "}
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        ({c.count})
                      </span>
                    </div>
                    <div className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                      {c.examples.join(" · ")}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-slate-50">
                동작(기능) TOP
              </div>
              <ul className="mt-2 space-y-3">
                {actionSummary.map((c) => (
                  <li key={c.category}>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {c.category}{" "}
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        ({c.count})
                      </span>
                    </div>
                    <div className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                      {c.examples.join(" · ")}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </details>
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
