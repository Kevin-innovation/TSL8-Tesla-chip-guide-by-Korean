"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20 disabled:opacity-60"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          try {
            await fetch("/api/logout", { method: "POST" });
          } finally {
            router.replace("/gate");
          }
        });
      }}
    >
      {isPending ? "로그아웃…" : "로그아웃"}
    </button>
  );
}

