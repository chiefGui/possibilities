import * as stylex from "@stylexjs/stylex";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { projectsQuery } from "@/features/projects/queries";
import { workspaceQuery, workspacesQuery } from "@/features/workspaces/queries";
import { WorkspaceSidebar } from "@/features/workspaces/workspace-sidebar";
import { text } from "@/theme/colors.stylex";
import * as CenteredPage from "@/ui/centered-page";
import * as Shell from "@/ui/shell";

export const Route = createFileRoute("/workspaces/$workspaceId")({
  loader: async ({ context, params }) => {
    const workspace = await context.queryClient.query(workspaceQuery(params.workspaceId));
    await Promise.all([
      context.queryClient.prefetchQuery(projectsQuery(params.workspaceId)),
      context.queryClient.invalidateQueries({ queryKey: workspacesQuery.queryKey, exact: true }),
    ]);
    return workspace;
  },
  shouldReload: ({ cause }) => cause === "enter",
  component: WorkspaceLayout,
  errorComponent: ({ error }) => (
    <CenteredPage.Root>
      <CenteredPage.Title>Workspace unavailable</CenteredPage.Title>
      <p {...stylex.props(styles.message)}>
        {error instanceof Error ? error.message : String(error)}
      </p>
      <Link to="/">Back</Link>
    </CenteredPage.Root>
  ),
});

function WorkspaceLayout() {
  const workspace = Route.useLoaderData();

  return (
    <Shell.Root>
      <WorkspaceSidebar workspace={workspace} />
      <Shell.Main>
        <Outlet />
      </Shell.Main>
    </Shell.Root>
  );
}

const styles = stylex.create({
  message: {
    margin: 0,
    color: text.subtle,
  },
});
