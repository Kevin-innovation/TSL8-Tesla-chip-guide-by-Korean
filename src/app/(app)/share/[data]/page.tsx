import Link from "next/link";

import { tsl8ApAssistParams, tsl8BasicSettings } from "@/content/tsl8";
import { decodeSharePayload } from "@/lib/share";

function formatDate(ms: number): string {
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(ms));
  } catch {
    return String(ms);
  }
}

export default async function ShareViewPage({
  params,
}: {
  params: Promise<{ data: string }>;
}) {
  const { data } = await params;
  const payload = decodeSharePayload(data);

  if (!payload) {
    return (
      <div className="grid gap-6">
        <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black/20">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            공유 링크를 해석할 수 없습니다
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            링크가 손상되었거나 버전이 다릅니다.
          </p>
          <Link
            href="/share"
            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-[var(--tsl-teal)] px-4 py-2 text-sm font-extrabold text-white shadow-sm hover:brightness-95"
          >
            셋팅 공유로 돌아가기
          </Link>
        </section>
      </div>
    );
  }

  const apLabelById = new Map(tsl8ApAssistParams.rows.map((r) => [r.id, r.label]));
  const basicLabelById = new Map(tsl8BasicSettings.rows.map((r) => [r.id, r.label]));

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black/20">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              {payload.name}
            </h1>
            <div className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
              생성: {formatDate(payload.createdAt)}
            </div>
          </div>
          <Link
            href="/share"
            className="inline-flex items-center justify-center rounded-2xl bg-[var(--tsl-teal)] px-4 py-2 text-sm font-extrabold text-white shadow-sm hover:brightness-95"
          >
            새로 만들기
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-black/20">
        <div className="bg-[var(--tsl-teal)] px-5 py-3 text-center text-base font-extrabold text-white">
          {tsl8ApAssistParams.title}
        </div>
        <ul className="divide-y divide-black/5 px-5 py-1 dark:divide-white/10">
          {Object.entries(payload.apParams).map(([id, value]) => (
            <li key={id} className="py-3">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {apLabelById.get(id) ?? id}
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {value || <span className="text-slate-400">(미설정)</span>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-black/20">
        <div className="bg-[var(--tsl-teal)] px-5 py-3 text-center text-base font-extrabold text-white">
          {tsl8BasicSettings.title}
        </div>
        <ul className="divide-y divide-black/5 px-5 py-1 dark:divide-white/10">
          {Object.entries(payload.basic).map(([id, value]) => (
            <li key={id} className="py-3">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {basicLabelById.get(id) ?? id}
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {value || <span className="text-slate-400">(미설정)</span>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-black/20">
        <div className="bg-[var(--tsl-teal)] px-5 py-3 text-center text-base font-extrabold text-white">
          단축 명령
        </div>
        {payload.quickCommands.length ? (
          <ul className="divide-y divide-black/5 px-5 py-1 dark:divide-white/10">
            {payload.quickCommands.map((q, idx) => (
              <li key={idx} className="py-3">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  #{idx + 1}
                </div>
                <div className="mt-1 text-sm">
                  <span className="font-extrabold text-slate-900 dark:text-slate-50">
                    트리거:
                  </span>{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {q.trigger || "(미설정)"}
                  </span>
                </div>
                <div className="mt-1 text-sm">
                  <span className="font-extrabold text-slate-900 dark:text-slate-50">
                    동작:
                  </span>{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {q.action || "(미설정)"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-5 py-6 text-sm text-slate-600 dark:text-slate-300">
            (없음)
          </div>
        )}
      </section>
    </div>
  );
}

