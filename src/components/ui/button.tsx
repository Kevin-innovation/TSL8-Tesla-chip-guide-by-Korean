import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsl-teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-offset-black",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--tsl-teal)] text-white shadow-[0_10px_24px_rgba(104,182,166,0.28)] hover:-translate-y-0.5 hover:brightness-95",
        secondary:
          "bg-white/80 text-slate-900 shadow-sm ring-1 ring-black/5 hover:bg-white dark:bg-white/10 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/15",
        ghost:
          "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10",
        outline:
          "border border-black/10 bg-white text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-black/20 dark:text-slate-100 dark:hover:bg-white/10",
      },
      size: {
        default: "h-12 px-5 py-2",
        sm: "h-10 rounded-lg px-3.5 text-sm",
        lg: "h-14 rounded-2xl px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
