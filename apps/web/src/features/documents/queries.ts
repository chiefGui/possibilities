import type { DocumentRef, ProjectRef } from "@possibilities/contract";
import { queryOptions } from "@tanstack/react-query";

import { call } from "@/rpc";

export const documentsQuery = ({ workspaceId, projectId }: ProjectRef) =>
  queryOptions({
    queryKey: ["workspaces", workspaceId, "projects", projectId, "documents"],
    queryFn: () => call((api) => api.documents({ workspaceId, projectId })),
    staleTime: Infinity,
  });

export const documentQuery = (ref: DocumentRef) =>
  queryOptions({
    queryKey: [...documentsQuery(ref).queryKey, ref.name],
    queryFn: () => call((api) => api.document(ref)),
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
  });

export const writerSettingsQuery = queryOptions({
  queryKey: ["writerSettings"],
  queryFn: () => call((api) => api.writerSettings()),
  staleTime: Infinity,
});
