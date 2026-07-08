import { PageContainer } from "@/components/ui/containers";
import { FrequencyCompareTool } from "@/features/debug-tools/tools/frequency-compare/frequency-compare-tool";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function FrequencyComparePage() {
  return (
    <PageContainer size="narrow">
      <div className="mb-6">
        <Link href="/debug-tools">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Debug Tools
          </Button>
        </Link>
      </div>
      <FrequencyCompareTool />
    </PageContainer>
  );
}
