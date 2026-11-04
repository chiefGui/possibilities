import * as stylex from "@stylexjs/stylex";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { CenteredPage } from "@/components/centered-page";
import { workspaceQuery, workspacesQuery } from "@/queries";
import { colors, fontSizes, radii, dimensions, space } from "@/theme/tokens.stylex";

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
    <CenteredPage title="Workspace unavailable">
      <p {...stylex.props(styles.muted, styles.message)}>
        {error instanceof Error ? error.message : String(error)}
      </p>
      <Link to="/">Back</Link>
    </CenteredPage>
  ),
});

function WorkspacePage() {
  const workspace = Route.useLoaderData();
  const workspaces = useQuery(workspacesQuery).data ?? [];
  const others = workspaces.filter((other) => other.id !== workspace.id);

  return (
    <div {...stylex.props(styles.layout)}>
      <nav {...stylex.props(styles.sidebar)}>
        <div {...stylex.props(styles.current)}>
          <span {...stylex.props(styles.currentTitle)}>{workspace.title}</span>
          <span {...stylex.props(styles.muted)}>{workspace.repository}</span>
        </div>
        <div {...stylex.props(styles.section)}>
          <span {...stylex.props(styles.sectionTitle)}>Workspaces</span>
          {others.map((other) => (
            <Link
              key={other.id}
              to="/workspaces/$workspaceId"
              params={{ workspaceId: other.id }}
              preload={false}
              {...stylex.props(styles.item)}
            >
              {other.title}
            </Link>
          ))}
          <Link to="/workspaces/new" {...stylex.props(styles.item, styles.muted)}>
            New workspace
          </Link>
        </div>
      </nav>
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
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: space.lg,
    width: "220px",
    flexShrink: 0,
    padding: space.sm,
    borderRightWidth: 1,
    borderRightStyle: "solid",
    borderRightColor: colors.border,
    backgroundColor: colors.surface,
  },
  current: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
    paddingBlock: space.xs,
    paddingInline: space.sm,
  },
  currentTitle: {
    fontWeight: 600,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
  },
  sectionTitle: {
    paddingBlock: space.xs,
    paddingInline: space.sm,
    fontSize: fontSizes.sm,
    fontWeight: 500,
    color: colors.mutedForeground,
  },
  item: {
    display: "flex",
    alignItems: "center",
    height: dimensions.sm,
    paddingInline: space.sm,
    borderRadius: radii.sm,
    color: colors.foreground,
    textDecoration: "none",
    backgroundColor: { default: "transparent", ":hover": colors.muted },
  },
  muted: {
    color: colors.mutedForeground,
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
    height: dimensions.row,
    paddingInline: space.lg,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.border,
    fontWeight: 500,
  },
});
