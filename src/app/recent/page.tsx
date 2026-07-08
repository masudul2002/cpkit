import { PageContainer, PageHeader } from "@/components/ui/containers";
import { EmptyState } from "@/components/ui/feedback-states";
import { Clock } from "lucide-react";

export default function RecentPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Recent Activity"
        description="Your history of stress tests, input generations, and library references."
      />
      <div className="py-12">
        <EmptyState
          title="No Recent History"
          description="Your tool activity logs, runtime compilations, and copy operations will populate here."
          icon={<Clock className="h-10 w-10 text-muted-foreground/45" />}
        />
      </div>
    </PageContainer>
  );
}
