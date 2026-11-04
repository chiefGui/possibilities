import { queryOptions } from "@tanstack/react-query";

import { call } from "./rpc";

export const environmentQuery = queryOptions({
  queryKey: ["environment"],
  queryFn: () => call("environment"),
});

export const repositoriesQuery = queryOptions({
  queryKey: ["repositories"],
  queryFn: () => call("repositories"),
});

export const workspacesQuery = queryOptions({
  queryKey: ["workspaces"],
  queryFn: () => call("workspaces"),
});

export const workspaceQuery = (id: string) =>
  queryOptions({
    queryKey: ["workspaces", id],
    queryFn: () => call("openWorkspace", id),
  });
