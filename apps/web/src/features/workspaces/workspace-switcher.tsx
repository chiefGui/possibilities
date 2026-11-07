import type { Workspace } from "@possibilities/contract";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { workspacesQuery } from "@/features/workspaces/queries";
import { css } from "@possibilities/ui/css";
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
        <span className={css(text.truncate, styles.title)}>{workspace.title}</span>
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
    <span aria-hidden className={styles.avatar}>
      {title.charAt(0).toUpperCase()}
    </span>
  );
}

const styles = {
  title: css.raw({
    fontWeight: "semibold",
  }),
  avatar: css({
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    width: "icon",
    height: "icon",
    borderRadius: "xs",
    fontSize: "xs",
    fontWeight: "semibold",
    color: "text.inverse",
    backgroundColor: "background.brand",
  }),
};
