import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative w-full flex items-center">
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-lg border border-border/50 bg-card/30 px-3 py-2 text-sm text-foreground appearance-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 shadow-xs pr-10 cursor-pointer",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-3 text-muted-foreground pointer-events-none flex items-center justify-center">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
