import type { SettingSection } from "@/content/tsl8";

function CautionBadge({ kind }: { kind: "info" | "warning" }) {
  const label = kind === "warning" ? "주의" : "참고";
  const cls =
    kind === "warning"
      ? "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200"
      : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}

export default function SettingsSectionCard({ section }: { section: SettingSection }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-black/20">
      <div className="bg-[var(--tsl-teal)] px-5 py-3 text-center text-sm font-semibold text-white">
        <div className="text-base">{section.title}</div>
        {section.titleZh ? (
          <div className="mt-0.5 text-xs font-medium text-white/80">
            {section.titleZh}
          </div>
        ) : null}
      </div>

      <div className="divide-y divide-black/5 dark:divide-white/10">
        {section.rows.map((row) => (
          <div key={row.id} className="px-4 py-3 sm:px-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {row.label}
                  </div>
                  {row.caution ? <CautionBadge kind={row.caution} /> : null}
                </div>
                {row.labelZh ? (
                  <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {row.labelZh}
                  </div>
                ) : null}
              </div>

              <div className="shrink-0">
                {row.valueExample ? (
                  <div className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm dark:border-white/10 dark:bg-black/30 dark:text-slate-100">
                    {row.valueExample}
                    <span className="ml-1 text-slate-500 dark:text-slate-400">
                      ▾
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {row.help ? (
              <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                {row.help}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

