"use client";

import * as React from "react";
import { ToolHeader } from "../shared/tool-header";
import { ToolLayout } from "../shared/tool-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Search, Copy } from "lucide-react";

interface AsciiRow {
  dec: number;
  hex: string;
  bin: string;
  char: string;
  description: string;
}

const CONTROL_CHARS: Record<number, { display: string; desc: string }> = {
  0: { display: "NUL", desc: "Null character" },
  1: { display: "SOH", desc: "Start of Header" },
  2: { display: "STX", desc: "Start of Text" },
  3: { display: "ETX", desc: "End of Text" },
  4: { display: "EOT", desc: "End of Transmission" },
  5: { display: "ENQ", desc: "Enquiry" },
  6: { display: "ACK", desc: "Acknowledge" },
  7: { display: "BEL", desc: "Bell (speaker beep)" },
  8: { display: "BS", desc: "Backspace" },
  9: { display: "TAB", desc: "Horizontal Tab" },
  10: { display: "LF", desc: "Line Feed (newline)" },
  11: { display: "VT", desc: "Vertical Tab" },
  12: { display: "FF", desc: "Form Feed" },
  13: { display: "CR", desc: "Carriage Return" },
  14: { display: "SO", desc: "Shift Out" },
  15: { display: "SI", desc: "Shift In" },
  16: { display: "DLE", desc: "Data Link Escape" },
  17: { display: "DC1", desc: "Device Control 1" },
  18: { display: "DC2", desc: "Device Control 2" },
  19: { display: "DC3", desc: "Device Control 3" },
  20: { display: "DC4", desc: "Device Control 4" },
  21: { display: "NAK", desc: "Negative Acknowledge" },
  22: { display: "SYN", desc: "Synchronous Idle" },
  23: { display: "ETB", desc: "End of Trans. Block" },
  24: { display: "CAN", desc: "Cancel" },
  25: { display: "EM", desc: "End of Medium" },
  26: { display: "SUB", desc: "Substitute" },
  27: { display: "ESC", desc: "Escape" },
  28: { display: "FS", desc: "File Separator" },
  29: { display: "GS", desc: "Group Separator" },
  30: { display: "RS", desc: "Record Separator" },
  31: { display: "US", desc: "Unit Separator" },
  32: { display: "SPC", desc: "Space bar" },
  127: { display: "DEL", desc: "Delete key" },
};

export function AsciiTableTool() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");

  const asciiData = React.useMemo<AsciiRow[]>(() => {
    return Array.from({ length: 128 }, (_, i) => {
      let charDisplay = String.fromCharCode(i);
      let desc = "Printable character";

      if (CONTROL_CHARS[i]) {
        charDisplay = CONTROL_CHARS[i].display;
        desc = CONTROL_CHARS[i].desc;
      }

      return {
        dec: i,
        hex: `0x${i.toString(16).toUpperCase().padStart(2, "0")}`,
        bin: i.toString(2).padStart(8, "0"),
        char: charDisplay,
        description: desc,
      };
    });
  }, []);

  const filteredData = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return asciiData;

    return asciiData.filter(
      (r) =>
        r.dec.toString() === q ||
        r.hex.toLowerCase().includes(q) ||
        r.bin.includes(q) ||
        r.char.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [search, asciiData]);

  const handleCopy = (row: AsciiRow) => {
    const copyValue = row.char.length === 1 ? row.char : String(row.dec);
    navigator.clipboard.writeText(copyValue);
    toast({
      title: "Copied",
      description: `Value ${copyValue} copied successfully.`,
      variant: "success",
    });
  };

  const examples = [
    { input: "65", output: "Char: A | Hex: 0x41", description: "Uppercase A representation" },
    { input: "97", output: "Char: a | Hex: 0x61", description: "Lowercase a representation" },
    { input: "48", output: "Char: 0 | Hex: 0x30", description: "Digit 0 representation" },
  ];

  const notes = [
    "Covers all 128 standard ASCII character representations (0 to 127).",
    "Control characters like NUL, LF, and DEL are listed with descriptions.",
    "Clicking a row copies the raw character value (or decimal code for controls).",
  ];

  return (
    <ToolLayout
      examples={examples}
      notes={notes}
      timeComplexity="O(1)"
      spaceComplexity="O(1)"
      onSelectExample={(expr) => setSearch(expr)}
    >
      <ToolHeader
        title="ASCII Reference Table"
        description="Searchable reference table mapping ASCII values to character, decimal, hex, and binary representations."
        category="Characters"
        difficulty="Easy"
        shortcut="Alt+4"
      />

      <Card className="border-border/40 bg-card/65 shadow-xs">
        <CardHeader className="flex flex-row justify-between items-center pb-2 border-b border-border/10">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Searchable Reference
          </CardTitle>
          <div className="flex max-w-[200px]">
            <Input
              placeholder="Search table..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="h-3.5 w-3.5 text-muted-foreground" />}
              className="h-8"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ScrollArea className="h-[400px] rounded-lg border border-border/40 overflow-hidden bg-background/25">
            <table className="w-full text-left text-xs font-mono select-none">
              <thead className="sticky top-0 bg-muted/90 border-b border-border/40 text-muted-foreground uppercase text-[10px] font-bold z-10">
                <tr>
                  <th className="px-4 py-2.5">Dec</th>
                  <th className="px-4 py-2.5">Hex</th>
                  <th className="px-4 py-2.5">Binary</th>
                  <th className="px-4 py-2.5 text-primary">Char</th>
                  <th className="px-4 py-2.5">Meaning</th>
                  <th className="px-4 py-2.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {filteredData.length > 0 ? (
                  filteredData.map((row) => (
                    <tr
                      key={row.dec}
                      onClick={() => handleCopy(row)}
                      className="hover:bg-accent/30 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-2 font-bold text-foreground/80">{row.dec}</td>
                      <td className="px-4 py-2 text-muted-foreground">{row.hex}</td>
                      <td className="px-4 py-2 text-muted-foreground/60">{row.bin}</td>
                      <td className="px-4 py-2 font-bold text-primary text-sm">{row.char}</td>
                      <td className="px-4 py-2 text-muted-foreground font-sans text-[11px] truncate max-w-[150px]">
                        {row.description}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy"
                        >
                          <Copy className="h-3 w-3 text-muted-foreground hover:text-primary" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No matching ASCII values found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </ScrollArea>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
