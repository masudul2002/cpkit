import * as React from "react";
import { cn } from "@/lib/utils";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string;
}

export function ScrollArea({
  className,
  maxHeight = "300px",
  children,
  ...props
}: ScrollAreaProps) {
  return (
    <div
      className={cn(
        "overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin",
        className
      )}
      style={{ maxHeight }}
      {...props}
    >
      {children}
    </div>
  );
}
