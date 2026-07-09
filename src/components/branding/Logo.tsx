"use client";

import * as React from "react";
import { LogoIcon } from "./LogoIcon";
import { LogoWordmark } from "./LogoWordmark";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  showWordmark?: boolean;
}

export function Logo({ showWordmark = true, className, ...props }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className || ""}`} {...props}>
      <LogoIcon className="h-6 w-6 text-muted-foreground transition-transform duration-200 hover:scale-105" />
      {showWordmark && <LogoWordmark />}
    </div>
  );
}
