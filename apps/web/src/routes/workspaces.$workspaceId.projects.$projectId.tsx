import * as stylex from "@stylexjs/stylex";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ProjectTitle } from "@/features/projects/project-title";
import { projectsQuery } from "@/features/projects/queries";
import { text } from "@possibilities/ui/theme/colors.stylex";
import { weight } from "@possibilities/ui/theme/tokens.stylex";
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
      {project.codebase && <span {...stylex.props(styles.codebase)}>{project.codebase}</span>}
    </Shell.Header>
  );
}

const styles = stylex.create({
  codebase: {
    marginInlineStart: "auto",
    fontWeight: weight.regular,
    color: text.subtle,
  },
});
