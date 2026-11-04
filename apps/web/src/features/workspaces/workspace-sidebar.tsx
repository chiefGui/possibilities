import type { Workspace } from "@possibilities/contract";
import * as stylex from "@stylexjs/stylex";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { workspacesQuery } from "@/features/workspaces/queries";
import { background, border, surface, text } from "@/theme/colors.stylex";
import { fontSize, radius, size, space, weight } from "@/theme/tokens.stylex";

export function WorkspaceSidebar({ workspace }: { workspace: Workspace }) {
  const others = (useQuery(workspacesQuery).data ?? []).filter(
    (other) => other.id !== workspace.id,
  );

  return (
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
  );
}

const styles = stylex.create({
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
    backgroundColor: surface.raised,
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
    fontSize: fontSize.sm,
    fontWeight: weight.medium,
    color: text.subtle,
  },
  item: {
    display: "flex",
    alignItems: "center",
    height: size.sm,
    paddingInline: space[2],
    borderRadius: radius.sm,
    color: text.default,
    textDecoration: "none",
    backgroundColor: { default: "transparent", ":hover": background.hovered },
  },
  muted: {
    color: text.subtle,
  },
});
