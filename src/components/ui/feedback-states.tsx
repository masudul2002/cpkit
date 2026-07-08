import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, FileQuestion, Ban, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/* Alert Component */
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "danger";
  title?: string;
}

export function Alert({
  variant = "info",
  title,
  children,
  className,
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(
        "flex gap-3.5 p-4 rounded-lg border text-sm leading-relaxed shadow-xs",
        {
          "bg-blue-500/5 border-blue-500/15 text-blue-600 dark:text-blue-400":
            variant === "info",
          "bg-emerald-500/5 border-emerald-500/15 text-emerald-600 dark:text-emerald-400":
            variant === "success",
          "bg-amber-500/5 border-amber-500/15 text-amber-600 dark:text-amber-400":
            variant === "warning",
          "bg-rose-500/5 border-rose-500/15 text-rose-600 dark:text-rose-400":
            variant === "danger",
        },
        className
      )}
      {...props}
    >
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="space-y-1">
        {title && <h4 className="font-bold text-foreground">{title}</h4>}
        <div className="text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

/* EmptyState Component */
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon = <FileQuestion className="h-10 w-10 text-muted-foreground/60" />,
  actionLabel,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center border border-dashed border-border/50 rounded-xl bg-card/25 min-h-[300px] space-y-4 max-w-lg mx-auto",
        className
      )}
      {...props}
    >
      <div className="p-3 bg-muted/40 rounded-full border border-border/20">
        {icon}
      </div>
      <div className="space-y-1.5">
        <h4 className="text-base font-bold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm" className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

/* ErrorState Component */
export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  retryLabel = "Try Again",
  onRetry,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center border border-destructive/20 rounded-xl bg-destructive/5 min-h-[300px] space-y-4 max-w-lg mx-auto",
        className
      )}
      {...props}
    >
      <div className="p-3 bg-destructive/10 rounded-full text-destructive">
        <Ban className="h-10 w-10" />
      </div>
      <div className="space-y-1.5">
        <h4 className="text-base font-bold text-destructive">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="danger" size="sm" className="mt-2">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
