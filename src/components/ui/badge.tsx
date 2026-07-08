import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "success"
    | "warning"
    | "danger"
    | "info";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "secondary",
  size = "sm",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold transition-colors tracking-tight select-none border",
        {
          // Sizes
          "px-2 py-0.5 text-[10px]": size === "sm",
          "px-2.5 py-1 text-xs": size === "md",

          // Variants
          "bg-primary/10 border-primary/20 text-primary": variant === "primary",
          "bg-secondary border-secondary-foreground/10 text-secondary-foreground":
            variant === "secondary",
          "bg-transparent border-border text-foreground": variant === "outline",
          "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400":
            variant === "success",
          "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400":
            variant === "warning",
          "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400":
            variant === "danger",
          "bg-info/10 border-info/20 text-info": variant === "info",
        },
        className
      )}
      {...props}
    />
  );
}

/* Chip: Reusable Tag with action handler (like clear/remove) */
export interface ChipProps extends BadgeProps {
  onRemove?: () => void;
  icon?: React.ReactNode;
}

export function Chip({
  className,
  variant = "secondary",
  size = "sm",
  onRemove,
  icon,
  children,
  ...props
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-medium transition-colors tracking-tight select-none border max-w-max",
        {
          "px-2 py-0.5 text-[10px]": size === "sm",
          "px-2.5 py-1 text-xs": size === "md",

          "bg-primary/10 border-primary/20 text-primary": variant === "primary",
          "bg-secondary border-secondary-foreground/10 text-secondary-foreground":
            variant === "secondary",
          "bg-transparent border-border text-foreground": variant === "outline",
          "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400":
            variant === "success",
          "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400":
            variant === "warning",
          "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400":
            variant === "danger",
          "bg-info/10 border-info/20 text-info": variant === "info",
        },
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:bg-foreground/10 rounded-full p-0.5 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer transition-colors"
          type="button"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
