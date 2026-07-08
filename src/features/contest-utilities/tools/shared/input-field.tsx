"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  disabled?: boolean;
  type?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function InputField({
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled,
  type = "text",
  actionLabel,
  onAction,
}: InputFieldProps) {
  return (
    <div className="space-y-1.5 w-full text-left">
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
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`font-mono text-sm ${error ? "border-rose-500/50 focus-visible:ring-rose-500" : ""}`}
      />
      {error && <p className="text-[10px] text-rose-500 font-semibold">{error}</p>}
    </div>
  );
}
