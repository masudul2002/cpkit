"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";

export function LogoBadge() {
  return (
    <Badge variant="primary" className="text-[10px] uppercase font-bold tracking-wider font-sans">
      v1.6.1
    </Badge>
  );
}
