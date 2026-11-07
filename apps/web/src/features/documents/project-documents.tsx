import { useQuery } from "@tanstack/react-query";

import { documentsQuery } from "@/features/documents/queries";
import { Icon } from "@possibilities/ui/icon";
import * as Sidebar from "@/layout/sidebar";

export function ProjectDocuments({
  workspaceId,
  projectId,
}: {
  workspaceId: string;
  projectId: string;
}) {
  const names = useQuery(documentsQuery({ workspaceId, projectId })).data ?? [];
  if (names.length === 0) return null;

  return (
    <Sidebar.Nested>
      {names.map((name) => (
        <Sidebar.Item
          key={name}
          to="/workspaces/$workspaceId/projects/$projectId/documents/$documentName"
          params={{ workspaceId, projectId, documentName: name }}
        >
          <Icon name="document" />
          <Sidebar.Label>{name}</Sidebar.Label>
        </Sidebar.Item>
      ))}
    </Sidebar.Nested>
  );
}
