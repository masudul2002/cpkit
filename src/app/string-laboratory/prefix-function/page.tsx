import { PageContainer } from "@/components/ui/containers";
import { PrefixFunctionTool } from "@/features/string-laboratory/tools/prefix-function/prefix-function-tool";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrefixFunctionPage() {
  return (
    <PageContainer size="narrow">
      <div className="mb-6">
        <Link href="/string-laboratory">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to String Laboratory
          </Button>
        </Link>
      </div>
      <PrefixFunctionTool />
    </PageContainer>
  );
}
