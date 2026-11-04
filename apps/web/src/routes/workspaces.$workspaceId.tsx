import * as stylex from "@stylexjs/stylex";
import { createFileRoute, Link } from "@tanstack/react-router";

import { workspaceQuery, workspacesQuery } from "@/features/workspaces/queries";
import { WorkspaceSidebar } from "@/features/workspaces/workspace-sidebar";
import { border, text } from "@/theme/colors.stylex";
import { size, space, weight } from "@/theme/tokens.stylex";
import * as CenteredPage from "@/ui/centered-page";

export const Route = createFileRoute("/workspaces/$workspaceId")({
  loader: async ({ context, params }) => {
    const workspace = await context.queryClient.query(workspaceQuery(params.workspaceId));
    await context.queryClient.invalidateQueries({
      queryKey: workspacesQuery.queryKey,
      exact: true,
    });
    return workspace;
  },
  component: WorkspacePage,
  errorComponent: ({ error }) => (
    <CenteredPage.Root>
      <CenteredPage.Title>Workspace unavailable</CenteredPage.Title>
      <p {...stylex.props(styles.muted, styles.message)}>
        {error instanceof Error ? error.message : String(error)}
      </p>
      <Link to="/">Back</Link>
    </CenteredPage.Root>
  ),
});

function WorkspacePage() {
  const workspace = Route.useLoaderData();

  return (
    <div {...stylex.props(styles.layout)}>
      <WorkspaceSidebar workspace={workspace} />
      <section {...stylex.props(styles.main)}>
        <header {...stylex.props(styles.header)}>{workspace.title}</header>
      </section>
    </div>
  );
}

const styles = stylex.create({
  layout: {
    display: "flex",
    flex: 1,
    minHeight: "100vh",
  },
  muted: {
    color: text.subtle,
  },
  message: {
    margin: 0,
  },
  main: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: size.row,
    paddingInline: space[4],
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: border.default,
    fontWeight: weight.medium,
  },
});
