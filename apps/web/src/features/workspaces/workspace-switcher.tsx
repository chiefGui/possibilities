import type { Workspace } from "@possibilities/contract";
import * as stylex from "@stylexjs/stylex";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { workspacesQuery } from "@/features/workspaces/queries";
import { background, text as color } from "@possibilities/ui/theme/colors.stylex";
import { fontSize, radius, size, weight } from "@possibilities/ui/theme/tokens.stylex";
import { Icon } from "@possibilities/ui/icon";
import * as Menu from "@possibilities/ui/menu";
import * as Sidebar from "@/layout/sidebar";
import { text } from "@possibilities/ui/text";

export function WorkspaceSwitcher({ workspace }: { workspace: Workspace }) {
  const workspaces = useQuery(workspacesQuery).data ?? [workspace];

  return (
    <Menu.Root>
      <Menu.Trigger render={<Sidebar.Button />}>
        <Avatar title={workspace.title} />
        <span {...stylex.props(text.truncate, styles.title)}>{workspace.title}</span>
        <Icon name="dropdown" />
      </Menu.Trigger>
      <Menu.Popup>
        {workspaces.map((other) => (
          <Menu.LinkItem
            key={other.id}
            render={
              <Link
                to="/workspaces/$workspaceId"
                params={{ workspaceId: other.id }}
                preload={false}
              />
            }
          >
            <Avatar title={other.title} />
            {other.title}
            <Menu.Check />
          </Menu.LinkItem>
        ))}
        <Menu.Separator />
        <Menu.LinkItem render={<Link to="/workspaces/new" />}>
          <Icon name="add" />
          New workspace
        </Menu.LinkItem>
      </Menu.Popup>
    </Menu.Root>
  );
}

function Avatar({ title }: { title: string }) {
  return (
    <span aria-hidden {...stylex.props(styles.avatar)}>
      {title.charAt(0).toUpperCase()}
    </span>
  );
}

const styles = stylex.create({
  title: {
    fontWeight: weight.semibold,
  },
  avatar: {
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    width: size.icon,
    height: size.icon,
    borderRadius: radius.xs,
    fontSize: fontSize.xs,
    fontWeight: weight.semibold,
    color: color.inverse,
    backgroundColor: background.brand,
  },
});
