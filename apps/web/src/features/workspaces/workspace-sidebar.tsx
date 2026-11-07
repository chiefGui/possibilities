import type { Workspace } from "@possibilities/contract";
import { useQuery } from "@tanstack/react-query";

import { projectsQuery } from "@/features/projects/queries";
import { SyncStatus } from "@/features/workspaces/sync-status";
import { WorkspaceSwitcher } from "@/features/workspaces/workspace-switcher";
import { Icon } from "@/ui/icon";
import * as Sidebar from "@/ui/sidebar";

export function WorkspaceSidebar({ workspace }: { workspace: Workspace }) {
  const workspaceId = workspace.id;
  const projects = useQuery(projectsQuery(workspaceId)).data ?? [];

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
      <Sidebar.Section>
        <Sidebar.SectionHeader>
          Projects
          <Sidebar.Action
            to="/workspaces/$workspaceId/projects/new"
            params={{ workspaceId }}
            aria-label="New project"
          >
            <Icon name="add" />
          </Sidebar.Action>
        </Sidebar.SectionHeader>
        {projects.map((project) => (
          <Sidebar.Item
            key={project.id}
            to="/workspaces/$workspaceId/projects/$projectId"
            params={{ workspaceId, projectId: project.id }}
          >
            <Icon name="project" />
            {project.title}
          </Sidebar.Item>
        ))}
      </Sidebar.Section>
      <Sidebar.Footer>
        <SyncStatus workspaceId={workspaceId} />
      </Sidebar.Footer>
    </Sidebar.Root>
  );
}
