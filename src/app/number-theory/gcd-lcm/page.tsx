import { PageContainer } from "@/components/ui/containers";
import { GcdLcmTool } from "@/features/number-theory/tools/gcd-lcm/gcd-lcm-tool";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function GcdLcmPage() {
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
      <GcdLcmTool />
    </PageContainer>
  );
}
