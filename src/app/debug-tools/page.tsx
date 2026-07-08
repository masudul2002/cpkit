import { PageContainer } from "@/components/ui/containers";
import { DbgDashboard } from "@/features/debug-tools/components/dbg-dashboard";

export default function DebugToolsPage() {
  return (
    <PageContainer size="wide">
      <DbgDashboard />
    </PageContainer>
  );
}
