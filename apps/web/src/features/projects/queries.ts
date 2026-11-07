import { queryOptions } from "@tanstack/react-query";

import { call } from "@/rpc";

export const projectsQuery = (workspaceId: string) =>
  queryOptions({
    queryKey: ["workspaces", workspaceId, "projects"],
    queryFn: () => call((api) => api.projects({ workspaceId })),
    staleTime: Infinity,
  });
