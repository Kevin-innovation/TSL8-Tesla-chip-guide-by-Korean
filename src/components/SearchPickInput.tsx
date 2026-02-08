"use client";

import { useMemo, useRef, useState } from "react";

export type SuggestItem = {
  label: string;
  meta?: string;
};

export default function SearchPickInput({
  value,
  onChange,
  placeholder,
  items,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  items: SuggestItem[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? items.filter(
          (i) =>
            i.label.toLowerCase().includes(q) ||
            (i.meta ? i.meta.toLowerCase().includes(q) : false),
        )
      : items;
    return filtered.slice(0, 30);
  }, [items, query]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none ring-[var(--tsl-teal)] focus:ring-2 dark:border-white/10 dark:bg-black/20 dark:text-slate-50"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          const next = e.target.value;
          onChange(next);
          setQuery(next);
          setOpen(true);
        }}
        onFocus={() => {
          setQuery(value);
          setOpen(true);
        }}
        onBlur={() => {
          // allow click selection
          window.setTimeout(() => setOpen(false), 120);
        }}
      />

      {open && suggestions.length > 0 ? (
        <div className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-black/10 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-[#0b1618]">
          {suggestions.map((s) => (
            <button
              key={`${s.label}:${s.meta ?? ""}`}
              type="button"
              className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-white/10"
              onMouseDown={(e) => {
                // prevent blur before click
                e.preventDefault();
              }}
              onClick={() => {
                onChange(s.label);
                setOpen(false);
                inputRef.current?.focus();
              }}
            >
              <div className="font-semibold text-slate-900 dark:text-slate-50">
                {s.label}
              </div>
              {s.meta ? (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {s.meta}
                </div>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

