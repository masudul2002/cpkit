import { PageContainer } from "@/components/ui/containers";
import { DivisorsTool } from "@/features/number-theory/tools/divisors/divisors-tool";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function DivisorsPage() {
  return (
    <PageContainer size="narrow">
      <div className="mb-6">
        <Link href="/number-theory">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Number Theory
          </Button>
        </Link>
      </div>
      <DivisorsTool />
    </PageContainer>
  );
}
