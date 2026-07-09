"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { APP_VERSION } from "./brand";

interface VersionBadgeProps {
  variant?: "filled" | "outlined" | "compact";
  className?: string;
}

export function VersionBadge({ variant = "filled", className = "" }: VersionBadgeProps) {
  if (variant === "compact") {
    return (
      <span className={`text-[10px] text-muted-foreground border border-muted-foreground/30 px-1 rounded uppercase tracking-widest ${className}`}>
        v{APP_VERSION}
      </span>
    );
  }

  return (
    <Badge
      variant={variant === "outlined" ? "outline" : "primary"}
      className={`text-[10px] uppercase font-bold tracking-wider font-sans ${className}`}
    >
      v{APP_VERSION}
    </Badge>
  );
}
