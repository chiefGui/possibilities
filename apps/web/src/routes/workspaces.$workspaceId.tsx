import * as stylex from "@stylexjs/stylex";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { CenteredPage } from "@/components/centered-page";
import { workspaceQuery, workspacesQuery } from "@/queries";
import { bg, border, fg } from "@/theme/colors.stylex";
import { radius, size, space, text, weight } from "@/theme/tokens.stylex";

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
    gap: space[4],
    width: "220px",
    flexShrink: 0,
    padding: space[2],
    borderRightWidth: 1,
    borderRightStyle: "solid",
    borderRightColor: border.default,
    backgroundColor: bg.surface,
  },
  current: {
    display: "flex",
    flexDirection: "column",
    gap: space[0.5],
    paddingBlock: space[1],
    paddingInline: space[2],
  },
  currentTitle: {
    fontWeight: weight.semibold,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: space[0.5],
  },
  sectionTitle: {
    paddingBlock: space[1],
    paddingInline: space[2],
    fontSize: text.sm,
    fontWeight: weight.medium,
    color: fg.muted,
  },
  item: {
    display: "flex",
    alignItems: "center",
    height: size.sm,
    paddingInline: space[2],
    borderRadius: radius.sm,
    color: fg.default,
    textDecoration: "none",
    backgroundColor: { default: "transparent", ":hover": bg.hover },
  },
  muted: {
    color: fg.muted,
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
