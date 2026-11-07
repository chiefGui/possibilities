import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ProjectTitle } from "@/features/projects/project-title";
import { projectsQuery } from "@/features/projects/queries";
import { css } from "@possibilities/ui/css";
import * as Shell from "@/layout/shell";

export const Route = createFileRoute("/workspaces/$workspaceId/projects/$projectId")({
  component: ProjectPage,
});

function ProjectPage() {
  const { workspaceId, projectId } = Route.useParams();
  const project = useSuspenseQuery(projectsQuery(workspaceId)).data.find(
    (candidate) => candidate.id === projectId,
  );

  if (!project) return <Shell.Header>Project not found</Shell.Header>;

  return (
    <Shell.Header>
      <ProjectTitle workspaceId={workspaceId} project={project} />
      {project.codebase && <span className={codebase}>{project.codebase}</span>}
    </Shell.Header>
  );
}

const codebase = css({
  marginInlineStart: "auto",
  fontWeight: "regular",
  color: "text.subtle",
});
