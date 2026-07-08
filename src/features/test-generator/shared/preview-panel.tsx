"use client";

import * as React from "react";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Copy, Download, RefreshCw } from "lucide-react";

interface PreviewPanelProps {
  value: string;
  onRegenerate: () => void;
  filename?: string;
  loading?: boolean;
}

export function PreviewPanel({
  value,
  onRegenerate,
  filename = "input.txt",
  loading,
}: PreviewPanelProps) {
  const { toast } = useToast();
  const lineCount = value ? value.split("\n").length : 0;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to Clipboard",
      description: "Generated test case copied successfully.",
      variant: "success",
    });
  };

  const handleDownload = () => {
    if (!value) return;
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Download Started",
      description: `Test case saved as ${filename}.`,
      variant: "success",
    });
  };

  return (
    <div className="space-y-1.5 w-full text-left font-sans">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-muted-foreground">Generated Output Preview</span>
        <div className="flex items-center gap-2">
          {value && (
            <>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[10px] text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Copy className="h-3 w-3" />
                Copy
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="text-[10px] text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="h-3 w-3" />
                Download (.txt)
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex border border-border/45 rounded-lg overflow-hidden bg-muted/15 min-h-[160px] relative">
        {value ? (
          <>
            {/* Line Numbers Gutter */}
            <div className="w-10 bg-muted/20 border-r border-border/10 py-3 text-right pr-2.5 select-none font-mono text-[11px] leading-[20px] text-muted-foreground/35">
              {lineNumbers.map((num) => (
                <div key={num}>{num}</div>
              ))}
            </div>
            {/* Content Display */}
            <pre className="flex-1 py-3 px-3.5 font-mono text-[11.5px] leading-[20px] text-foreground overflow-y-auto overflow-x-auto whitespace-pre max-h-[300px]">
              {value}
            </pre>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center py-16 text-center font-mono text-xs text-muted-foreground/50 select-none">
            {loading ? "Generating cases..." : "Configure constraints and generate output."}
          </div>
        )}
      </div>

      <Button
        onClick={onRegenerate}
        disabled={loading}
        className="w-full justify-center gap-1.5 mt-2 cursor-pointer bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs h-9 shadow-sm"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        Regenerate Dataset
      </Button>
    </div>
  );
}
