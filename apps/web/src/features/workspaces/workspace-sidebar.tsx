import type { Workspace } from "@possibilities/contract";
import { House } from "lucide-react";

import { WorkspaceSwitcher } from "@/features/workspaces/workspace-switcher";
import { Icon } from "@/ui/icon";
import * as Sidebar from "@/ui/sidebar";

export function WorkspaceSidebar({ workspace }: { workspace: Workspace }) {
  return (
    <Sidebar.Root>
      <Sidebar.Header>
        <WorkspaceSwitcher workspace={workspace} />
      </Sidebar.Header>
      <Sidebar.Section>
        <Sidebar.Item
          to="/workspaces/$workspaceId"
          params={{ workspaceId: workspace.id }}
          activeOptions={{ exact: true }}
        >
          <Icon icon={House} />
          Home
        </Sidebar.Item>
      </Sidebar.Section>
    </Sidebar.Root>
  );
}
