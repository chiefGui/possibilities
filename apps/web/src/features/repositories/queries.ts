import { queryOptions } from "@tanstack/react-query";

import { call } from "@/rpc";

export const repositoriesQuery = queryOptions({
  queryKey: ["repositories"],
  queryFn: () => call((api) => api.repositories()),
  staleTime: Infinity,
});
