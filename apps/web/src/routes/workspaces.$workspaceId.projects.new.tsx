import { createFileRoute, useRouter } from "@tanstack/react-router";

import { prefetchRepositories } from "@/features/repositories/queries";
import { ProjectForm } from "@/features/projects/project-form";
import { Button } from "@possibilities/ui/button";
import * as CenteredPage from "@/layout/centered-page";

export const Route = createFileRoute("/workspaces/$workspaceId/projects/new")({
  loader: ({ context }) => {
    void prefetchRepositories(context.queryClient);
  },
  component: NewProject,
});

function NewProject() {
  const router = useRouter();
  const { workspaceId } = Route.useParams();

  return (
    <CenteredPage.Root>
      <CenteredPage.Title>Create a project</CenteredPage.Title>
      <ProjectForm workspaceId={workspaceId}>
        <Button type="button" variant="ghost" onClick={() => router.history.back()}>
          Cancel
        </Button>
      </ProjectForm>
    </CenteredPage.Root>
  );
}
