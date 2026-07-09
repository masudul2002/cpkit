"use client";

import * as React from "react";

interface LogoWordmarkProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function LogoWordmark({ className, ...props }: LogoWordmarkProps) {
  return (
    <span
      className={`font-mono font-black text-xl tracking-tight text-foreground select-none ${className || ""}`}
      {...props}
    >
      CP<span className="text-primary">Kit</span>
    </span>
  );
}
