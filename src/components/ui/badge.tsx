import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold leading-none tracking-wide",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--tsl-teal)]/12 text-[var(--tsl-teal-ink)] dark:bg-[var(--tsl-teal)]/20 dark:text-white",
        secondary:
          "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200",
        warning:
          "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200",
        danger:
          "bg-rose-100 text-rose-900 dark:bg-rose-900/30 dark:text-rose-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
