"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";

import { APP_VERSION } from "@/constants/branding";

export function LogoBadge() {
  return (
    <Badge variant="primary" className="text-[10px] uppercase font-bold tracking-wider font-sans">
      v{APP_VERSION}
    </Badge>
  );
}
