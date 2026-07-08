import { PageContainer } from "@/components/ui/containers";
import { MemoryEstimatorTool } from "@/features/debug-tools/tools/memory-estimator/memory-estimator-tool";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function MemoryEstimatorPage() {
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
      <MemoryEstimatorTool />
    </PageContainer>
  );
}
