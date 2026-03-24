"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
        "h-11 w-full justify-center rounded-2xl px-3 text-sm font-bold",
        active
          ? "bg-white text-slate-950 shadow-sm hover:bg-white"
          : "bg-white/10 text-white hover:bg-white/15 hover:text-white dark:text-white",
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
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const update = () => setHash(window.location.hash || "");
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  useEffect(() => {
    const updateScroll = () => setIsScrolled(window.scrollY > 24);
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  const active = isGuidePath ? hash : "";
  const isGuide = isGuidePath && (!active || active === "#recommended");
  const isAll = isGuidePath && active === "#all";
  const isQuickCommands = isGuidePath && active === "#quick-commands";
  const isTranslation = isGuidePath && active === "#translation";

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[linear-gradient(180deg,rgba(104,182,166,0.94),rgba(96,177,163,0.92))] text-white shadow-[0_16px_40px_rgba(15,61,53,0.16)] backdrop-blur-xl dark:border-white/10 lg:bg-[color:rgba(104,182,166,0.92)]">
      <div
        className={cn(
          "mx-auto flex w-full max-w-[112rem] flex-col px-4 py-2.5 transition-all duration-300 sm:px-5 lg:gap-4 lg:px-8 lg:py-4 xl:px-10 2xl:px-12",
          isScrolled ? "gap-1.5" : "gap-2.5",
        )}
      >
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 max-w-full">
            <Link
              href="/guide"
              className={cn(
                "block max-w-full break-keep leading-none font-black tracking-tight transition-all duration-300 sm:text-[2.35rem] lg:text-3xl",
                isScrolled ? "text-[1.4rem]" : "text-[1.72rem]",
              )}
            >
              TSL 설정 가이드
            </Link>
            <div
              className={cn(
                "max-w-full break-keep font-semibold text-white/88 transition-all duration-300 sm:text-[1.02rem] lg:text-base",
                isScrolled
                  ? "mt-0 max-h-0 overflow-hidden opacity-0"
                  : "mt-1 max-h-10 text-[0.9rem] leading-6 opacity-100",
              )}
            >
              🚗 대구•경북 테슬라 오너모임 by 하쿠
            </div>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <nav className="hidden flex-wrap items-center gap-2 lg:flex">
              <TopLink href="/guide#recommended" label="추천 설정" active={isGuide} />
              <TopLink href="/guide#all" label="전체 설정" active={isAll} />
              <TopLink
                href="/guide#quick-commands"
                label="명령 찾기"
                active={isQuickCommands}
              />
              <TopLink
                href="/guide#translation"
                label="표현 원칙"
                active={isTranslation}
              />
            </nav>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div
          className={cn(
            "mx-auto grid w-full max-w-[112rem] grid-cols-2 gap-2 overflow-hidden px-4 transition-all duration-300 sm:px-5 lg:px-8 xl:px-10 2xl:px-12",
            isScrolled
              ? "max-h-0 translate-y-[-6px] pb-0 opacity-0 pointer-events-none"
              : "max-h-32 pb-2 opacity-100",
          )}
        >
          <MobileLink href="/guide#recommended" label="추천 설정" active={isGuide} />
          <MobileLink href="/guide#all" label="전체 설정" active={isAll} />
          <MobileLink
            href="/guide#quick-commands"
            label="명령 찾기"
            active={isQuickCommands}
          />
          <MobileLink
            href="/guide#translation"
            label="표현 원칙"
            active={isTranslation}
          />
        </div>
      </div>
    </header>
  );
}
