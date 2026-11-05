import type { Workspace } from "@possibilities/contract";
import { useQuery } from "@tanstack/react-query";
import { Add01Icon, Home01Icon, PackageIcon } from "@hugeicons-pro/core-stroke-rounded";

import { projectsQuery } from "@/features/projects/queries";
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
          <Icon icon={Home01Icon} />
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
            <Icon icon={Add01Icon} />
          </Sidebar.Action>
        </Sidebar.SectionHeader>
        {projects.map((project) => (
          <Sidebar.Item
            key={project.id}
            to="/workspaces/$workspaceId/projects/$projectId"
            params={{ workspaceId, projectId: project.id }}
          >
            <Icon icon={PackageIcon} />
            {project.title}
          </Sidebar.Item>
        ))}
      </Sidebar.Section>
    </Sidebar.Root>
  );
}
