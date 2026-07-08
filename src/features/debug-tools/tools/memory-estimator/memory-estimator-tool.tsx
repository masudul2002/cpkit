"use client";

import * as React from "react";
import { ToolHeader } from "../../shared/tool-header";
import { ToolLayout } from "../../shared/tool-layout";
import { InputField } from "@/features/contest-utilities/tools/shared/input-field";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, AlertTriangle } from "lucide-react";

const typeSizes: Record<string, number> = {
  int: 4,
  longlong: 8,
  double: 8,
  char: 1,
};

const typeLabels: Record<string, string> = {
  int: "int (32-bit)",
  longlong: "long long / int64_t (64-bit)",
  double: "double (64-bit float)",
  char: "char (8-bit)",
};

export function MemoryEstimatorTool() {
  const [structure, setStructure] = React.useState<"primitive" | "vector" | "matrix" | "string">("vector");
  const [dataType, setDataType] = React.useState<"int" | "longlong" | "double" | "char">("int");
  const [countVal, setCountVal] = React.useState("10000000"); // e.g. 10^7 elements for vector
  const [rowsVal, setRowsVal] = React.useState("1000");
  const [colsVal, setColsVal] = React.useState("1000");
  const [limitMb, setLimitMb] = React.useState("256");

  const handleClear = () => {
    setCountVal("10000000");
    setRowsVal("1000");
    setColsVal("1000");
  };

  const calculatedBytes = React.useMemo<number>(() => {
    const size = typeSizes[dataType];
    if (structure === "primitive") return size;
    
    if (structure === "string") {
      const len = parseInt(countVal, 10);
      return isNaN(len) ? 0 : len * 1; // 1 byte per char in string
    }

    if (structure === "vector") {
      const len = parseInt(countVal, 10);
      // overhead: vector object has ~24 bytes overhead, but elements occupy size * elem
      return isNaN(len) ? 0 : len * size + 24;
    }

    if (structure === "matrix") {
      const r = parseInt(rowsVal, 10);
      const c = parseInt(colsVal, 10);
      // std::vector<std::vector<int>> matrix has overhead: N vectors * 24 bytes + elements
      if (isNaN(r) || isNaN(c)) return 0;
      return r * c * size + r * 24 + 24;
    }

    return 0;
  }, [structure, dataType, countVal, rowsVal, colsVal]);

  const mbVal = calculatedBytes / (1024 * 1024);
  const maxLimit = parseFloat(limitMb) || 256;
  const pct = Math.min((mbVal / maxLimit) * 100, 100);

  const examples = [
    { input: "vector;int;10000000", output: "~38.15 MB", description: "10^7 integers in a flat vector" },
    { input: "matrix;int;1000;1000", output: "~3.84 MB", description: "1000x1000 grid table" },
    { input: "vector;longlong;50000000", output: "~381.47 MB (exceeds 256MB)", description: "5*10^7 long long values" },
  ];

  const notes = [
    "Typical competitive programming memory constraints are 256MB or 512MB.",
    "A flat 1D vector of $10^7$ standard 4-byte integers consumes approximately 38.15MB.",
    "Nested structures (e.g. `vector<vector<int>>`) add heap pointer overheads (~24 bytes per row).",
  ];

  return (
    <ToolLayout
      examples={examples}
      notes={notes}
      onSelectExample={(exp) => {
        const [struct, type, count, cols] = exp.split(";");
        setStructure(struct as any);
        setDataType(type as any);
        if (struct === "matrix") {
          setRowsVal(count);
          setColsVal(cols);
        } else {
          setCountVal(count);
        }
      }}
    >
      <ToolHeader
        title="Memory Estimator"
        description="Estimate heap memory footprint of vectors, matrices, and strings to avoid Memory Limit Exceeded (MLE) verdicts."
        category="Memory Check"
        difficulty="Easy"
        shortcut="Alt+Shift+8"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Configuration Panel
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="h-7 w-7 p-0 cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Structure Type</label>
              <Select value={structure} onChange={(e) => setStructure(e.target.value as any)}>
                <option value="primitive">Single Primitive Variable</option>
                <option value="vector">std::vector / 1D Array</option>
                <option value="matrix">std::vector&lt;vector&gt; / 2D Grid</option>
                <option value="string">std::string / Char Stream</option>
              </Select>
            </div>

            {structure !== "string" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80">Data Element Type</label>
                <Select value={dataType} onChange={(e) => setDataType(e.target.value as any)}>
                  <option value="int">int (4 bytes)</option>
                  <option value="longlong">long long (8 bytes)</option>
                  <option value="double">double (8 bytes)</option>
                  <option value="char">char (1 byte)</option>
                </Select>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80">Platform Limit (MB)</label>
              <Select value={limitMb} onChange={(e) => setLimitMb(e.target.value)}>
                <option value="128">128 MB</option>
                <option value="256">256 MB</option>
                <option value="512">512 MB</option>
                <option value="1024">1024 MB</option>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {(structure === "vector" || structure === "string") && (
              <div className="sm:col-span-2">
                <InputField
                  label={structure === "vector" ? "Element Count (N)" : "String Character Length"}
                  value={countVal}
                  onChange={setCountVal}
                />
              </div>
            )}

            {structure === "matrix" && (
              <>
                <InputField label="Matrix Rows (N)" value={rowsVal} onChange={setRowsVal} />
                <InputField label="Matrix Columns (M)" value={colsVal} onChange={setColsVal} />
              </>
            )}
          </div>

          {/* Result visualizer panel */}
          <div className="pt-4 border-t border-border/10 space-y-4 font-sans text-left">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
              Memory Footprint Summary
            </span>

            <div className="p-4 rounded-xl border border-border/40 bg-card/40 space-y-4">
              <div className="flex justify-between items-baseline">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-muted-foreground font-semibold">Estimated Allocation:</span>
                  <div className="text-2xl font-extrabold font-mono tracking-tight text-foreground">
                    {mbVal.toFixed(4)} <span className="text-base font-bold text-muted-foreground">MB</span>
                  </div>
                </div>

                <Badge
                  variant={mbVal > maxLimit ? "danger" : mbVal > maxLimit * 0.8 ? "warning" : "success"}
                  className="font-mono text-[9px] uppercase"
                >
                  {mbVal > maxLimit ? "MLE Risk (Exceeded)" : "Safe Capacity"}
                </Badge>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden relative border border-border/5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      mbVal > maxLimit
                        ? "bg-rose-500"
                        : mbVal > maxLimit * 0.8
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-semibold font-mono text-muted-foreground/60">
                  <span>0 MB</span>
                  <span>Limit: {maxLimit} MB</span>
                </div>
              </div>

              {/* Raw bytes */}
              <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-muted-foreground pt-1.5 border-t border-border/5">
                <div>
                  <span className="text-muted-foreground/45 block uppercase font-bold text-[8px]">
                    Total Allocation Bytes:
                  </span>
                  <span className="font-bold text-foreground/80">{calculatedBytes.toLocaleString()} bytes</span>
                </div>
                <div>
                  <span className="text-muted-foreground/45 block uppercase font-bold text-[8px]">
                    Structure Layout:
                  </span>
                  <span className="font-bold text-foreground/80">
                    {structure === "primitive"
                      ? typeLabels[dataType]
                      : structure === "vector"
                      ? `vector<${dataType}>`
                      : structure === "matrix"
                      ? `vector<vector<${dataType}>>`
                      : "string"}
                  </span>
                </div>
              </div>

              {mbVal > maxLimit && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg flex items-start gap-2.5 text-[11px] font-medium leading-normal">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    Warning: Allocation exceeds the {maxLimit}MB platform limits. Optimize array constraints or consider dynamic sizing parameters.
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
