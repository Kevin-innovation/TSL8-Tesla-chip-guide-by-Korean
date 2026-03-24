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
  "오타와 직역은 실제 차량 사용자가 이해하는 문장으로 정리합니다.",
  "버튼 조작 표현은 두 번 누르기, 길게 누르기처럼 하나의 기준으로 통일합니다.",
  "법규 또는 안전 이슈가 있는 항목은 주의 표시를 유지합니다.",
  "앱 번역이 어색해도 원문과 함께 보여 사용자가 항목을 직접 찾을 수 있게 합니다.",
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
    { href: "#recommended", title: "가이드" },
    { href: "#all", title: "모든 설정" },
    { href: "#quick-commands", title: "단축 명령 검색" },
    { href: "#translation", title: "번역 기준" },
  ] as const;

  return (
    <div className="grid gap-6 lg:gap-8">
      <Card
        id="recommended"
        className="scroll-mt-32 overflow-hidden border-none bg-[linear-gradient(135deg,rgba(12,30,34,0.96),rgba(26,54,60,0.92)_42%,rgba(104,182,166,0.9))] text-white shadow-[0_28px_70px_rgba(15,61,53,0.22)]"
      >
        <div className="grid gap-8 px-6 py-7 sm:px-8 sm:py-8 2xl:grid-cols-[minmax(0,1fr)_620px] 2xl:items-center">
          <div>
            <Badge className="bg-white/12 text-white ring-1 ring-white/15">
              TSL8 설정 가이드
            </Badge>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl xl:text-[3.75rem]">
              TSL8 설정 가이드
            </h1>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#all"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full bg-white text-slate-950 hover:bg-white/95",
                )}
              >
                모든 설정 보기
              </a>
              <a
                href="#quick-commands"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "rounded-full border border-white/18 bg-white/10 text-white hover:bg-white/16",
                )}
              >
                단축 명령 검색
              </a>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {overviewStats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-white/12 bg-white/10 p-5 backdrop-blur"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-semibold text-white/82">{item.label}</div>
                    <Icon className="size-5 text-white/82" />
                  </div>
                  <div className="mt-4 text-4xl font-black tracking-tight">{item.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-[2rem]">페이지 탐색</CardTitle>
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
            <CardTitle className="text-[2rem]">추천 시작 설정</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-4">
          {recommendedBasicRows.map(({ row, reason }) => (
            <div
              key={row.id}
              className="rounded-[24px] border border-black/5 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5"
            >
              <div className="whitespace-nowrap text-lg font-bold text-slate-900 dark:text-slate-50">
                {row.label}
              </div>
              <div className="no-scrollbar -mx-1 mt-2 overflow-x-auto px-1 pb-1">
                <div className="flex min-w-max gap-2">
                  {row.labelZh ? <Badge variant="secondary">中文: {row.labelZh}</Badge> : null}
                  {row.labelKoApp ? (
                    <Badge variant="secondary">앱 표기: {row.labelKoApp}</Badge>
                  ) : null}
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
          ))}
        </CardContent>
      </Card>

      <section id="all" className="scroll-mt-32 grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <SlidersHorizontal className="size-5 text-[var(--tsl-teal)]" />
              <CardTitle>모든 설정</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>AP 보조 {tsl8ApAssistParams.rows.length}개</Badge>
            <Badge>기본 기능 {tsl8BasicSettings.rows.length}개</Badge>
            <Badge variant="secondary">중국어 원문 포함</Badge>
            <Badge variant="secondary">앱 표기 포함</Badge>
          </CardContent>
        </Card>

        <SettingsSectionCard section={tsl8ApAssistParams} />
        <SettingsSectionCard section={tsl8BasicSettings} />
      </section>

      <Card id="quick-commands" className="scroll-mt-32">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <ListChecks className="size-5 text-[var(--tsl-teal)]" />
            <CardTitle>단축 명령 검색</CardTitle>
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
            <CardTitle>번역 기준</CardTitle>
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
