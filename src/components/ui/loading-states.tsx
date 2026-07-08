import * as React from "react";
import { cn } from "@/lib/utils";

/* Spinner Component */
export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "muted" | "white";
}

export function Spinner({
  className,
  size = "md",
  variant = "primary",
  ...props
}: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-t-transparent",
        {
          // Sizes
          "h-4 w-4 border-2": size === "sm",
          "h-6 w-6 border-2": size === "md",
          "h-10 w-10 border-3": size === "lg",

          // Variants
          "border-primary/20 border-t-primary": variant === "primary",
          "border-secondary/20 border-t-secondary-foreground": variant === "secondary",
          "border-muted/30 border-t-muted-foreground": variant === "muted",
          "border-white/20 border-t-white": variant === "white",
        },
        className
      )}
      {...props}
    />
  );
}

/* Skeleton Component (Structural loading pulse placeholders) */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/60 dark:bg-muted/30", className)}
      {...props}
    />
  );
}

/* ProgressBar Component */
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  variant?: "primary" | "success" | "warning" | "danger" | "info";
  showLabel?: boolean;
}

export function Progress({
  value,
  variant = "primary",
  showLabel = false,
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn("w-full space-y-1.5", className)} {...props}>
      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
        {showLabel && <span>Loading Progress</span>}
        {showLabel && <span>{percentage}%</span>}
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border/10">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            {
              "bg-primary": variant === "primary",
              "bg-emerald-500": variant === "success",
              "bg-amber-500": variant === "warning",
              "bg-rose-500": variant === "danger",
              "bg-info": variant === "info",
            }
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
