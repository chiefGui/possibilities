import type { Workspace } from "@possibilities/contract";

import { DocumentTree } from "@/features/documents/document-tree";
import { SyncStatus } from "@/features/workspaces/sync-status";
import { WorkspaceSwitcher } from "@/features/workspaces/workspace-switcher";
import { Icon } from "@possibilities/ui/icon";
import * as ScrollArea from "@possibilities/ui/scroll-area";
import * as Sidebar from "@/layout/sidebar";

export function WorkspaceSidebar({ workspace }: { workspace: Workspace }) {
  const workspaceId = workspace.id;

  return (
    <Sidebar.Root>
      <Sidebar.Header>
        <WorkspaceSwitcher workspace={workspace} />
      </Sidebar.Header>
      <Sidebar.Section>
        <Sidebar.Item
          to="/workspaces/$workspaceId"
          params={{ workspaceId }}
          activeOptions={{ exact: true }}
        >
          <Icon name="home" />
          Home
        </Sidebar.Item>
      </Sidebar.Section>
      <ScrollArea.Root>
        <ScrollArea.Viewport>
          <DocumentTree key={workspaceId} workspaceId={workspaceId} />
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.Root>
      <Sidebar.Footer>
        <SyncStatus workspaceId={workspaceId} />
      </Sidebar.Footer>
    </Sidebar.Root>
  );
}
