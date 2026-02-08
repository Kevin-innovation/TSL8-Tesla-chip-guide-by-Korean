"use client";

import { useMemo, useState, useTransition } from "react";

import type { Tsl6Item } from "@/lib/tsl6";

type Tab = "trigger" | "action";

type CategoryStat = { name: string; count: number };

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function toSearchHaystack(item: Tsl6Item): string {
  return [
    item.categoryKo,
    item.ko,
    item.koRaw,
    item.zh,
    item.prohibited ? "사용 금지" : "",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function buildCategories(items: Tsl6Item[]): CategoryStat[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const category = normalize(item.categoryKo || "기타") || "기타";
    map.set(category, (map.get(category) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export default function QuickCommandCatalog({
  entities,
  functions,
}: {
  entities: Tsl6Item[];
  functions: Tsl6Item[];
}) {
  const [tab, setTab] = useState<Tab>("trigger");
  const [category, setCategory] = useState<string>("전체");
  const [query, setQuery] = useState("");
  const [includeProhibited, setIncludeProhibited] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const baseItems = tab === "trigger" ? entities : functions;
  const items = useMemo(() => {
    if (tab !== "action") return baseItems;
    return includeProhibited ? baseItems : baseItems.filter((i) => !i.prohibited);
  }, [baseItems, includeProhibited, tab]);

  const categories = useMemo(() => buildCategories(items), [items]);
  const totalCount = items.length;

  const safeCategory = useMemo(() => {
    if (category === "전체") return "전체";
    if (categories.some((c) => c.name === category)) return category;
    return "전체";
  }, [categories, category]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matchCategory =
      safeCategory === "전체"
        ? () => true
        : (i: Tsl6Item) => normalize(i.categoryKo || "기타") === safeCategory;
    const matchQuery = q
      ? (i: Tsl6Item) => toSearchHaystack(i).includes(q)
      : () => true;

    return items.filter((i) => matchCategory(i) && matchQuery(i));
  }, [items, query, safeCategory]);

  const visible = filtered.slice(0, 60);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
          <button
            type="button"
            onClick={() => {
              setTab("trigger");
              setCategory("전체");
            }}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
              tab === "trigger"
                ? "bg-white text-slate-900 shadow-sm dark:bg-black/30 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
            }`}
          >
            트리거(조건)
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("action");
              setCategory("전체");
            }}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
              tab === "action"
                ? "bg-white text-slate-900 shadow-sm dark:bg-black/30 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
            }`}
          >
            동작(기능)
          </button>
        </div>

        {tab === "action" ? (
          <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--tsl-teal)]"
              checked={includeProhibited}
              onChange={(e) => setIncludeProhibited(e.target.checked)}
            />
            사용 금지 포함
          </label>
        ) : null}
      </div>

      <label className="grid gap-1">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          검색
        </span>
        <input
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none ring-[var(--tsl-teal)] focus:ring-2 dark:border-white/10 dark:bg-black/20 dark:text-slate-50"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="한국어/중국어 모두 검색 가능"
        />
      </label>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        <button
          type="button"
          onClick={() => setCategory("전체")}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold transition ${
            safeCategory === "전체"
              ? "bg-[var(--tsl-teal)] text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15"
          }`}
        >
          전체{" "}
          <span className="ml-1 text-white/80">
            {totalCount}
          </span>
        </button>
        {categories.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => setCategory(c.name)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold transition ${
              safeCategory === c.name
                ? "bg-[var(--tsl-teal)] text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15"
            }`}
          >
            {c.name}{" "}
            <span className="ml-1 text-white/80">
              {c.count}
            </span>
          </button>
        ))}
      </div>

      {copied ? (
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-100">
          복사됨: {copied}
        </div>
      ) : null}

      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        표시: {visible.length} / {filtered.length}
        {filtered.length > 60 ? " (상위 60개만 표시)" : ""}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {visible.map((item) => {
          const koRaw = normalize(item.koRaw);
          const ko = normalize(item.ko);
          const showRaw = koRaw && koRaw !== ko;

          return (
            <button
              key={item.id}
              type="button"
              disabled={isPending}
              className="group rounded-3xl border border-black/10 bg-white p-4 text-left shadow-sm hover:bg-slate-50 disabled:opacity-60 dark:border-white/10 dark:bg-black/20 dark:hover:bg-white/10"
              onClick={() => {
                startTransition(async () => {
                  const text = item.ko.trim();
                  try {
                    await navigator.clipboard.writeText(text);
                    setCopied(text);
                    window.setTimeout(() => setCopied(null), 1600);
                  } catch {
                    setCopied(null);
                  }
                });
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-extrabold text-slate-900 dark:text-slate-50">
                    {item.ko}
                  </div>
                  {showRaw ? (
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      앱 번역: {item.koRaw}
                    </div>
                  ) : null}
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    中文: {item.zh}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {item.prohibited ? (
                    <div className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-extrabold text-rose-900 dark:bg-rose-900/30 dark:text-rose-100">
                      사용 금지
                    </div>
                  ) : (
                    <div className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-extrabold text-slate-700 dark:bg-white/10 dark:text-slate-200">
                      복사
                    </div>
                  )}
                  <div className="mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {item.categoryKo}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

