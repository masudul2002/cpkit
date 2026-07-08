"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
  0: { display: "NUL", desc: "Null char" },
  1: { display: "SOH", desc: "Start of Header" },
  2: { display: "STX", desc: "Start of Text" },
  3: { display: "ETX", desc: "End of Text" },
  4: { display: "EOT", desc: "End of Transmission" },
  5: { display: "ENQ", desc: "Enquiry" },
  6: { display: "ACK", desc: "Acknowledge" },
  7: { display: "BEL", desc: "Bell" },
  8: { display: "BS", desc: "Backspace" },
  9: { display: "TAB", desc: "Horizontal Tab" },
  10: { display: "LF", desc: "Line Feed" },
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
  32: { display: "SPC", desc: "Space" },
  127: { display: "DEL", desc: "Delete" },
};

export function AsciiTable() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");

  // Programmatically build ASCII data
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
    // Copy decimal, character, and hex
    const text = `Char: ${row.char} | Dec: ${row.dec} | Hex: ${row.hex}`;
    navigator.clipboard.writeText(row.char.length === 1 ? row.char : String(row.dec));
    toast({
      title: "Value Copied",
      description: `Copied character/decimal value to your clipboard.`,
      variant: "success",
    });
  };

  return (
    <Card className="max-w-3xl w-full mx-auto border-border/40 shadow-lg relative bg-card/65 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-border/10">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Searchable ASCII Table</span>
        </CardTitle>
        <CardDescription>
          Reference standard ASCII codes. Search by character, decimal value, binary string, or descriptions.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {/* Search Input */}
        <div className="flex max-w-sm">
          <Input
            placeholder="Search characters (e.g. 65, 0x41, A)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        {/* Responsive Table Scrollarea */}
        <ScrollArea className="h-[480px] rounded-lg border border-border/40 overflow-hidden bg-background/25">
          <table className="w-full text-left text-xs font-mono select-none">
            <thead className="sticky top-0 bg-muted/90 border-b border-border/40 text-muted-foreground uppercase text-[10px] font-bold z-10">
              <tr>
                <th className="px-4 py-3">Dec</th>
                <th className="px-4 py-3">Hex</th>
                <th className="px-4 py-3">Binary</th>
                <th className="px-4 py-3 text-primary">Char</th>
                <th className="px-4 py-3">Meaning / Description</th>
                <th className="px-4 py-3 text-center">Action</th>
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
                    <td className="px-4 py-2.5 font-bold text-foreground/80">{row.dec}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{row.hex}</td>
                    <td className="px-4 py-2.5 text-muted-foreground/60">{row.bin}</td>
                    <td className="px-4 py-2.5 font-bold text-primary text-sm">{row.char}</td>
                    <td className="px-4 py-2.5 text-muted-foreground font-sans text-[11px] truncate max-w-[180px]">
                      {row.description}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy Code"
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
  );
}
