import type { Workspace } from "@possibilities/contract";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Fragment } from "react";

import { ProjectDocuments } from "@/features/documents/project-documents";
import { projectsQuery } from "@/features/projects/queries";
import { SyncStatus } from "@/features/workspaces/sync-status";
import { WorkspaceSwitcher } from "@/features/workspaces/workspace-switcher";
import { Icon } from "@possibilities/ui/icon";
import * as ScrollArea from "@possibilities/ui/scroll-area";
import * as Sidebar from "@/layout/sidebar";

export function WorkspaceSidebar({ workspace }: { workspace: Workspace }) {
  const workspaceId = workspace.id;
  const projects = useQuery(projectsQuery(workspaceId)).data ?? [];
  const { projectId: activeProject } = useParams({ strict: false });

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
              <Fragment key={project.id}>
                <Sidebar.Item
                  to="/workspaces/$workspaceId/projects/$projectId"
                  params={{ workspaceId, projectId: project.id }}
                  activeOptions={{ exact: true }}
                >
                  <Icon name="project" />
                  <Sidebar.Label>{project.title}</Sidebar.Label>
                </Sidebar.Item>
                {project.id === activeProject && (
                  <ProjectDocuments workspaceId={workspaceId} projectId={project.id} />
                )}
              </Fragment>
            ))}
          </Sidebar.Section>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
      </ScrollArea.Root>
      <Sidebar.Footer>
        <SyncStatus workspaceId={workspaceId} />
      </Sidebar.Footer>
    </Sidebar.Root>
  );
}
