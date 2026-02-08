"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function GateForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="mt-6 grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          const res = await fetch("/api/auth", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ code }),
          });

          if (!res.ok) {
            let message = "인증 번호가 올바르지 않습니다.";
            try {
              const body = (await res.json()) as { error?: unknown };
              if (body?.error === "SERVER_MISCONFIG") {
                message =
                  "서버 설정이 완료되지 않았습니다. 관리자에게 문의해주세요.";
              }
            } catch {
              // ignore
            }
            setError(message);
            return;
          }

          router.replace("/guide");
        });
      }}
    >
      <label className="grid gap-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          인증 번호
        </span>
        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base shadow-sm outline-none ring-[var(--tsl-teal)] focus:ring-2 dark:border-white/10 dark:bg-black/20"
          placeholder="예: 1234"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </label>

      {error ? (
        <p className="text-sm font-medium text-rose-600">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="h-12 rounded-2xl bg-[var(--tsl-teal)] px-4 text-base font-semibold text-white shadow-sm hover:brightness-95 disabled:opacity-60"
      >
        {isPending ? "확인 중…" : "입장하기"}
      </button>

      <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
        로그인은 없고, 공유된 인증 번호로만 접근할 수 있습니다.
      </p>
    </form>
  );
}
