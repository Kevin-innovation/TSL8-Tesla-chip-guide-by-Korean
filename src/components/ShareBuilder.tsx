"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import { quickCommandExamples, tsl8ApAssistParams, tsl8BasicSettings } from "@/content/tsl8";
import type { SuggestItem } from "@/components/SearchPickInput";
import SearchPickInput from "@/components/SearchPickInput";
import { encodeSharePayload, type QuickCommand, type SharePayloadV1 } from "@/lib/share";

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-3">
      <div className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
        {title}
      </div>
      {subtitle ? (
        <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black/20 sm:p-5">
      {children}
    </div>
  );
}

export default function ShareBuilder({
  triggerSuggestions,
  actionSuggestions,
}: {
  triggerSuggestions: SuggestItem[];
  actionSuggestions: SuggestItem[];
}) {
  const [createdAt] = useState(() => Date.now());
  const [name, setName] = useState("하쿠 예시 셋팅");

  const [apParams, setApParams] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      tsl8ApAssistParams.rows.map((r) => [r.id, r.valueExample ?? ""]),
    ),
  );
  const [basic, setBasic] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      tsl8BasicSettings.rows.map((r) => [r.id, r.valueExample ?? ""]),
    ),
  );
  const [quickCommands, setQuickCommands] = useState<QuickCommand[]>(() =>
    quickCommandExamples.map((e) => ({ trigger: e.triggerKo, action: e.actionKo })),
  );

  const payload: SharePayloadV1 = useMemo(
    () => ({
      v: 1,
      name,
      createdAt,
      apParams,
      basic,
      quickCommands: quickCommands
        .map((q) => ({ trigger: q.trigger.trim(), action: q.action.trim() }))
        .filter((q) => q.trigger || q.action),
    }),
    [apParams, basic, createdAt, name, quickCommands],
  );

  const encoded = useMemo(() => encodeSharePayload(payload), [payload]);
  const sharePath = `/share/${encoded}`;

  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="grid gap-6">
      <Card>
        <SectionTitle title="셋팅 공유 만들기" subtitle="현재 화면의 값을 기반으로 공유 링크를 생성합니다." />
        <label className="grid gap-1">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            셋팅 이름
          </span>
          <input
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none ring-[var(--tsl-teal)] focus:ring-2 dark:border-white/10 dark:bg-black/20 dark:text-slate-50"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 내 TSL8 기본 셋팅"
          />
        </label>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-2xl bg-[var(--tsl-teal)] px-4 py-2 text-sm font-extrabold text-white shadow-sm hover:brightness-95 disabled:opacity-60"
            onClick={() => {
              startTransition(async () => {
                setCopyState("idle");
                try {
                  const url = new URL(sharePath, window.location.origin).toString();
                  await navigator.clipboard.writeText(url);
                  setCopyState("copied");
                } catch {
                  setCopyState("error");
                }
              });
            }}
          >
            {isPending ? "복사 중…" : "공유 링크 복사"}
          </button>

          <Link
            href={sharePath}
            className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-black/20 dark:text-slate-50 dark:hover:bg-white/10"
          >
            링크로 보기
          </Link>

          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {copyState === "copied"
              ? "복사됨"
              : copyState === "error"
                ? "복사 실패 (수동으로 복사하세요)"
                : null}
          </div>
        </div>

        <div className="mt-3 break-all rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600 dark:bg-black/30 dark:text-slate-300">
          {sharePath}
        </div>
      </Card>

      <Card>
        <SectionTitle
          title={tsl8ApAssistParams.title}
          subtitle="스크린샷 기반으로 한국어 표현을 정리했습니다. 앱 표기와 다를 수 있어요."
        />
        <div className="grid gap-3">
          {tsl8ApAssistParams.rows.map((row) => (
            <label key={row.id} className="grid gap-1">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {row.label}
              </span>
              <input
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none ring-[var(--tsl-teal)] focus:ring-2 dark:border-white/10 dark:bg-black/20 dark:text-slate-50"
                value={apParams[row.id] ?? ""}
                onChange={(e) =>
                  setApParams((prev) => ({ ...prev, [row.id]: e.target.value }))
                }
                placeholder={row.valueExample ?? ""}
              />
              {row.help ? (
                <span className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {row.help}
                </span>
              ) : null}
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle
          title={tsl8BasicSettings.title}
          subtitle="스크린샷에서 확인 가능한 항목 중심으로 정리했습니다."
        />
        <div className="grid gap-3">
          {tsl8BasicSettings.rows.map((row) => (
            <label key={row.id} className="grid gap-1">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {row.label}
              </span>
              <input
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none ring-[var(--tsl-teal)] focus:ring-2 dark:border-white/10 dark:bg-black/20 dark:text-slate-50"
                value={basic[row.id] ?? ""}
                onChange={(e) =>
                  setBasic((prev) => ({ ...prev, [row.id]: e.target.value }))
                }
                placeholder={row.valueExample ?? ""}
              />
              {row.help ? (
                <span className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {row.help}
                </span>
              ) : null}
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle
          title="단축 명령(예시/공유)"
          subtitle="앱의 ‘단축 명령 설정’ 화면을 참고해, 트리거/동작을 텍스트로 공유할 수 있게 만들었습니다."
        />

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="text-xs font-extrabold text-slate-500 dark:text-slate-400">
            추천 템플릿
          </div>
          {quickCommandExamples.map((t) => (
            <button
              key={`${t.triggerKo}__${t.actionKo}`}
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-extrabold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-black/20 dark:text-slate-50 dark:hover:bg-white/10"
              onClick={() =>
                setQuickCommands((prev) => [
                  ...prev,
                  { trigger: t.triggerKo, action: t.actionKo },
                ])
              }
            >
              {t.actionKo}
            </button>
          ))}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-extrabold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-black/20 dark:text-slate-50 dark:hover:bg-white/10"
            onClick={() =>
              setQuickCommands(
                quickCommandExamples.map((t) => ({
                  trigger: t.triggerKo,
                  action: t.actionKo,
                })),
              )
            }
          >
            예시로 초기화
          </button>
        </div>

        <div className="grid gap-4">
          {quickCommands.map((cmd, idx) => (
            <div
              key={idx}
              className="rounded-3xl border-2 border-[var(--tsl-teal)]/60 bg-white p-4 shadow-sm dark:border-[var(--tsl-teal)]/50 dark:bg-black/10"
            >
              <div className="grid gap-3">
                <div className="grid gap-1">
                  <div className="text-sm font-extrabold text-slate-900 dark:text-slate-50">
                    트리거(엔티티/이벤트)
                  </div>
                  <SearchPickInput
                    value={cmd.trigger}
                    onChange={(next) =>
                      setQuickCommands((prev) =>
                        prev.map((p, i) => (i === idx ? { ...p, trigger: next } : p)),
                      )
                    }
                    items={triggerSuggestions}
                    placeholder="예: 운전석 허리받침 아래 버튼 두 번 누르기"
                  />
                </div>

                <div className="grid gap-1">
                  <div className="text-sm font-extrabold text-slate-900 dark:text-slate-50">
                    동작(기능)
                  </div>
                  <SearchPickInput
                    value={cmd.action}
                    onChange={(next) =>
                      setQuickCommands((prev) =>
                        prev.map((p, i) => (i === idx ? { ...p, action: next } : p)),
                      )
                    }
                    items={actionSuggestions}
                    placeholder="예: 글로브박스 열기"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  #{idx + 1}
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-3 py-2 text-xs font-extrabold text-slate-900 hover:bg-slate-50 dark:border-white/10 dark:bg-black/20 dark:text-slate-50 dark:hover:bg-white/10"
                  onClick={() =>
                    setQuickCommands((prev) => prev.filter((_, i) => i !== idx))
                  }
                >
                  삭제
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="h-11 rounded-2xl border border-black/10 bg-white text-sm font-extrabold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-black/20 dark:text-slate-50 dark:hover:bg-white/10"
            onClick={() =>
              setQuickCommands((prev) => [...prev, { trigger: "", action: "" }])
            }
          >
            + 단축 명령 추가
          </button>
        </div>
      </Card>
    </div>
  );
}
