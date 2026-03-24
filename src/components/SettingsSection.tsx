import type { SettingSection } from "@/content/tsl8";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

function CautionBadge({ kind }: { kind: "info" | "warning" }) {
  return (
    <Badge variant={kind === "warning" ? "warning" : "secondary"}>
      {kind === "warning" ? "주의" : "참고"}
    </Badge>
  );
}

export default function SettingsSectionCard({ section }: { section: SettingSection }) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-[linear-gradient(135deg,rgba(104,182,166,1),rgba(69,142,129,1))] px-5 py-5 text-left text-white sm:px-6">
        <div className="break-keep text-xl leading-tight font-black tracking-tight sm:text-2xl">
          {section.title}
        </div>
        {section.titleZh ? (
          <div className="mt-1 break-all text-base font-medium text-white/80">
            {section.titleZh}
          </div>
        ) : null}
      </div>

      <div className="divide-y divide-black/5 dark:divide-white/10">
        {section.rows.map((row) => (
          <div key={row.id} className="px-5 py-5 sm:px-6">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_max-content] md:items-start">
              <div className="min-w-0">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="break-keep text-lg leading-7 font-bold text-slate-900 sm:text-xl dark:text-slate-50">
                      {row.label}
                    </div>
                    {row.caution ? <CautionBadge kind={row.caution} /> : null}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {row.labelZh ? <Badge variant="secondary">중국어: {row.labelZh}</Badge> : null}
                    {row.labelKoApp ? (
                      <Badge variant="secondary">앱 번역: {row.labelKoApp}</Badge>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="min-w-0 md:justify-self-end">
                {row.valueExample ? (
                  <div className="inline-flex max-w-full items-center rounded-3xl border border-black/10 bg-slate-50 px-4 py-2.5 text-base font-semibold leading-6 text-slate-800 break-keep whitespace-normal shadow-sm md:whitespace-nowrap dark:border-white/10 dark:bg-black/30 dark:text-slate-100">
                    {row.valueExample}
                    <span className="ml-1 text-slate-500 dark:text-slate-400">
                      ▾
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {row.help ? (
              <p className="mt-3 break-keep text-base leading-7 text-slate-600 dark:text-slate-300">
                {row.help}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
