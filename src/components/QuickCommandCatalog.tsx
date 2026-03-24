"use client";

import { useMemo, useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const INITIAL_LIMIT = 60;
  const [tab, setTab] = useState<Tab>("trigger");
  const [category, setCategory] = useState<string>("전체");
  const [query, setQuery] = useState("");
  const [includeProhibited, setIncludeProhibited] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [limit, setLimit] = useState(INITIAL_LIMIT);

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

  const visible = filtered.slice(0, limit);

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:items-center">
        <div className="inline-flex rounded-2xl bg-slate-100 p-1.5 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
          <button
            type="button"
            onClick={() => {
              setTab("trigger");
              setCategory("전체");
              setLimit(INITIAL_LIMIT);
            }}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
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
              setLimit(INITIAL_LIMIT);
            }}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              tab === "action"
                ? "bg-white text-slate-900 shadow-sm dark:bg-black/30 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
            }`}
          >
            동작(기능)
          </button>
        </div>

        {tab === "action" ? (
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 xl:justify-self-end dark:text-slate-300">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--tsl-teal)]"
              checked={includeProhibited}
              onChange={(e) => {
                setIncludeProhibited(e.target.checked);
                setLimit(INITIAL_LIMIT);
              }}
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
          className="h-[3.25rem] w-full rounded-2xl border border-slate-200 bg-white px-4 text-base font-semibold text-slate-900 shadow-sm outline-none ring-[var(--tsl-teal)] focus:ring-2 dark:border-white/10 dark:bg-black/20 dark:text-slate-50"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(INITIAL_LIMIT);
          }}
          placeholder="한국어/중국어 모두 검색 가능"
        />
      </label>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 xl:flex-wrap xl:overflow-visible">
        <Button
          onClick={() => {
            setCategory("전체");
            setLimit(INITIAL_LIMIT);
          }}
          variant={safeCategory === "전체" ? "default" : "secondary"}
          size="sm"
          className={`shrink-0 rounded-full ${
            safeCategory === "전체"
              ? ""
              : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15"
          }`}
        >
          전체 <span className={safeCategory === "전체" ? "text-white/80" : "text-slate-500 dark:text-slate-400"}>{totalCount}</span>
        </Button>
        {categories.map((c) => (
          <Button
            key={c.name}
            onClick={() => {
              setCategory(c.name);
              setLimit(INITIAL_LIMIT);
            }}
            variant={safeCategory === c.name ? "default" : "secondary"}
            size="sm"
            className={`shrink-0 rounded-full ${
              safeCategory === c.name
                ? ""
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15"
            }`}
          >
            {c.name}{" "}
            <span className={safeCategory === c.name ? "text-white/80" : "text-slate-500 dark:text-slate-400"}>
              {c.count}
            </span>
          </Button>
        ))}
      </div>

      {copied ? (
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-100">
          복사됨: {copied}
        </div>
      ) : null}

      <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
        표시: {visible.length} / {filtered.length}
        {filtered.length > visible.length ? " (더 보기 가능)" : ""}
      </div>

      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {visible.map((item) => {
          const koRaw = normalize(item.koRaw);
          const ko = normalize(item.ko);
          const showRaw = koRaw && koRaw !== ko;

          return (
            <button
              key={item.id}
              type="button"
              disabled={isPending}
              className="group rounded-3xl border border-black/10 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md disabled:opacity-60 dark:border-white/10 dark:bg-black/20 dark:hover:bg-white/10"
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
                  <div className="text-base font-extrabold text-slate-900 dark:text-slate-50">
                    {item.ko}
                  </div>
                  {showRaw ? (
                    <div className="mt-2">
                      <Badge variant="secondary">앱 번역: {item.koRaw}</Badge>
                    </div>
                  ) : null}
                  <div className="mt-2">
                    <Badge variant="secondary">中文: {item.zh}</Badge>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {item.prohibited ? (
                    <Badge variant="danger">사용 금지</Badge>
                  ) : (
                    <Badge variant="secondary">복사</Badge>
                  )}
                  <div className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {item.categoryKo}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length > visible.length ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            disabled={isPending}
            onClick={() => setLimit((v) => Math.min(v + INITIAL_LIMIT, filtered.length))}
          >
            더 보기
          </Button>
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => setLimit(filtered.length)}
          >
            모두 보기
          </Button>
        </div>
      ) : null}
    </div>
  );
}
