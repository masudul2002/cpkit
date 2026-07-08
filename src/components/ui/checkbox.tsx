"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Checkbox({
  checked,
  onCheckedChange,
  disabled = false,
  className,
  id,
}: CheckboxProps) {
  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "peer h-4.5 w-4.5 shrink-0 rounded-md border border-border bg-card shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer",
        checked
          ? "bg-primary text-primary-foreground border-primary"
          : "text-transparent hover:border-primary/50",
        className
      )}
    >
      <Check className="h-3 w-3 stroke-[3.5]" />
    </button>
  );
}
