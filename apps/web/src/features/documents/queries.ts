import type { DocumentRef } from "@possibilities/contract";
import { queryOptions } from "@tanstack/react-query";

import { call } from "@/rpc";

export const documentsQuery = (workspaceId: string) =>
  queryOptions({
    queryKey: ["workspaces", workspaceId, "documents"],
    queryFn: () => call((api) => api.documents({ workspaceId })),
    staleTime: Infinity,
  });

export const documentQuery = ({ workspaceId, path }: DocumentRef) =>
  queryOptions({
    queryKey: [...documentsQuery(workspaceId).queryKey, path],
    queryFn: () => call((api) => api.document({ workspaceId, path })),
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
  });

export const writerSettingsQuery = queryOptions({
  queryKey: ["writerSettings"],
  queryFn: () => call((api) => api.writerSettings()),
  staleTime: Infinity,
});
