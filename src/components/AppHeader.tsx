"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import LogoutButton from "@/components/LogoutButton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function TopLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: active ? "secondary" : "ghost", size: "default" }),
        active
          ? "bg-white text-slate-950 shadow-sm hover:bg-white"
          : "text-white hover:bg-white/15 hover:text-white dark:text-white",
      )}
    >
      {label}
    </a>
  );
}

function MobileLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: active ? "secondary" : "ghost", size: "sm" }),
        "shrink-0",
        active
          ? "bg-white text-slate-950 hover:bg-white"
          : "text-white hover:bg-white/15 hover:text-white dark:text-white",
      )}
    >
      {label}
    </a>
  );
}

export default function AppHeader() {
  const pathname = usePathname();
  const isGuidePath = pathname === "/guide" || pathname.startsWith("/guide/");

  const [hash, setHash] = useState("");
  useEffect(() => {
    const update = () => setHash(window.location.hash || "");
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  const active = isGuidePath ? hash : "";
  const isGuide = isGuidePath && (!active || active === "#recommended");
  const isAll = isGuidePath && active === "#all";
  const isQuickCommands = isGuidePath && active === "#quick-commands";
  const isTranslation = isGuidePath && active === "#translation";

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[color:rgba(104,182,166,0.92)] text-white shadow-[0_16px_40px_rgba(15,61,53,0.16)] backdrop-blur-xl dark:border-white/10">
      <div className="mx-auto flex w-full max-w-[112rem] flex-col gap-4 px-4 py-4 sm:px-5 lg:px-8 xl:px-10 2xl:px-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <Link href="/guide" className="block truncate text-2xl font-black tracking-tight lg:text-3xl">
              TSL 셋팅 가이드
            </Link>
            <div className="mt-1 truncate text-sm font-semibold text-white/85 lg:text-base">
              🚗 대구•경북 테슬라 오너모임 by 하쿠
            </div>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <nav className="hidden flex-wrap items-center gap-2 lg:flex">
              <TopLink href="/guide#recommended" label="가이드" active={isGuide} />
              <TopLink href="/guide#all" label="모든 설정" active={isAll} />
              <TopLink
                href="/guide#quick-commands"
                label="단축 명령"
                active={isQuickCommands}
              />
              <TopLink
                href="/guide#translation"
                label="번역 기준"
                active={isTranslation}
              />
            </nav>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="mx-auto flex w-full max-w-[112rem] gap-2 overflow-x-auto px-4 pb-4 sm:px-5 lg:px-8 xl:px-10 2xl:px-12">
          <MobileLink href="/guide#recommended" label="가이드" active={isGuide} />
          <MobileLink href="/guide#all" label="모든 설정" active={isAll} />
          <MobileLink
            href="/guide#quick-commands"
            label="단축 명령"
            active={isQuickCommands}
          />
          <MobileLink
            href="/guide#translation"
            label="번역 기준"
            active={isTranslation}
          />
        </div>
      </div>
    </header>
  );
}
