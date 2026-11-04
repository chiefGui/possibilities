import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";

import { workspacesQuery } from "@/features/workspaces/queries";
import { WorkspaceForm } from "@/features/workspaces/workspace-form";
import { Button } from "@/ui/button";
import * as CenteredPage from "@/ui/centered-page";

export const Route = createFileRoute("/workspaces/new")({
  component: NewWorkspace,
});

function NewWorkspace() {
  const router = useRouter();
  const hasWorkspaces = (useQuery(workspacesQuery).data?.length ?? 0) > 0;

  return (
    <CenteredPage.Root>
      <CenteredPage.Title>Create a workspace</CenteredPage.Title>
      <WorkspaceForm>
        {hasWorkspaces && (
          <Button type="button" variant="ghost" onClick={() => router.history.back()}>
            Cancel
          </Button>
        )}
      </WorkspaceForm>
    </CenteredPage.Root>
  );
}
