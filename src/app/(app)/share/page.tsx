import ShareBuilder from "@/components/ShareBuilder";
import type { SuggestItem } from "@/components/SearchPickInput";
import { loadTsl6Data } from "@/lib/tsl6";

function uniq(items: SuggestItem[]): SuggestItem[] {
  const seen = new Set<string>();
  const out: SuggestItem[] = [];
  for (const item of items) {
    const key = `${item.label}__${item.meta ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

export default async function SharePage() {
  const tsl6 = await loadTsl6Data();

  const triggerSuggestions = uniq(
    tsl6.entities
      .map((e) => ({
        label: e.ko,
        meta: `${e.categoryKo} · 中文: ${e.zh}${
          e.koRaw.trim() && e.koRaw.trim() !== e.ko.trim() ? ` · 앱: ${e.koRaw}` : ""
        }`,
      }))
      .filter((i) => i.label && !i.label.includes("작업 없음")),
  );

  const actionSuggestions = uniq(
    tsl6.functions
      .map((f) => ({
        label: f.ko,
        meta: `${f.categoryKo}${f.prohibited ? " · 사용 금지" : ""} · 中文: ${f.zh}${
          f.koRaw.trim() && f.koRaw.trim() !== f.ko.trim() ? ` · 앱: ${f.koRaw}` : ""
        }`,
      }))
      .filter((i) => i.label && !i.label.includes("작업 없음")),
  );

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black/20">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          셋팅 공유
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          로그인 없이 공유 링크로 셋팅 내용을 전달하는 방식입니다. 링크는 URL 안에
          텍스트 데이터가 포함되므로, 너무 많은 항목을 넣으면 길어질 수 있습니다.
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          단축 명령의 트리거/동작 제안 목록은{" "}
          <span className="font-semibold">TSL6 기능 할당표(PDF) 추출 데이터</span>를
          기반으로 합니다.
        </p>
      </section>

      <ShareBuilder
        triggerSuggestions={triggerSuggestions}
        actionSuggestions={actionSuggestions}
      />
    </div>
  );
}
