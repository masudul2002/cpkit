import { PageContainer } from "@/components/ui/containers";
import { RandomPermutationTool } from "@/features/test-generator/tools/random-permutation/random-permutation-tool";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function RandomPermutationPage() {
  return (
    <PageContainer size="narrow">
      <div className="mb-6">
        <Link href="/test-generator">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Test Generator
          </Button>
        </Link>
      </div>
      <RandomPermutationTool />
    </PageContainer>
  );
}
