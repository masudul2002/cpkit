"use client";

import * as React from "react";
import { LogoIcon } from "./logo-icon";
import { BRAND_CONFIG } from "./brand";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "small" | "medium" | "large";
  variant?: "icon" | "wordmark" | "horizontal" | "vertical";
  showWordmark?: boolean;
}

export function Logo({
  size = "medium",
  variant = "horizontal",
  showWordmark = true,
  className = "",
  ...props
}: LogoProps) {
  let sizeClass = "h-6 w-6";
  if (size === "small") sizeClass = "h-4.5 w-4.5";
  else if (size === "large") sizeClass = "h-12 w-12";

  const renderIcon = variant !== "wordmark";
  const renderWordmark = (variant === "wordmark" || variant === "horizontal" || variant === "vertical") && showWordmark;

  return (
    <div
      className={`flex ${variant === "vertical" ? "flex-col" : "flex-row"} items-center gap-2 select-none ${className}`}
      aria-label={`${BRAND_CONFIG.name} Logo`}
      title={BRAND_CONFIG.name}
      {...props}
    >
      {renderIcon && (
        <LogoIcon className={`${sizeClass} text-muted-foreground transition-transform duration-300 hover:scale-108`} />
      )}
      {renderWordmark && (
        <span className={`font-mono font-black tracking-tight text-foreground transition-colors duration-200 ${size === "large" ? "text-3xl" : size === "small" ? "text-sm" : "text-xl"}`}>
          CP<span className="text-cyan-500">Kit</span>
        </span>
      )}
    </div>
  );
}
