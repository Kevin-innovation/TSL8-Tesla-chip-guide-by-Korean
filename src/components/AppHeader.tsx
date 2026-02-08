"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import LogoutButton from "@/components/LogoutButton";

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
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
        active
          ? "bg-white/20 text-white shadow-sm"
          : "text-white/90 hover:bg-white/15 hover:text-white"
      }`}
    >
      {label}
    </Link>
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
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold text-white transition ${
        active ? "bg-white/30" : "bg-white/15"
      }`}
    >
      {label}
    </Link>
  );
}

export default function AppHeader() {
  const pathname = usePathname();
  const isGuide = pathname === "/guide" || pathname.startsWith("/guide/");
  const isShare = pathname === "/share" || pathname.startsWith("/share/");

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[var(--tsl-teal)] text-white dark:border-white/10">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <Link href="/guide" className="block truncate text-base font-extrabold">
            TSL 셋팅 공유
          </Link>
          <div className="truncate text-xs font-semibold text-white/80">
            클럽 테슬라 대경방 by 하쿠
          </div>
        </div>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 sm:flex">
            <TopLink href="/guide" label="가이드" active={isGuide} />
            <TopLink href="/share" label="셋팅 공유" active={isShare} />
          </nav>
          <LogoutButton />
        </div>
      </div>

      <div className="sm:hidden">
        <div className="mx-auto flex w-full max-w-3xl gap-2 overflow-x-auto px-4 pb-3">
          <MobileLink href="/guide" label="가이드" active={isGuide} />
          <MobileLink href="/share" label="셋팅 공유" active={isShare} />
        </div>
      </div>
    </header>
  );
}

