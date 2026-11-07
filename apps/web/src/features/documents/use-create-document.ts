import { byDocumentName } from "@possibilities/contract";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { documentQuery, documentsQuery } from "@/features/documents/queries";
import { call } from "@/rpc";

export function useCreateDocument(workspaceId: string, projectId: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const project = { workspaceId, projectId };

  return useMutation({
    mutationFn: () => call((api) => api.createDocument(project)),
    onSuccess: async (name) => {
      queryClient.setQueryData(documentQuery({ ...project, name }).queryKey, {
        content: "",
        view: null,
      });
      queryClient.setQueryData(documentsQuery(project).queryKey, (names) =>
        [...(names ?? []), name].sort(byDocumentName),
      );
      await navigate({
        to: "/workspaces/$workspaceId/projects/$projectId/documents/$documentName",
        params: { ...project, documentName: name },
      });
    },
  });
}
