import { queryOptions } from "@tanstack/react-query";

import { call } from "./rpc";

export const environmentQuery = queryOptions({
  queryKey: ["environment"],
  queryFn: () => call((api) => api.environment()),
});

export const repositoriesQuery = queryOptions({
  queryKey: ["repositories"],
  queryFn: () => call((api) => api.repositories()),
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
