"use client";

import * as React from "react";

interface InputEditorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  actionLabel?: string;
  onAction?: () => void;
}

export function InputEditor({
  label,
  value,
  onChange,
  placeholder = "Paste output here...",
  rows = 8,
  actionLabel,
  onAction,
}: InputEditorProps) {
  const lineCount = value.split("\n").length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, rows) }, (_, i) => i + 1);

  return (
    <div className="space-y-1.5 w-full text-left font-sans">
      <div className="flex justify-between items-center text-xs">
        <label className="font-semibold text-foreground/80">{label}</label>
        {actionLabel && onAction && value && (
          <button
            type="button"
            onClick={onAction}
            className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
          >
            {actionLabel}
          </button>
        )}
      </div>

      <div className="flex border border-border/40 rounded-lg overflow-hidden bg-background/25 hover:border-border/60 transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50">
        {/* Line Numbers Gutter */}
        <div className="w-10 bg-muted/30 border-r border-border/10 py-3 text-right pr-2.5 select-none font-mono text-[11px] leading-[20px] text-muted-foreground/45">
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="flex-1 resize-none bg-transparent py-3 px-3.5 font-mono text-[11.5px] leading-[20px] text-foreground focus:outline-hidden"
        />
      </div>
    </div>
  );
}
