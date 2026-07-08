"use client";

import * as React from "react";
import { useToast } from "@/components/ui/toast";

interface OutputFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  isError?: boolean;
}

export function OutputField({ label, value, placeholder = "0", isError }: OutputFieldProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    if (!value || value === "Error" || value === "0") return;
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to Clipboard",
      description: `Output result value copied successfully.`,
      variant: "success",
    });
  };

  return (
    <div className="space-y-1.5 w-full text-left">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-muted-foreground">{label}</span>
        {value && value !== "Error" && value !== "0" && (
          <button
            type="button"
            onClick={handleCopy}
            className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
          >
            Copy
          </button>
        )}
      </div>
      <div
        className={`p-3 rounded-lg border font-mono text-sm break-all font-bold select-all min-h-[42px] flex items-center ${
          isError
            ? "bg-rose-500/5 text-rose-500 border-rose-500/25"
            : "bg-muted/40 text-foreground border-border/40"
        }`}
      >
        {value || <span className="text-muted-foreground/50">{placeholder}</span>}
      </div>
    </div>
  );
}
