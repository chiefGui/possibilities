import { queryOptions } from "@tanstack/react-query";

import { call } from "@/rpc";

export const workspacesQuery = queryOptions({
  queryKey: ["workspaces"],
  queryFn: () => call((api) => api.workspaces()),
});

export const workspaceQuery = (id: string) =>
  queryOptions({
    queryKey: ["workspaces", id],
    queryFn: () => call((api) => api.openWorkspace({ id })),
  });

export const syncQuery = (id: string) =>
  queryOptions({
    queryKey: ["sync", id],
    queryFn: async ({ client }) => {
      const changed = await call((api) => api.syncWorkspace({ id }));
      if (changed) await client.invalidateQueries({ queryKey: ["workspaces", id] });
      return changed;
    },
    retry: false,
  });
