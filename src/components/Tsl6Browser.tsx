"use client";

import { useMemo, useState } from "react";

import type { Tsl6Data, Tsl6Item } from "@/lib/tsl6";

type TabKey = "functions" | "entities";

function groupByCategory(items: Tsl6Item[]) {
  const map = new Map<string, Tsl6Item[]>();
  for (const item of items) {
    const key = item.categoryKo || "기타";
    const existing = map.get(key);
    if (existing) existing.push(item);
    else map.set(key, [item]);
  }
  return Array.from(map.entries()).map(([category, values]) => ({
    category,
    items: values,
  }));
}

export default function Tsl6Browser({ data }: { data: Tsl6Data }) {
  const [tab, setTab] = useState<TabKey>("functions");
  const [query, setQuery] = useState("");
  const [showProhibited, setShowProhibited] = useState(false);

  const { groups, count } = useMemo(() => {
    const source = tab === "functions" ? data.functions : data.entities;
    const q = query.trim().toLowerCase();

    const filtered = source.filter((item) => {
      if (!showProhibited && item.prohibited) return false;
      if (!q) return true;
      return (
        item.ko.toLowerCase().includes(q) ||
        item.koRaw.toLowerCase().includes(q) ||
        item.zh.toLowerCase().includes(q) ||
        item.categoryKo.toLowerCase().includes(q) ||
        item.categoryZh.toLowerCase().includes(q)
      );
    });

    return { groups: groupByCategory(filtered), count: filtered.length };
  }, [data.entities, data.functions, query, showProhibited, tab]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 rounded-3xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
            <button
              type="button"
              className={`rounded-full px-3 py-1.5 ${tab === "functions" ? "bg-white text-slate-900 shadow-sm dark:bg-black/30 dark:text-white" : "opacity-80"}`}
              onClick={() => setTab("functions")}
            >
              기능(동작)
            </button>
            <button
              type="button"
              className={`rounded-full px-3 py-1.5 ${tab === "entities" ? "bg-white text-slate-900 shadow-sm dark:bg-black/30 dark:text-white" : "opacity-80"}`}
              onClick={() => setTab("entities")}
            >
              엔티티/이벤트(트리거)
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--tsl-teal)]"
              checked={showProhibited}
              onChange={(e) => setShowProhibited(e.target.checked)}
            />
            사용 금지/주의 항목 표시
          </label>
        </div>

        <div className="grid gap-2">
          <input
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none ring-[var(--tsl-teal)] focus:ring-2 dark:border-white/10 dark:bg-black/20"
            placeholder="검색: 한국어/중국어/카테고리"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {count.toLocaleString()}개 결과
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {groups.map((group) => (
          <section
            key={group.category}
            className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-black/20"
          >
            <div className="bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 dark:bg-black/30 dark:text-slate-50">
              {group.category}
            </div>
            <ul className="divide-y divide-black/5 dark:divide-white/10">
              {group.items.map((item) => (
                <li key={item.id} className="px-5 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {item.ko}
                    </div>
                    {item.prohibited ? (
                      <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-800 dark:bg-rose-900/30 dark:text-rose-200">
                        사용 금지/주의
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    앱 번역: {item.koRaw || item.ko}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    중국어: {item.zh}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
