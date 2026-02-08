import ShareBuilder from "@/components/ShareBuilder";
import {
  tsl8QuickCommandActionSuggestions,
  tsl8QuickCommandTriggerSuggestions,
} from "@/content/tsl8";

export default async function SharePage() {
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
      </section>

      <ShareBuilder
        triggerSuggestions={tsl8QuickCommandTriggerSuggestions}
        actionSuggestions={tsl8QuickCommandActionSuggestions}
      />
    </div>
  );
}
