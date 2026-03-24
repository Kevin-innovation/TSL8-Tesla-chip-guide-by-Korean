import {
  BookOpenText,
  ChevronRight,
  Languages,
  ListChecks,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import QuickCommandCatalog from "@/components/QuickCommandCatalog";
import SettingsSectionCard from "@/components/SettingsSection";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tsl8ApAssistParams, tsl8BasicSettings } from "@/content/tsl8";
import { loadTsl6Data } from "@/lib/tsl6";
import { cn } from "@/lib/utils";

const translationRules = [
  "오타나 어색한 직역은 실제 운전자가 바로 이해할 수 있는 한국어로 고칩니다.",
  "버튼 조작 표현은 두 번 누르기, 길게 누르기처럼 익숙한 말로 맞춥니다.",
  "법규 또는 안전 이슈가 있는 항목은 주의 표시를 유지합니다.",
  "앱 번역이 어색해도 중국어 원문을 함께 보여 항목을 찾기 쉽게 합니다.",
];

export default async function GuidePage() {
  const tsl6 = await loadTsl6Data();

  const basicById = new Map(tsl8BasicSettings.rows.map((row) => [row.id, row] as const));
  const recommendedBasics = [
    {
      id: "door_open_hazard",
      reason: "도어가 열릴 때 주변 차량과 보행자에게 신호를 주고 싶을 때 적합합니다.",
    },
    {
      id: "reverse_hazard",
      reason: "후진 시 시인성을 높여야 하는 환경에서 자주 사용하는 설정입니다.",
    },
    {
      id: "handle_frunk",
      reason: "프렁크를 버튼 조합으로 빠르게 열고 싶을 때 유용합니다.",
    },
    {
      id: "passenger_easy_entry",
      reason: "조수석 승하차 동작을 조건에 맞춰 자동화할 수 있습니다.",
    },
  ] as const;

  const recommendedBasicRows = recommendedBasics
    .map((item) => {
      const row = basicById.get(item.id);
      if (!row) return null;
      return { row, reason: item.reason };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const overviewStats = [
    {
      label: "AP 보조 설정",
      value: tsl8ApAssistParams.rows.length,
      icon: SlidersHorizontal,
    },
    {
      label: "기본 기능 설정",
      value: tsl8BasicSettings.rows.length,
      icon: BookOpenText,
    },
    {
      label: "단축 명령 동작",
      value: tsl6.functions.length,
      icon: ListChecks,
    },
    {
      label: "단축 명령 트리거",
      value: tsl6.entities.length,
      icon: Search,
    },
  ] as const;

  const pageLinks = [
    { href: "#recommended", title: "추천 설정" },
    { href: "#all", title: "전체 설정" },
    { href: "#quick-commands", title: "명령 찾기" },
    { href: "#translation", title: "표현 원칙" },
  ] as const;

  return (
    <div className="grid gap-5 sm:gap-6 lg:gap-8">
      <Card
        id="recommended"
        className="scroll-mt-32 overflow-hidden border-none bg-[linear-gradient(135deg,rgba(12,30,34,0.96),rgba(26,54,60,0.92)_42%,rgba(104,182,166,0.9))] text-white shadow-[0_28px_70px_rgba(15,61,53,0.22)]"
      >
        <div className="grid gap-5 px-5 py-5 sm:gap-8 sm:px-8 sm:py-8 2xl:grid-cols-[minmax(0,1fr)_620px] 2xl:items-center">
          <div className="min-w-0">
            <Badge className="bg-white/12 text-white ring-1 ring-white/15">
              TSL8 설정 안내
            </Badge>
            <h1 className="mt-3 max-w-full break-keep text-[2.45rem] leading-none font-black tracking-tight sm:mt-4 sm:text-5xl xl:text-[3.75rem]">
              TSL8 설정 안내
            </h1>
            <div className="mt-5 grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:mt-6 sm:flex sm:flex-wrap">
              <a
                href="#all"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 w-full rounded-full px-4 text-base bg-white text-slate-950 hover:bg-white/95 sm:h-14 sm:w-auto sm:px-6 sm:text-lg",
                )}
              >
                전체 설정 보기
              </a>
              <a
                href="#quick-commands"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "h-12 w-full rounded-full px-4 text-base border border-white/18 bg-white/10 text-white hover:bg-white/16 sm:h-14 sm:w-auto sm:px-6 sm:text-lg",
                )}
              >
                명령 찾기
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2">
            {overviewStats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-[22px] border border-white/12 bg-white/10 p-4 backdrop-blur sm:rounded-[24px] sm:p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold leading-5 text-white/82 sm:text-base">
                      {item.label}
                    </div>
                    <Icon className="size-4 shrink-0 text-white/82 sm:size-5" />
                  </div>
                  <div className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                    {item.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className="hidden sm:block">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl sm:text-[2rem]">바로가기</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {pageLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <div className="text-lg font-bold text-slate-900 dark:text-slate-50">
                {item.title}
              </div>
              <ChevronRight className="size-4 text-slate-400 transition group-hover:translate-x-0.5 dark:text-slate-500" />
            </a>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <BookOpenText className="size-5 text-[var(--tsl-teal)]" />
            <CardTitle className="text-2xl sm:text-[2rem]">추천 설정</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:gap-4 xl:grid-cols-2 2xl:grid-cols-4">
          {recommendedBasicRows.map(({ row, reason }) => {
            const appLabel = row.labelKoApp ?? row.label;

            return (
              <div
                key={row.id}
                className="rounded-[20px] border border-black/5 bg-slate-50 p-4 sm:rounded-[24px] dark:border-white/10 dark:bg-white/5"
              >
                <div className="break-keep text-[1.05rem] leading-7 font-bold text-slate-900 sm:text-lg dark:text-slate-50">
                  {row.label}
                </div>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {row.labelZh ? <Badge variant="secondary">중국어: {row.labelZh}</Badge> : null}
                    <Badge variant="secondary">앱 번역: {appLabel}</Badge>
                  </div>
                </div>
                <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
                  {reason}
                </p>
                {row.valueExample ? (
                  <div className="mt-3">
                    <Badge>권장 예시: {row.valueExample}</Badge>
                  </div>
                ) : null}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <section id="all" className="scroll-mt-32 grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <SlidersHorizontal className="size-5 text-[var(--tsl-teal)]" />
              <CardTitle>전체 설정</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>AP 보조 {tsl8ApAssistParams.rows.length}개</Badge>
            <Badge>기본 기능 {tsl8BasicSettings.rows.length}개</Badge>
            <Badge variant="secondary">중국어 표시</Badge>
            <Badge variant="secondary">앱 번역 표시</Badge>
          </CardContent>
        </Card>

        <SettingsSectionCard section={tsl8ApAssistParams} />
        <SettingsSectionCard section={tsl8BasicSettings} />
      </section>

      <Card id="quick-commands" className="scroll-mt-32">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <ListChecks className="size-5 text-[var(--tsl-teal)]" />
            <CardTitle>단축 명령 찾기</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <QuickCommandCatalog entities={tsl6.entities} functions={tsl6.functions} />
        </CardContent>
      </Card>

      <Card id="translation" className="scroll-mt-32">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <Languages className="size-5 text-[var(--tsl-teal)]" />
            <CardTitle>표현 원칙</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {translationRules.map((rule) => (
            <div
              key={rule}
              className="rounded-[24px] border border-black/5 bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              {rule}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
