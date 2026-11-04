import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";

import { CenteredPage } from "@/components/centered-page";
import { WorkspaceForm } from "@/components/workspace-form";
import { workspacesQuery } from "@/queries";

export const Route = createFileRoute("/workspaces/new")({
  component: NewWorkspace,
});

function NewWorkspace() {
  const router = useRouter();
  const hasWorkspaces = (useQuery(workspacesQuery).data?.length ?? 0) > 0;

  return (
    <CenteredPage title="Create a workspace">
      <WorkspaceForm
        cancel={
          hasWorkspaces ? { label: "Cancel", onClick: () => router.history.back() } : undefined
        }
      />
    </CenteredPage>
  );
}
