"use client";

import * as React from "react";
import { LogoIcon } from "./LogoIcon";

export function LogoLoading() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in py-12">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/10 rounded-full filter blur-xl animate-pulse" />
        <LogoIcon className="h-12 w-12 text-primary animate-bounce relative" />
      </div>
      <div className="flex items-center gap-1.5 font-mono text-sm tracking-widest text-muted-foreground font-bold">
        <span>CP</span>
        <span className="text-cyan-500">Kit</span>
        <span className="animate-pulse">...</span>
      </div>
    </div>
  );
}
