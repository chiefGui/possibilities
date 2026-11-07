import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { documentParams, documentRoute } from "@/features/documents/links";
import { documentQuery, documentsQuery } from "@/features/documents/queries";
import { call } from "@/rpc";

export function useCreate(workspaceId: string, kind: "createDocument" | "createFolder") {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (folder: string) => call((api) => api[kind]({ workspaceId, path: folder })),
    onSuccess: async (path) => {
      queryClient.setQueryData(documentQuery({ workspaceId, path }).queryKey, {
        content: "",
        view: null,
      });
      queryClient.setQueryData(documentsQuery(workspaceId).queryKey, (paths) => [
        ...(paths ?? []),
        path,
      ]);
      await navigate({ to: documentRoute, params: documentParams(workspaceId, path) });
    },
  });
}
