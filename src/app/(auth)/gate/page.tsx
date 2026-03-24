import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  BookOpenText,
  KeyRound,
  ListChecks,
  ScanSearch,
  SlidersHorizontal,
} from "lucide-react";

import GateForm from "@/components/GateForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAllowedAccessCodes,
  getSessionCookieName,
  verifySessionToken,
} from "@/lib/auth";

const highlights = [
  {
    title: "TSL8 설정",
    icon: SlidersHorizontal,
  },
  {
    title: "원문 병기",
    icon: ScanSearch,
  },
  {
    title: "PDF 명령 검색",
    icon: ListChecks,
  },
];

export default async function GatePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (token && verifySessionToken(token)) redirect("/guide");

  const hasCodes = getAllowedAccessCodes().length > 0;
  const hasSecret =
    Boolean(process.env.TSL_AUTH_SECRET?.trim()) ||
    process.env.NODE_ENV !== "production";
  const canLogin = hasCodes && hasSecret;

  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_top,_rgba(104,182,166,0.18),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.82),_rgba(247,250,249,1))] pb-12 dark:bg-[radial-gradient(circle_at_top,_rgba(74,168,151,0.22),_transparent_28%),linear-gradient(180deg,_rgba(7,18,20,0.96),_rgba(7,18,20,1))]">
      <div className="mx-auto grid w-full max-w-[112rem] gap-6 px-4 pt-8 sm:px-5 lg:grid-cols-[minmax(0,1.2fr)_460px] lg:px-8 xl:px-10 2xl:px-12">
        <Card className="overflow-hidden border-none bg-[linear-gradient(135deg,rgba(12,30,34,0.98),rgba(27,55,61,0.94)_44%,rgba(104,182,166,0.88))] text-white shadow-[0_28px_70px_rgba(15,61,53,0.22)]">
          <CardHeader className="pb-5">
            <Badge className="w-fit bg-white/12 text-white ring-1 ring-white/15">
              인증 후 입장
            </Badge>
            <CardTitle className="mt-4 text-4xl text-white sm:text-5xl xl:whitespace-nowrap xl:text-[3.75rem]">
              TSL8 설정 가이드
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-white/12 bg-white/10 p-5 backdrop-blur"
                >
                  <Icon className="size-5 text-white/82" />
                  <div className="mt-4 whitespace-nowrap text-xl font-bold">
                    {item.title}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="self-start">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <KeyRound className="size-5 text-[var(--tsl-teal)]" />
              <CardTitle className="text-[2rem]">인증 번호 입력</CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            {!canLogin ? (
              <div className="rounded-[24px] bg-amber-50 px-4 py-4 text-sm font-semibold text-amber-900 dark:bg-amber-900/25 dark:text-amber-100">
                서버 설정이 완료되지 않았습니다.
                <div className="mt-2 text-sm font-medium leading-6">
                  필요한 환경변수: <span className="font-extrabold">TSL_ACCESS_CODES</span>
                  {process.env.NODE_ENV === "production" ? (
                    <>
                      , <span className="font-extrabold">TSL_AUTH_SECRET</span>
                    </>
                  ) : null}
                </div>
              </div>
            ) : (
              <GateForm />
            )}

            <div className="mt-6 rounded-[24px] border border-black/5 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-50">
                <BookOpenText className="size-4 text-[var(--tsl-teal)]" />
                접속 후 바로 보이는 내용
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge>추천 시작 설정</Badge>
                <Badge variant="secondary">모든 설정</Badge>
                <Badge variant="secondary">단축 명령 검색</Badge>
                <Badge variant="secondary">번역 기준</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mx-auto mt-6 w-full max-w-[112rem] px-4 text-center text-sm leading-6 text-slate-500 sm:px-5 lg:px-8 xl:px-10 2xl:px-12 dark:text-slate-400">
        주의: 본 사이트는 비공식 정보 공유용입니다. 주행 중 사용 금지, 지역 법규와
        안전 규정 준수.
      </div>
    </div>
  );
}
