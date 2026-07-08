import * as React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: string;
}

export function Divider({
  orientation = "horizontal",
  label,
  className,
  ...props
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        className={cn("w-[1px] h-full bg-border/40 self-stretch shrink-0", className)}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        "w-full flex items-center gap-3 text-xs text-muted-foreground my-4",
        className
      )}
      {...props}
    >
      <div className="h-[1px] flex-1 bg-border/40" />
      {label && (
        <span className="font-semibold shrink-0 uppercase tracking-wider text-[10px] select-none text-muted-foreground/80">
          {label}
        </span>
      )}
      {label && <div className="h-[1px] flex-1 bg-border/40" />}
    </div>
  );
}
