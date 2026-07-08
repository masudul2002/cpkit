import { PageContainer } from "@/components/ui/containers";
import { BinaryCalculator } from "@/features/contest-utilities/components/binary-calculator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BinaryCalculatorPage() {
  return (
    <PageContainer size="narrow">
      <div className="mb-6">
        <Link href="/contest-utilities">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Contest Utilities
          </Button>
        </Link>
      </div>
      <BinaryCalculator />
    </PageContainer>
  );
}
