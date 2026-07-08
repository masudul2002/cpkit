"use client";

import * as React from "react";
import { useToast } from "@/components/ui/toast";

interface OutputViewerProps {
  label: string;
  value: string;
  placeholder?: string;
  isError?: boolean;
}

export function OutputViewer({
  label,
  value,
  placeholder = "No output available.",
  isError,
}: OutputViewerProps) {
  const { toast } = useToast();
  const lineCount = value ? value.split("\n").length : 0;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to Clipboard",
      description: "Output results copied successfully.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-1.5 w-full text-left font-sans">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-muted-foreground">{label}</span>
        {value && (
          <button
            type="button"
            onClick={handleCopy}
            className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
          >
            Copy Output
          </button>
        )}
      </div>

      <div
        className={`flex border rounded-lg overflow-hidden transition-colors ${
          isError
            ? "bg-rose-500/5 border-rose-500/25"
            : "bg-muted/15 border-border/40"
        }`}
      >
        {value ? (
          <>
            {/* Gutter */}
            <div className="w-10 bg-muted/20 border-r border-border/10 py-3 text-right pr-2.5 select-none font-mono text-[11px] leading-[20px] text-muted-foreground/35">
              {lineNumbers.map((num) => (
                <div key={num}>{num}</div>
              ))}
            </div>
            {/* Content */}
            <pre className="flex-1 py-3 px-3.5 font-mono text-[11.5px] leading-[20px] text-foreground overflow-x-auto whitespace-pre">
              {value}
            </pre>
          </>
        ) : (
          <div className="flex-1 py-4 px-4 font-mono text-[11px] text-muted-foreground/50 select-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
