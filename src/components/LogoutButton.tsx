"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="secondary"
      size="sm"
      className="rounded-full bg-white text-slate-950 hover:bg-white"
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
      <LogOut className="size-3.5" />
      {isPending ? "로그아웃…" : "로그아웃"}
    </Button>
  );
}
