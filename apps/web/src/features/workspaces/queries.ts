import { queryOptions } from "@tanstack/react-query";

import { call } from "@/rpc";

export const repositoriesQuery = queryOptions({
  queryKey: ["repositories"],
  queryFn: () => call((api) => api.repositories()),
  staleTime: Infinity,
});

export const workspacesQuery = queryOptions({
  queryKey: ["workspaces"],
  queryFn: () => call((api) => api.workspaces()),
});

export const workspaceQuery = (id: string) =>
  queryOptions({
    queryKey: ["workspaces", id],
    queryFn: () => call((api) => api.openWorkspace({ id })),
  });
