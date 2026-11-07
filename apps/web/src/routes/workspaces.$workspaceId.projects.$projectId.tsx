import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { documentsQuery } from "@/features/documents/queries";
import { ProjectContext } from "@/features/projects/project-context";
import { projectsQuery } from "@/features/projects/queries";
import * as Shell from "@/layout/shell";

export const Route = createFileRoute("/workspaces/$workspaceId/projects/$projectId")({
  loader: ({ context, params }) => context.queryClient.prefetchQuery(documentsQuery(params)),
  component: ProjectLayout,
});

function ProjectLayout() {
  const { workspaceId, projectId } = Route.useParams();
  const project = useSuspenseQuery(projectsQuery(workspaceId)).data.find(
    (candidate) => candidate.id === projectId,
  );

  if (!project) return <Shell.Header>Project not found</Shell.Header>;

  return (
    <ProjectContext value={project}>
      <Outlet />
    </ProjectContext>
  );
}
