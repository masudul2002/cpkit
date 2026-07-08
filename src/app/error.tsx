"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Analytics hook event tracking placeholder
    console.error("Route Crash boundary caught error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-5 font-sans">
      <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/25">
        <ShieldAlert className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-black text-foreground">Something went wrong!</h3>
        <p className="text-xs text-muted-foreground max-w-sm">
          An unexpected error occurred during execution. You can retry refreshing this page context.
        </p>
      </div>
      <Button onClick={() => reset()} className="cursor-pointer gap-2">
        <RefreshCw className="h-4 w-4" />
        Retry Loading
      </Button>
    </div>
  );
}
